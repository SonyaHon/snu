export type Formatter = (data: string, ...args: any) => string;

export const formatters: Record<string, Formatter> = {
    cap: (str: string) => {
        return `${str[0].toUpperCase()}${str.slice(1)}`;
    },
    col: (str: string, col: string = 'grey') => {
        return `<span style="color:${col};">${str}</span>`;
    },
    the: (str: string) => {
        return `the ${str}`;
    }
};

export interface ILoggable {
    toString(): string;
}

export const formatString = <T extends ILoggable>(template: string, ...args: T[]) => {
    let subIndex = 0;
    return template.replace(/%{([^}]*)}/g, (match, replacementData = '') => {
        const subString: string = args[subIndex].toString();
        subIndex += 1;

        const reducers = replacementData.split('|').filter((el: string) => !!el);
        if (!reducers.length) return subString;

        return reducers.reverse().reduce((result: string, reducerCombo: string) => {
            const [name, ...args] = reducerCombo.split(',').map(el => el.trim());
            const formatter: Formatter | undefined = formatters[name];
            if (!formatter) {
                throw new Error(`Formatter ${name} not found`);
            }
            return formatter(result, ...args);
        }, subString);
    });
}