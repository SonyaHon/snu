import { Component } from "../esc";

export class Mortal extends Component {
    static FromSerializedState() {
        return new Mortal();
    }
}