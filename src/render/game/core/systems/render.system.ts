import { Camera } from "../camera";
import { Fov } from "../components/fov";
import { Glyph } from "../components/glyph";
import { Player } from "../components/player";
import { Position } from "../components/position";
import { Renderable } from "../components/renderable";
import { DisplayManager } from "../display";
import { Exclude, Include, Optionally, System, World } from "../esc";
import { Game } from "../game";

export const SysRender: System = (world: World) => {
    const { width, height } = DisplayManager.getDimensions();
    const playerFov = world.getComponentFor(Game.getPlayerEntity(), Fov)!;
    const map = Game.getCurrentMap();
    map.addViwedTiles(playerFov.getTilesInView());
    const tiles = map.getTilesInCamera();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const { tile, position: worldPosition } = tiles[idx];
            if (playerFov.canSee(worldPosition) || tile.isVoid()) {
                DisplayManager.drawGlyphAtScreenPosition(new Position(x, y), tile);
            } else {
                const renderTarget = tile.copy();
                renderTarget.darken({ fg: 0.5, bg: 0.5 });
                DisplayManager.drawGlyphAtScreenPosition(new Position(x, y), renderTarget);
            }
        }
    }

    // Render all except player
    world.buildQuery().run(
        Include(Position),
        Include(Glyph),
        Include(Renderable),
        Exclude(Player),
    ).forEach(([position, glyph]) => {
        const screenPosition = Camera.mapToScreenPosition(position);
        if (Camera.positionInScreen(screenPosition) && playerFov.canSee(position)) {
            DisplayManager.drawGlyphAtScreenPosition(screenPosition, glyph);
        }
    });

    // Render player last
    world.buildQuery().run(
        Include(Glyph),
        Include(Player),
    ).forEach(([glyph]) => {
        DisplayManager.drawGlyphAtScreenPosition(DisplayManager.Center, glyph);
    });
}