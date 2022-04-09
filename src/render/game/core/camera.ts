import { Position } from "./components/position";
import { DisplayManager } from "./display";

export class CCamera {

    private offsetX: number = 0;
    private offsetY: number = 0;

    setOffset(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;
    }

    addOffset(x: number, y: number) {
        this.offsetX += x;
        this.offsetY += y;
    }


    positionInScreen(position: Position) {
        const { x, y } = position.getPosition();
        const { width, height } = DisplayManager.getDimensions();
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    mapToScreenPosition(position: Position): Position {
        const { x, y } = position.getPosition();
        return new Position(x - this.offsetX, y - this.offsetY);
    }

    screenToMapPosition(position: Position): Position {
        const { x, y } = position.getPosition();
        return new Position(x + this.offsetX, y + this.offsetY);
    }

    getOffsetAsPosition(): Position {
        return new Position(this.offsetX, this.offsetY);
    }
}

export const Camera = new CCamera();