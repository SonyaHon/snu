import { Component } from "../esc";

export class Creature extends Component {
    static FromSerializedState() {
        return new Creature();
    }
}