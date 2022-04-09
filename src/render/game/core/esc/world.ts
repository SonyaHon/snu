import { nanoid } from "nanoid";
import { EventEmitter, once } from "events";

import { SerializedGameState } from "../game";
import { Component } from "./component";
import { Entity } from "./entity";
import { QueryBuilder } from "./query-builder";
import { Constructor, fetchComponentId, System } from "./utils";

export type ComponentId = string;
export type SystemId = string;
export type HookId = string;
export type EntityId = string;



export class World extends EventEmitter {

    private readonly storage = {
        components: {} as Record<ComponentId, Record<EntityId, Component>>,
        hooks: {} as Record<HookId, Record<SystemId, System>>,
        entities: new Set() as Set<string>,
    };
    private hooksStopped = false;

    abortHooks(): Promise<void> {
        this.hooksStopped = true;
        return new Promise((resolve, reject) => {
            this.once('loop-stopped', () => {
                this.hooksStopped = false;
                resolve();
            });
            this.emit('stop-hook');
        });
    }

    restoreFromSerializedState(componentsMap: any, serializedState: SerializedGameState['world']) {
        this.storage.entities = new Set(serializedState.entities);
        this.storage.components = Object.entries(serializedState.components).reduce((result, [componentId, componentData]) => {
            const componentConstructor = componentsMap[componentId];
            result[componentId] = Object.entries(componentData).reduce((cResult, [entityId, componentInstanceData]) => {
                cResult[entityId] = componentConstructor.FromSerializedState(componentInstanceData as any)
                return cResult;
            }, {} as any);
            return result;
        }, {} as any);
    }

    getStorage() {
        return this.storage;
    }

    registerComponent<T extends Constructor<Component>>(component: T) {
        this.storage.components[fetchComponentId(component)] = {};
    }

    registerHook(hook: string) {
        this.storage.hooks[hook] = {};
    }

    bindSystem(hook: string, system: System): string {
        const id = nanoid();
        this.storage.hooks[hook][id] = system;
        return id;
    }

    unbindSystem(hook: string, systemId: string) {
        delete this.storage.hooks[hook][systemId];
    }

    async dispatchHook(hook: string) {
        if (!this.hooksStopped) {
            const systems = Object.values(this.storage.hooks[hook]);
            await Promise.all(systems.map(system => system(this)));
        }
    }

    addComponent<T extends Component>(entity: Entity, component: T) {
        const componentId = fetchComponentId(component);
        const entityId = entity.getId();

        try {
            this.storage.components[componentId][entityId] = component;
        } catch (error) {
            console.error(error);
            console.error(`Probably u forget to regsiter ${componentId} component`);
        }
    }

    getComponentFor<J extends Constructor<Component>>(entity: Entity, component: J): InstanceType<J> | null {
        return this.storage.components[fetchComponentId(component)][entity.getId()] as InstanceType<J> || null;
    }

    removeComponent<T extends Component>(entity: Entity, component: T | Constructor<T> | string) {
        const componentId = fetchComponentId(component);
        delete this.storage.components[componentId][entity.getId()];
    }

    createEntity<T extends Component>(...components: T[]): Entity {
        const entity = new Entity();
        components.forEach(component => {
            this.addComponent(entity, component);
        });
        this.storage.entities.add(entity.getId());
        return entity;
    }

    removeEntity(entity: Entity) {
        const allComponents = Object.keys(this.storage.components);
        allComponents.forEach(component => {
            this.removeComponent(entity, component);
        });
        this.storage.entities.delete(entity.getId());
    }

    buildQuery() {
        return new QueryBuilder(this);
    }

    createEntityFromTemplate(template: ReturnType<typeof Entity.CreateTemplate>) {
        const entity = new Entity();
        template.forEach(([component, args]) => {
            this.addComponent(entity, new component(...args));
        });
        this.storage.entities.add(entity.getId());
        return entity;
    }

    serialize() {
        return {
            entities: [...this.storage.entities],
            components: Object.entries(this.storage.components).reduce((result, [componentId, componentData]) => {
                result[componentId] = Object.entries(componentData).reduce((cResult, [entityId, componentInstance]) => {
                    cResult[entityId] = componentInstance.serialize();
                    return cResult;
                }, {} as any);
                return result;
            }, {} as any),
        }
    }
}

