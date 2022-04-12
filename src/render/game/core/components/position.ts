import { RNG } from "rot-js";
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

    /**
     * Calculates an array of possible moves to become closer
     * to the passed position
     * 
     * @param position 
     * @returns 
     */
    goTo(position: Position): Position[] {
        if (this.x === position.x) {
            return [new Position(this.x, this.y > position.y ? this.y - 1 : this.y + 1)];
        }
        if (this.y === position.y) {
            return [new Position(this.x > position.x ? this.x - 1 : this.x + 1, this.y)];
        }
        if (this.x > position.x && this.y < position.y) {
            const shuffle = RNG.getPercentage() > 50;
            return shuffle
                ? [new Position(this.x - 1, this.y), new Position(this.x, this.y + 1)]
                : [new Position(this.x, this.y + 1), new Position(this.x - 1, this.y)];
        }
        if (this.x > position.x && this.y > position.y) {
            const shuffle = RNG.getPercentage() > 50;
            return shuffle
                ? [new Position(this.x - 1, this.y), new Position(this.x, this.y - 1)]
                : [new Position(this.x, this.y - 1), new Position(this.x - 1, this.y)];
        }
        if (this.x < position.x && this.y < position.y) {
            const shuffle = RNG.getPercentage() > 50;
            return shuffle
                ? [new Position(this.x + 1, this.y), new Position(this.x, this.y + 1)]
                : [new Position(this.x, this.y + 1), new Position(this.x + 1, this.y)];
                
        }
        const shuffle = RNG.getPercentage() > 50;
        return shuffle
            ? [new Position(this.x + 1, this.y), new Position(this.x, this.y - 1)]
            : [new Position(this.x, this.y - 1), new Position(this.x + 1, this.y)];
    }

    /**
     * 
     * Returns Mahatance distance to tile
     * 
     * @param position 
     * @returns 
     */
    distanceTo(position: Position): number {
        return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
    }
}