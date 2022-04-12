import { Colors } from "../../utils/colors";
import { formatString } from "../../utils/formatter";
import { Health } from "../components/health";
import { Hostile } from "../components/hostile";
import { Mortal } from "../components/mortal";
import { Named } from "../components/named";
import { Include, Optionally, System, WithEntity } from "../esc";
import { MessageDispatcher } from "../resources/message-dispatcher";

export const SysMortalsDie: System = (world) => {
    world.buildQuery().run(
        Include(Health),
        WithEntity(),
        Optionally(Named),
        Optionally(Hostile),
        Include(Mortal),
    ).forEach(([health, entity, named, hostile]) => {
        if (health.getHP() <= 0) {
            if (named) {
                const name = named.getName();
                const isHostile = !!hostile;

                MessageDispatcher.dispatchMessage(formatString(`%{col,${isHostile ? Colors.LogEnemyRed.hex() : Colors.White.hex()}} has died in agony`, name));
            }
            world.removeEntity(entity);
        }
    });
}