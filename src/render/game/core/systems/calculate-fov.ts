import { FOV } from "rot-js";
import { Fov } from "../components/fov";
import { Position } from "../components/position";
import { Include, System } from "../esc";
import { Game } from "../game";

export const SysCalculateFov: System = (world) => {
    const entities = world.buildQuery().run(
        Include(Position),
        Include(Fov)
    );
    const map = Game.getCurrentMap();

    const fovCalculator = new FOV.PreciseShadowcasting((x, y) => {
        return !!map.getTileAt(x, y)?.isSeeThrough();
    });
    entities.forEach(([position, fov]) => {
        const newFov: Position[] = [];
        fovCalculator.compute(position.getX(), position.getY(), fov.getViewDistance(), (x, y) => {
            newFov.push(new Position(x, y));
        });
        fov.setTilesInView(newFov);
    });
}