import { Glyph } from "./components/glyph";
import { Player } from "./components/player";
import { Position } from "./components/position";
import { Renderable } from "./components/renderable";
import { Entity, Include, WithEntity, World } from "./esc";
import { SysClearScreen } from "./systems/clear-screen.system";
import { SysRender } from "./systems/render.system";
import { Map } from './map/map';
import { setMapName, store } from "../react/store";
import { Camera } from "./camera";
import { DisplayManager } from "./display";
import { Actionable } from "./components/actionable";
import { NonWalkThrough } from "./components/non-walk-through";

import { NPC } from "./components/npc";
import { Named } from "./components/named";
import { Initiative } from "./components/initiative";
import { SysCountInitiative } from "./systems/count-initiative";
import { SysDoAct } from "./systems/do-act";
import { Actor } from "./components/actor";
import { Fov } from "./components/fov";
import { SysCalculateFov } from "./systems/calculate-fov";
import { RNG } from "rot-js";
import { SimpleDungeonBulder } from "./map/simple-dungeon.map-builder";

export enum GameHook {
    PlayerInput = 'hook:player-input',
    KoboldTurn = 'hook:kobold-turn',



    RoundPreparation = 'hook:round-preparation',
    RoundStart = 'hook:round-start',

    RoundTurns = 'hook:round-turns',

    RoundEnd = 'hook:round-end',
    RoundCleanup = 'hook:round-cleanup',

    ClearScreen = 'hook:clear-screen',
    Render = 'hook:render',
}

export interface SerializedGameState {
    seed: number;
    rngState: number[];
    map: {
        name: string;
        width: number;
        height: number;
        tileData: {
            char: string;
            fg: string;
            bg: string;
            properties: Record<string, string | boolean>;
            _hasBeenSeen: boolean;
        }[];
    };
    world: {
        entities: string[];
        components: Record<string, Record<string, unknown>>;
    };
    camera: {
        x: number;
        y: number;
    }
}

export const ComponentsMap = {
    [Actionable.name]: Actionable,
    [Glyph.name]: Glyph,
    [NonWalkThrough.name]: NonWalkThrough,
    [Player.name]: Player,
    [Position.name]: Position,
    [Renderable.name]: Renderable,
    [NPC.name]: NPC,
    [Named.name]: Named,
    [Initiative.name]: Initiative,
    [Actor.name]: Actor,
    [Fov.name]: Fov,
}

export class CGame {
    private readonly world = new World();
    private gameRunning = true;
    private playerEntity: Entity | null = null;
    private currentMap: Map | null = null;
    private seed: number = Math.random() * Number.MAX_SAFE_INTEGER;

    constructor() {
        // RNG
        RNG.setSeed(this.seed);

        // Hooks
        this.world.registerHook(GameHook.PlayerInput);
        this.world.registerHook(GameHook.KoboldTurn);

        this.world.registerHook(GameHook.RoundPreparation);
        this.world.registerHook(GameHook.RoundStart);
        this.world.registerHook(GameHook.RoundTurns);
        this.world.registerHook(GameHook.RoundEnd);
        this.world.registerHook(GameHook.RoundCleanup);
        this.world.registerHook(GameHook.ClearScreen);
        this.world.registerHook(GameHook.Render);

        // Components
        this.world.registerComponent(Renderable);
        this.world.registerComponent(Position);
        this.world.registerComponent(Glyph);
        this.world.registerComponent(Player);
        this.world.registerComponent(Actionable);
        this.world.registerComponent(NonWalkThrough);
        this.world.registerComponent(NPC);
        this.world.registerComponent(Named);
        this.world.registerComponent(Initiative);
        this.world.registerComponent(Actor);
        this.world.registerComponent(Fov);

        // Systems
        this.world.bindSystem(GameHook.RoundStart, SysCalculateFov);
        this.world.bindSystem(GameHook.RoundStart, SysCountInitiative);
        this.world.bindSystem(GameHook.RoundTurns, SysDoAct);

        this.world.bindSystem(GameHook.ClearScreen, SysClearScreen);
        this.world.bindSystem(GameHook.Render, SysRender);

        // Setup
        setTimeout(() => {
            this.playerEntity = this.world.createEntity(
                new Player(),
                new Renderable(),
                new Position(0, 0),
                new Glyph('@', 'yellow', 'black'),
                new Actor('player-ai'),
                new Initiative(1),
                new Fov(10),
            );
            this.loadMap(new Map(50, 50, "Dungeon 1", new SimpleDungeonBulder()));
        }, 100);

    }

    getPlayerEntity() {
        if (!this.playerEntity) {
            throw new Error("Uninitialized player");
        }
        return this.playerEntity;
    }

    getWorld() {
        return this.world;
    }

    isGameRunning() {
        return this.gameRunning;
    }

    async loop() {
        // Initial setup for proper first render
        await this.world.dispatchHook(GameHook.RoundStart);
        await this.world.dispatchHook(GameHook.Render);

        const handler = async () => {
            if (this.isGameRunning()) {
                // Game logic sequence
                await this.world.dispatchHook(GameHook.RoundPreparation);
                await this.world.dispatchHook(GameHook.RoundStart);
                await this.world.dispatchHook(GameHook.RoundTurns);
                await this.world.dispatchHook(GameHook.RoundEnd);
                await this.world.dispatchHook(GameHook.RoundCleanup);

                // Render sequence
                await this.world.dispatchHook(GameHook.ClearScreen);
                await this.world.dispatchHook(GameHook.Render);

                window.requestAnimationFrame(handler);
            } else {
                this.world.emit('loop-stopped');
            }
        };
        handler();
    }

    loadMap(map: Map) {
        // Setting the map
        this.currentMap = map;

        // Setting the player
        const playerPosition = this.world.getComponentFor(this.playerEntity!, Position)!;
        playerPosition.setTo(map.getStartingPlayerPosition());

        // Setting other entities
        map.getStartingEntitiesPositions().forEach(({ entityTemaplte, position }) => {
            const entity = this.world.createEntityFromTemplate(entityTemaplte);
            this.world.getComponentFor(entity, Position)!.setTo(position);
        });

        const { width, height } = DisplayManager.getDimensions();
        Camera.setOffset(Math.ceil(-width / 2) + playerPosition.getX(), Math.ceil(-height / 2) + playerPosition.getY());

        store.dispatch(setMapName(map.getName()));
    }

    getCurrentMap(): Map {
        if (!this.currentMap) {
            throw new Error("Map not initialized");
        }
        return this.currentMap;
    }

    serializeGameState() {
        const data = {
            seed: this.seed,
            rngState: RNG.getState(),
            map: this.getCurrentMap().serialize(),
            world: this.world.serialize(),
            camera: Camera.getOffsetAsPosition().getPosition(),
        } as SerializedGameState;
        return JSON.stringify(data);
    }

    async recoverFromSerializedState(serializedState: string) {
        this.gameRunning = false;
        await this.world.abortHooks();
        const data: SerializedGameState = JSON.parse(serializedState);
        this.seed = data.seed;
        RNG.setSeed(this.seed);
        RNG.setState(data.rngState);
        this.currentMap = Map.FromSerializedState(data.map);
        this.world.restoreFromSerializedState(ComponentsMap, data.world);
        Camera.setOffset(data.camera.x, data.camera.y);
        this.playerEntity = this.world.buildQuery().run(Include(Player), WithEntity())[0][1];
        this.world.dispatchHook(GameHook.Render);
        this.gameRunning = true;
        this.loop();
    }
}

export const Game = new CGame();
// @ts-ignore
window.game = Game;