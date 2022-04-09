import { ILoggable } from "../../utils/formatter";
import { Component } from "../esc";

export class Position extends Component implements ILoggable {
    constructor(private x: number, private y: number) {
        super();
    }

    static FromSerializedState(data: Position) {
        return new Position(data.x, data.y);
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    setTo(position: Position) {
        this.x = position.getX();
        this.y = position.getY();
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    add(position: Position) {
        this.x += position.x;
        this.y += position.y;
    }

    toString(): string {
        return `${this.x}:${this.y}`;
    }

    copy() {
        return new Position(this.x, this.y);
    }

    isEqual(position: Position) {
        return this.x === position.x && this.y === position.y;
    }
}