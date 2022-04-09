import { NonWalkThrough } from "../components/non-walk-through";
import { Entity, World } from "../esc";
import { ActionEffect } from "./base-effect";

export class DoorToggleEffect extends ActionEffect {
    private closed = true;

    act(self: Entity, world: World): boolean | Promise<boolean> {
    
        if (this.closed) {
            world.removeComponent(self, NonWalkThrough);
            console.debug('Opening door');
            this.closed = false;
        } else {
            world.addComponent(self, new NonWalkThrough());
            console.debug('Closing door');
            this.closed = true;
        }
        
        return false;
    }

    serialize() {
        return {
            effect: DoorToggleEffect.name,
            state: {
                closed: this.closed,
            }
        }
    }

    static FromState(state: any) {
        const effect = new DoorToggleEffect();
        effect.closed = state.cloed;
        return effect;
    }
}