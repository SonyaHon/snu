import { formatString } from '../src/render/game/utils/formatter';

describe('Formatter', () => {
    test('Proxy', () => {
        const t = 'test';
        expect(formatString('test')).toBe(t);
    });

    test('Empty formatter', () => {
        const result = formatString('test %{}', 'a');
        expect(result).toBe('test a');
    });

    test('Multiple formatters', () => {
        const result = formatString('test %{} %{}', 1, 2);
        expect(result).toBe('test 1 2');
    });

    test('Single function no args', () => {
        const result = formatString('test %{cap}', 'it');
        expect(result).toBe('test It');
    });

    test('Single function with args', () => {
        const result = formatString('test %{col, red}', 'it');
        expect(result).toBe('test <span style="color:red;">it</span>');
    });
});
