import { ActionEffect } from "../action-effects/base-effect";
import { EffectsMap } from "../action-effects/effects-map";
import { Component, Entity, World } from "../esc";

export class Actionable extends Component {
    private readonly effects: ActionEffect[];

    constructor(...effects: ActionEffect[]) {
        super();
        this.effects = effects;
    }

    async runEffects(self: Entity, world: World): Promise<boolean[]> {
        return Promise.all(this.effects.map(effect => effect.act(self, world)));
    }

    override serialize() {
        return {
            effects: this.effects.map(effect => effect.serialize()),
        }
    }

    static FromSerializedState(data: {effects: {effect: string, state: unknown}[]}) {
        return new Actionable(...data.effects.map(({effect, state}) => {
            return EffectsMap[effect].FromState(state);
        }))
    }
}