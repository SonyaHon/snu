import { Component } from "../esc";
import { Position } from "./position";

export class Fov extends Component {

    private tilesInView: Position[] = [];

    constructor(private viewDistance: number) {
        super();
    }

    setViewDistance(viewDistance: number) {
        this.viewDistance = viewDistance;
    }

    getViewDistance() {
        return this.viewDistance;
    }

    setTilesInView(tiles: Position[]) {
        this.tilesInView = tiles;
    }

    getTilesInView() {
        return this.tilesInView;
    }

    canSee(pos: Position) {
        return this.tilesInView.some(p => p.isEqual(pos));
    }

    static FromSerializedState(state: { tilesInView: { x: number, y: number }[], viewDistance: number }) {
        const fov = new Fov(state.viewDistance);
        fov.setTilesInView(state.tilesInView.map(({ x, y }) => new Position(x, y)));
        return fov;
    }
}