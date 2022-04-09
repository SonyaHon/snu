import { Component } from "../esc";

export class Initiative extends Component {
    constructor(private readonly initiative: number) {
        super();
    }

    static FromSerializedState(state: { initiative: number }) {
        return new Initiative(state.initiative);
    }

    getInitiative() {
        return this.initiative;
    }
}