import { Position } from "../components/position";
import { DoorTemplate, KoboldTemplate } from "../entity-templates";
import { IStartingEntityPositionEntry } from "./map";
import { MapBuilder } from "./map-builder";
import { Tile } from "./tile";

export class DemoMapBuilder extends MapBuilder {

    build(width: number, height: number) {
        const tiles: Tile[] = [];
        const playerPosition = new Position(Math.ceil(width / 2), Math.ceil(height / 2));
        const startingEntities: IStartingEntityPositionEntry[] = [{
            entityTemaplte: DoorTemplate,
            position: new Position(5, 5),
        }, {
            entityTemaplte: KoboldTemplate,
            position: new Position(13, 13),
        }];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = (x === 0 || y === 0 || x === width - 1 || y === height - 1) ? Tile.Wall() : Tile.Floor();
                tiles.push(tile);
            }
        }

        return {
            tiles,
            playerPosition,
            startingEntities
        }
    }

}