import { Position } from "../components/position";
import { IStartingEntityPositionEntry } from "./map";
import { Tile } from "./tile";

export abstract class MapBuilder {
    abstract build(width: number, height: number): { tiles: Tile[], playerPosition: Position, startingEntities: IStartingEntityPositionEntry[] };
}