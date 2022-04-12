import Color from "color";
import { Camera } from "../camera";
import { Position } from "../components/position";
import { DisplayManager } from "../display";
import { DoorTemplate } from "../entity-templates";
import { Entity } from "../esc";
import { SerializedGameState } from "../game";
import { MapBuilder } from "./map-builder";
import { Tile } from "./tile";

export interface IStartingEntityPositionEntry {
    entityTemaplte: ReturnType<typeof Entity.CreateTemplate>;
    position: Position;
}

export class Map {
    private staticTiles: Tile[] = [];
    private startingPlayerPosition: Position | null = null;
    private startingEntities: IStartingEntityPositionEntry[] = [];


    static FromSerializedState(serializedState: SerializedGameState['map']): Map {
        const map = new Map(serializedState.width, serializedState.height, serializedState.name);
        map.staticTiles = serializedState.tileData.map((td) => {
            const t = new Tile(td.char, new Color(td.fg), new Color(td.bg), td.properties);
            if (td._hasBeenSeen) {
                t.setAsSeen();
            }
            return t;
        });
        return map;
    }

    constructor(private readonly width: number, private readonly height: number, private readonly name: string, builder?: MapBuilder) {
        if (builder) {
            const { tiles, playerPosition, startingEntities } = builder.build(width, height);
            this.staticTiles = tiles;
            this.startingPlayerPosition = playerPosition;
            this.startingEntities = startingEntities;
        }
    }

    getStartingPlayerPosition() {
        if (!this.startingPlayerPosition) {
            throw new Error("Starting position is not initialzied");
        }
        return this.startingPlayerPosition;
    }

    addViwedTiles(tiles: Position[]) {
        tiles.forEach(tile => {
            this.getTileAt(tile.getX(), tile.getY())?.setAsSeen();
        })
    }

    getTilesInCamera(): { tile: Tile, position: Position }[] {
        const { x: offsetX, y: offsetY } = Camera.getOffsetAsPosition().getPosition();
        const { width: screenWidth, height: screenHeight } = DisplayManager.getDimensions();

        let result: { tile: Tile, position: Position }[] = [];
        for (let y = offsetY; y < offsetY + screenHeight; y++) {
            for (let x = offsetX; x < offsetX + screenWidth; x++) {
                const tile = this.getTileAt(x, y);
                if (!tile || !tile.hasBeenSeen()) result.push({ tile: Tile.Void(), position: new Position(x, y) });
                else result.push({ tile, position: new Position(x, y) });
            }
        }
        return result;
    }

    getTileAt(x: number, y: number): Tile | null {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            return this.staticTiles[y * this.width + x];
        }
        return null;
    }

    getTileAtPosition(position: Position) {
        const { x, y } = position.getPosition();
        return this.getTileAt(x, y);
    }

    getName() {
        return this.name;
    }

    getStartingEntitiesPositions(): IStartingEntityPositionEntry[] {
        return this.startingEntities;
    }

    serialize() {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            tileData: this.staticTiles.map(tile => tile.serialize()),
        };
    }
}