import { isTileWalkable } from "../../utils/common-queries";
import { Fov } from "../components/fov";
import { Position } from "../components/position";
import { Game } from "../game";
import { AI } from "./ai";
import { MoveRandom } from "./blocks/move-random.ai";
import { MeleeAttack } from "./common-actions/melee-attack";

export const KoboldAI: AI = (self, world) => {
    const playerPosition = world.getComponentFor(Game.getPlayerEntity(), Position)!;
    const myFov = world.getComponentFor(self, Fov)!;
    if (myFov.canSee(playerPosition)) {
        // chase the player
        const myPosition = world.getComponentFor(self, Position)!;

        if (myPosition.distanceTo(playerPosition) === 1) {
            return MeleeAttack(world, self, Game.getPlayerEntity());
        }

        const targetPositions = myPosition.goTo(playerPosition);
        const targetPosition = targetPositions.find(pos => isTileWalkable(world, pos));
        if (!targetPosition) {
            return MoveRandom(self, world);
        } else {
            console.debug('Setting position to', targetPosition);

            myPosition.setTo(targetPosition);
        }
    } else {
        return MoveRandom(self, world);
    }
    return true;
}