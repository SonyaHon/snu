import { Component } from "../esc";

export class Renderable extends Component {
    static FromSerializedState() {
        return new Renderable();
    }
}