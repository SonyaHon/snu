import { Glyph } from "../components/glyph";

export interface TileProperties {
    walkable?: boolean;
    seeThrough?: boolean;
    isVoid?: boolean;
}

export class Tile extends Glyph {

    static Void() {
        return new Tile(' ', 'white', 'black', { seeThrough: true, isVoid: true });
    }

    static Floor() {
        return new Tile('.', 'darkgrey', 'black', { walkable: true, seeThrough: true });
    }

    static Wall() {
        return new Tile('#', 'grey', 'black', {});
    }

    private _hasBeenSeen = false;

    constructor(char: string, fg: string, bg: string, private readonly properties: TileProperties) {
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
        return JSON.parse(JSON.stringify(this));
    }
}