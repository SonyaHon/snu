import { Component } from "../esc";

export class MeleeAttackable extends Component {
    static FromSerializedState() {
        return new MeleeAttackable();
    }
}