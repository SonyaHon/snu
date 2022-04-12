import Color from "color";
import { Component } from "../esc";

export class Glyph extends Component {
    constructor(private char: string, private fg: Color, private bg: Color) {
        super();
    }

    static FromSerializedState(state: { char: string, fg: string, bg: string }) {
        return new Glyph(state.char, new Color(state.fg), new Color(state.bg));
    }

    override serialize() {
        return {
            char: this.char,
            fg: this.fg.hex(),
            bg: this.bg.hex(),
        }
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

    copy() {
        return new Glyph(this.char, this.fg, this.bg);
    }

    darken({ fg, bg }: { fg: number, bg: number }) {
        if (fg) {
            this.fg = this.fg.darken(fg);
        }
        if (bg) {
            this.bg = this.bg.darken(bg);
        }
    }
}