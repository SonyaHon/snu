import { Initiative } from "../components/initiative";
import { Entity, Include, System, WithEntity } from "../esc";


export class CScheduler {

    private actors: Entity[] = [];
    private index = 0;

    setActors(actors: Entity[]) {
        this.actors = actors;
    }

    getNext(): Entity | null {
        let idx = this.index;
        this.index += 1;
        return this.actors[idx] || null;
    }

    clear() {
        this.actors = [];
        this.index = 0;
    }

    empty() {
        return this.index >= this.actors.length;
    }
}

export const Scheduler = new CScheduler();

export const SysCountInitiative: System = (world) => {
    const actingEntities = world.buildQuery().run(Include(Initiative), WithEntity());
    Scheduler.setActors(
        actingEntities
            .sort(([initiativeA], [initiativeB]) => initiativeA.getInitiative() - initiativeB.getInitiative())
            .map(([, entity]) => entity)
    );
}