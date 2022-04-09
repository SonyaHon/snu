import { Component } from "../esc";

export class Player extends Component {
    static FromSerializedState() {
        return new Player();
    }
}