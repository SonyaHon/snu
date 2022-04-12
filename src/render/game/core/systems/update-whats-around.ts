import { setSeenEntities, store } from "../../react/store";
import { Creature } from "../components/creature";
import { Fov } from "../components/fov";
import { Glyph } from "../components/glyph";
import { Named } from "../components/named";
import { Player } from "../components/player";
import { Position } from "../components/position";
import { Renderable } from "../components/renderable";
import { Include, System } from "../esc";
import { Game } from "../game";

export const SysUpdateWhatsAround: System = (world) => {
    const playerFov = world.getComponentFor(Game.getPlayerEntity(), Fov);
    const seenCreatures = world.buildQuery().run(
        Include(Position),
        Include(Glyph),
        Include(Named),
        Include(Creature),
        Include(Renderable),
    ).filter(([position]) => {
        return playerFov?.canSee(position);
    }).map(([, glyph, named]) => {
        return {
            icon: glyph.getChar(),
            name: named.getName(),
            fg: glyph.getFg().hex(),
            bg: glyph.getBg().hex()
        }
    });
    store.dispatch(setSeenEntities({ creatures: seenCreatures }));
}