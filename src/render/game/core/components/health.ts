import { Component } from "../esc";

export class Health extends Component {
    constructor(
        private maxHp: number,
        private currentHp: number
    ) {
        super();
    }

    static FromSerializedState(state: { maxHp: number, currentHp: number }) {
        return new Health(state.maxHp, state.currentHp);
    }

    getMaxHP() {
        return this.maxHp;
    }
    setMaxHP(hp: number) {
        this.maxHp = hp;
    }

    getHP() {
        return this.currentHp;
    }

    setHp(hp: number) {
        this.currentHp = hp;
    }

    add(hp: number) {
        this.currentHp += hp;
    }
}