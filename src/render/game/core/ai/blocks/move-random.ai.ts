import { formatString } from "../../../utils/formatter";
import { getRandomArrayElem } from "../../../utils/random-array-elem";
import { NonWalkThrough } from "../../components/non-walk-through";
import { Position } from "../../components/position";
import { Include } from "../../esc";
import { Game } from "../../game";
import { MessageDispatcher } from "../../resources/message-dispatcher";
import { AI } from "../ai";

/**
 * 
 * Tries to move into a random direction 
 * if it could not move into any adjusting tile it fails
 *
 */
export const MoveRandom: AI = (self, world) => {
    const myPosition = world.getComponentFor(self, Position)!;
    const map = Game.getCurrentMap();

    const top = myPosition.copy(); top.add(new Position(0, -1));
    const left = myPosition.copy(); left.add(new Position(-1, 0));
    const right = myPosition.copy(); right.add(new Position(1, 0));
    const bottom = myPosition.copy(); bottom.add(new Position(0, 1));

    const adjustingTiles = [
        { tile: map.getTileAtPosition(top), position: top },
        { tile: map.getTileAtPosition(left), position: left },
        { tile: map.getTileAtPosition(right), position: right },
        { tile: map.getTileAtPosition(bottom), position: bottom },
    ].filter(item => item.tile?.isWalkable());

    if (adjustingTiles.length === 0) return false;

    const entitiesAtPositions = world.buildQuery().run(Include(Position), Include(NonWalkThrough)).filter(([position]) => {
        return !!adjustingTiles.find(({ position: tilePosition }) => tilePosition.isEqual(position));
    }).map(([position]) => position);

    const availableTiles = adjustingTiles.filter(item => { return !entitiesAtPositions.find(pos => item.position.isEqual(pos)) });
    if (availableTiles.length === 0) return false;

    const target = getRandomArrayElem(availableTiles);
    myPosition.setTo(target.position);
    MessageDispatcher.dispatchMessage(formatString('%{col,red} moves randomly', 'Kobold'));
    return true;
}