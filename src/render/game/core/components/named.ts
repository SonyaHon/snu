import { Component } from "../esc";

export class Named extends Component {
    static FromSerializedState(data: { name: string }) {
        return new Named(data.name);
    }

    constructor(private readonly name: string) {
        super();
    }

    getName() {
        return this.name;
    }
}