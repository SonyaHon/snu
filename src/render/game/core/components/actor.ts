import { AI } from "../ai/ai";
import { MoveRandom } from "../ai/blocks/move-random.ai";
import { PlayerAI } from "../ai/player-ai";
import { Component, Entity, World } from "../esc";



export const ais = {
    'player-ai': PlayerAI,
    'kobold-ai': MoveRandom,
}

export type AIID = keyof typeof ais;

export class Actor extends Component {
    constructor(private readonly aiId: AIID) {
        super();
    }

    async act(target: Entity, world: World): Promise<boolean> {
        return await ais[this.aiId](target, world);
    }

    static FromSerializedState(state: { aiId: AIID }) {
        return new Actor(state.aiId);
    }
}