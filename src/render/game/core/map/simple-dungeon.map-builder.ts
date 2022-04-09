import { Position } from "../components/position";
import { IStartingEntityPositionEntry } from "./map";
import { MapBuilder } from "./map-builder";
import { Tile } from "./tile";
import { Map as RotMap } from 'rot-js';
import { getRandomArrayElem } from "../../utils/random-array-elem";

export class SimpleDungeonBulder extends MapBuilder {
    build(width: number, height: number): { tiles: Tile[]; playerPosition: Position; startingEntities: IStartingEntityPositionEntry[]; } {
        const digger = new RotMap.Digger(width, height);
        const tiles: Tile[] = new Array(width * height);

        digger.create((x, y, contents) => {
            if (contents === 1) {
                tiles[y * width + x] = Tile.Wall();
            } else {
                tiles[y * width + x] = Tile.Floor();
            }
        });

        const [playerX, playerY] = getRandomArrayElem(digger.getRooms()).getCenter();
        const playerPosition = new Position(playerX, playerY);

        return {
            tiles,
            playerPosition,
            startingEntities: []
        }
    }
}