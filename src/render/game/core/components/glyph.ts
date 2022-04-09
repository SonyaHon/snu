import { Component } from "../esc";

export class Glyph extends Component {
    constructor(private char: string, private fg: string, private bg: string) {
        super();
    }

    static FromSerializedState(data: Glyph) {
        return new Glyph(data.char, data.fg, data.bg);
    }

    getChar() {
        return this.char;
    }

    getFg() {
        return this.fg;
    }

    getBg() {
        return this.bg;
    }
}