import { Map as RotMap } from 'rot-js';
import { Position } from "../components/position";
import { IStartingEntityPositionEntry } from "./map";
import { MapBuilder } from "./map-builder";
import { Tile } from "./tile";
import { getRandomArrayElem } from "../../utils/random-array-elem";
import { KoboldTemplate } from "../entity-templates";

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

        const startingEntities: IStartingEntityPositionEntry[] = digger.getRooms().map(room => {
            const [x, y] = room.getCenter();
            return new Position(x, y);
        }).filter(position => !position.isEqual(playerPosition)).map(monsterPosition => ({
            position: monsterPosition,
            entityTemaplte: KoboldTemplate
        }));

        return {
            tiles,
            playerPosition,
            startingEntities,
        }
    }
}