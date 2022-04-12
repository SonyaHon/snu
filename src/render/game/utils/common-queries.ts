import { NonWalkThrough } from "../core/components/non-walk-through";
import { Position } from "../core/components/position";
import { Include, World } from "../core/esc";
import { Game } from "../core/game";

export const isTileWalkable = (world: World, position: Position): boolean => {
    if (!Game.getCurrentMap().getTileAtPosition(position)?.isWalkable()) { return false; }
    const nonWalkableEntities = world.buildQuery().run(
        Include(Position),
        Include(NonWalkThrough)
    );
    if (nonWalkableEntities.some(([pos]) => pos.isEqual(position))) { return false; }
    return true;
}