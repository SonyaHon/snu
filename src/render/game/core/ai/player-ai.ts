import { AI } from "./ai";
import { KeyboardEvent } from "react";
import { Camera } from "../camera";
import { Actionable } from "../components/actionable";
import { NonWalkThrough } from "../components/non-walk-through";
import { Position } from "../components/position";
import { Entity, Include, WithEntity, World } from "../esc";
import { Game } from "../game";
import { Hostile } from "../components/hostile";
import { MeleeAttackable } from "../components/melee-attackable";
import { MeleeAttack } from "./common-actions/melee-attack";

const movePlayer = (self: Entity, world: World, x: number, y: number): boolean => {
    const position = world.getComponentFor(self, Position)!;
    const targetPosition = position.copy();
    targetPosition.add(new Position(x, y));
    const { x: targetX, y: targetY } = targetPosition.getPosition();
    const tile = Game.getCurrentMap().getTileAt(targetX, targetY);
    if (tile && tile.isWalkable()) {
        const meleeAttackableEntities = world.buildQuery().run(
            Include(Position),
            WithEntity(),
            Include(MeleeAttackable),
            Include(Hostile),
        );
        const bumpedEntity = meleeAttackableEntities.find(([position]) => position.isEqual(targetPosition));
        if (bumpedEntity) {
            const [, defender] = bumpedEntity;
            return MeleeAttack(world, self, defender);
        } else {
            const nonWalkableEntities = world.buildQuery().run(Include(Position), Include(NonWalkThrough));
            if (nonWalkableEntities.some(([position]) => {
                return position.isEqual(targetPosition);
            })) {
                return false;
            }
            position.setTo(targetPosition);
            Camera.addOffset(x, y);
            return true
        }
    }
    return false;
}

export type KeyBindingHandler = (self: Entity, world: World) => boolean | Promise<boolean>;
export const keyBindings: Record<string, KeyBindingHandler> = {
    'w': async (self: Entity, world: World) => {
        return movePlayer(self, world, 0, -1);
    },
    'a': async (self: Entity, world: World) => {
        return movePlayer(self, world, -1, 0);
    },
    's': async (self: Entity, world: World) => {
        return movePlayer(self, world, 0, 1);
    },
    'd': async (self: Entity, world: World) => {
        return movePlayer(self, world, 1, 0);
    },
    ' ': async (self: Entity, world: World) => {
        const actionableItem = world.buildQuery().run(
            Include(Actionable),
            WithEntity()
        )[0];
        if (!actionableItem) {
            return false;
        }
        const [actionable, entity] = actionableItem;
        return (await actionable.runEffects(entity, world)).some(el => el);
    }
}
const STOP_HOOK = Symbol();
const waitForUserInput = (world: World): Promise<KeyboardEvent | typeof STOP_HOOK> => {
    return new Promise((resolve, reject) => {
        const windowHandler = (event: KeyboardEvent) => {
            clearCallbacks();
            resolve(event);
        }
        const abortHandler = () => {
            clearCallbacks();
            resolve(STOP_HOOK);
        }
        const clearCallbacks = () => {
            window.removeEventListener('keydown', windowHandler as any);
            world.off('stop-hook', abortHandler);
        }
        window.addEventListener('keydown', windowHandler as any, { once: true });
        world.on('stop-hook', abortHandler);
    });
}

export const PlayerAI: AI = async (self, world) => {
    let handler: KeyBindingHandler | null = null;
    let handlerComplete: boolean = false;
    while (!handlerComplete) {
        while (!handler) {
            const result = await waitForUserInput(world);
            if (result === STOP_HOOK) { return false; }

            handler = keyBindings[result.key];
            if (!handler) {
                console.debug(`Unergistered key <${result.key}> is pressed`);
            }
        }

        handlerComplete = await handler(self, world);
        if (!handlerComplete) {
            handler = null;
        }
    }
    return true;
}