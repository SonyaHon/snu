import { Scheduler } from "./count-initiative";
import { System } from "../esc";
import { Actor } from "../components/actor";

export const SysDoAct: System = async (world) => {
    while (!Scheduler.empty()) {
        const actor = Scheduler.getNext();
        if (!actor) return;
        const act = world.getComponentFor(actor, Actor);
        if (!act) continue;
        await act.act(actor, world);
    }
    Scheduler.clear();
}