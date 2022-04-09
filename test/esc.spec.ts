import { Component, Entity, Exclude, Include, Optionally, WithEntity, World } from '../src/render/game/core/esc';

class Component1 extends Component { }
class Component2 extends Component { }
class Component3 extends Component { }
class Component4 extends Component { }

enum Hooks {
    Hook1 = 'hook1',
    Hook2 = 'hook2',
}

describe('ESC tests', () => {
    let world: World;

    beforeEach(() => {
        world = new World();
        world.registerComponent(Component1);
        world.registerComponent(Component2);
        world.registerComponent(Component3);
        world.registerComponent(Component4);
        world.registerHook(Hooks.Hook1);
        world.registerHook(Hooks.Hook2);
    });

    test('Creating entities', () => {
        const entity = world.createEntity(new Component1(), new Component2());
        expect(entity).toBeInstanceOf(Entity);
        expect(world.getStorage().entities.size).toBe(1);
    });

    test('Removing entities', () => {
        const entity = world.createEntity(new Component1(), new Component2());
        world.removeEntity(entity);
        expect(world.getStorage().entities.size).toBe(0);
    });

    test('Quering include', () => {
        world.createEntity(new Component1(), new Component2());
        world.createEntity(new Component1(), new Component3());
        world.createEntity(new Component3(), new Component4());
        world.createEntity(new Component1(), new Component2(), new Component3(), new Component4());

        const queryResult = world.buildQuery().run(
            Include(Component1),
            Include(Component2),
            Include(Component3),
            Include(Component4)
        );
        expect(queryResult.length).toBe(1);
        const [a, b, c, d] = queryResult[0];
        expect(a).toBeInstanceOf(Component1);
        expect(b).toBeInstanceOf(Component2);
        expect(c).toBeInstanceOf(Component3);
        expect(d).toBeInstanceOf(Component4);
    });

    test('Quering exclude', () => {
        world.createEntity(new Component1(), new Component2());
        world.createEntity(new Component1(), new Component3());
        world.createEntity(new Component1(), new Component4());

        const queryResult = world.buildQuery().run(
            Include(Component1),
            Exclude(Component4),
        );
        expect(queryResult.length).toBe(2);
        queryResult.forEach(([a]) => {
            expect(a).toBeInstanceOf(Component1);
        });
    });

    test('Quering with optionall', () => {
        world.createEntity(new Component1(), new Component2());
        world.createEntity(new Component1(), new Component3());
        world.createEntity(new Component1(), new Component4());

        const queryResult = world.buildQuery().run(
            Include(Component1),
            Exclude(Component4),
            Optionally(Component2),
        );
        expect(queryResult.length).toBe(2);
        queryResult.forEach(([a]) => {
            expect(a).toBeInstanceOf(Component1);
        });
        expect(queryResult[0][1]).toBeInstanceOf(Component2);
        expect(queryResult[1][1]).toBe(null);
    });

    test('Quering with Entity', () => {
        const e1 = world.createEntity(new Component1(), new Component2());
        const e2 = world.createEntity(new Component1(), new Component3());
        world.createEntity(new Component1(), new Component4());

        const queryResult = world.buildQuery().run(
            Include(Component1),
            Exclude(Component4),
            WithEntity(),
        );
        expect(queryResult.length).toBe(2);
        queryResult.forEach(([a, b]) => {
            expect(a).toBeInstanceOf(Component1);
            expect(b).toBeInstanceOf(Entity);
        });

        expect(queryResult[0][1].getId()).toBe(e1.getId());
        expect(queryResult[1][1].getId()).toBe(e2.getId());
    });

    test('Hooks', async () => {
        const sysA = jest.fn();
        const sysB = jest.fn();

        const id = world.bindSystem(Hooks.Hook1, sysA);
        world.bindSystem(Hooks.Hook2, sysB);

        await world.dispatchHook(Hooks.Hook1);
        expect(sysA).toBeCalledTimes(1);
        expect(sysB).toBeCalledTimes(0);

        await world.dispatchHook(Hooks.Hook2);
        expect(sysA).toBeCalledTimes(1);
        expect(sysB).toBeCalledTimes(1);

        world.unbindSystem(Hooks.Hook1, id);
        await world.dispatchHook(Hooks.Hook1);
        expect(sysA).toBeCalledTimes(1);
    });
});