import { DiceDmg } from "../../utils/dice-dmg";
import { Component } from "../esc";

export class AttackerMelee extends Component {
    constructor(private baseDamage: DiceDmg) {
        super();
    }

    getBaseDamage() {
        return this.baseDamage.rollSumm();
    }

    setBaseDamage(dmg: DiceDmg) {
        this.baseDamage = dmg;
    }

    static FromSerializedState(state: { baseDamage: {diceCount: number, diceFaces: number} }) {
        return new AttackerMelee(DiceDmg.FromData(state.baseDamage.diceCount, state.baseDamage.diceFaces));
    }
}