import { Display } from "rot-js";
import { Glyph } from "../components/glyph";
import { Position } from "../components/position";

export class CDisplayManager {
    private readonly rotDisplay: Display;
    private width: number | null = null;
    private height: number | null = null;

    constructor() {
        this.rotDisplay = new Display({
            forceSquareRatio: true,
            fontFamily: "UI",
            tileHeight: 12,
        });
    }

    setDimensions(width: number, height: number) {
        const [sizeX, sizeY] = this.rotDisplay.computeSize(width, height);
        this.width = sizeX;
        this.height = sizeY;
        this.rotDisplay.setOptions({ width: sizeX, height: sizeY });
    }

    getDimensions() {
        if (!this.width || !this.height) {
            throw new Error("Game uninitialized");
        }
        return {
            width: this.width,
            height: this.height,
        }
    }

    getContainer() {
        return this.rotDisplay.getContainer();
    }

    drawGlyphAtScreenPosition(position: Position, glyph: Glyph) {
        this.rotDisplay.draw(position.getX(), position.getY(), glyph.getChar(), glyph.getFg(), glyph.getBg());
    }

    clearScreen() {
        this.rotDisplay.clear();
    }

    get Center(): Position {
        const { width, height } = this.getDimensions();
        return new Position(
            Math.floor(width / 2),
            Math.floor(height / 2)
        );
    }
}

export const DisplayManager = new CDisplayManager();