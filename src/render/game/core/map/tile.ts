import Color from "color";
import { Colors } from "../../utils/colors";
import { Glyph } from "../components/glyph";

export interface TileProperties {
    walkable?: boolean;
    seeThrough?: boolean;
    isVoid?: boolean;
}

export class Tile extends Glyph {

    static Void() {
        return new Tile(' ', Colors.White, Colors.Black, { seeThrough: true, isVoid: true });
    }

    static Floor() {
        return new Tile('.', Colors.StoneFloor, Colors.Black, { walkable: true, seeThrough: true });
    }

    static Wall() {
        return new Tile('#', Colors.StoneWall, Colors.Black, {});
    }

    private _hasBeenSeen = false;

    constructor(char: string, fg: Color, bg: Color, private readonly properties: TileProperties) {
        super(char, fg, bg);
    }

    setAsSeen() {
        this._hasBeenSeen = true;
    }

    hasBeenSeen() {
        return this._hasBeenSeen;
    }

    isWalkable() {
        return this.properties.walkable || false;
    }

    isSeeThrough() {
        return this.properties.seeThrough || false;
    }

    isVoid() {
        return this.properties.isVoid || false;
    }

    serialize() {
        return {
            ...super.serialize(),
            properties: {
                ...this.properties,
            }
        }
    }
}