import { Colors } from "../../../utils/colors";
import { formatString } from "../../../utils/formatter";
import { getRandomArrayElem } from "../../../utils/random-array-elem";
import { AttackerMelee } from "../../components/attacker-melee";
import { Health } from "../../components/health";
import { Named } from "../../components/named";
import { Player } from "../../components/player";
import { Entity, World } from "../../esc";
import { MessageDispatcher } from "../../resources/message-dispatcher";
const meleeReplics: ((target: string, dmg: string, isCritical: boolean) => string)[] = [
    (target: string, dmg: string) => `A heavy fist landed on ${target} head, dealing ${dmg} dmg`,
    (targer: string, dmg: string) => `An uppercut deals ${dmg} dmg to ${targer}`,
];
export const MeleeAttack = (world: World, attacker: Entity, defender: Entity): boolean => {
    const attackerName = world.getComponentFor(attacker, Named);
    const attackerDmg = world.getComponentFor(attacker, AttackerMelee);
    const defenderName = world.getComponentFor(defender, Named);
    const defenderHp = world.getComponentFor(defender, Health);
    const isDefenderPlayer = !!world.getComponentFor(defender, Player);
    const attackDmg = attackerDmg?.getBaseDamage();

    if (defenderHp && attackDmg) {
        defenderHp.add(-attackDmg);
    }

    const defenderFormatter = `%{col,${isDefenderPlayer ? Colors.White.hex() : Colors.LogEnemyRed.hex()}}`;
    const dmgFormatter = '%{col,white}';

    MessageDispatcher.dispatchMessage(formatString(
        getRandomArrayElem(meleeReplics)(defenderFormatter, dmgFormatter, false),
        defenderName?.getName() || 'a thing',
        attackDmg?.toString() || '',
    ));

    return true;
}