// import { Util } from "rot-js";

// export interface ILoggable {
//     a?: (color?: string) => string;
//     the?: (color?: string) => string;
//     pos?: (color?: string) => string;
// }

// const format: typeof Util.format & { map: Record<string, string> } = Util.format as typeof Util.format & { map: Record<string, string> };

// format.map.a = 'a';
// format.map.the = 'the';
// format.map.pos = 'pos';


// function $setColor(color: string = 'grey') {
//     // @ts-ignore
//     this.color = color;
// }

// function $withColor() {
//     // @ts-ignore
//     return `<span style="color:${this.color}">${this.toString()}</span>`;
// }
// // @ts-ignore
// String.prototype.color = 'grey';
// // @ts-ignore
// String.prototype.$setColor = $setColor;
// // @ts-ignore
// String.prototype.$withColor = $withColor;


// export const formatString = (template: string, ...args: any[]) => {
//     return format(template, ...args);
// }

// Ex.
// formatString('Player moved to %{pos,white}', position); // Player moved to <white>0:1</white>
// formatString()

// Syntax
// Chars are used as is. But special forms are %{} all that is captured inside this form is a formatter invocation
// Syntax of form %{formatterName[,arg1[,arg2]]... [| another formatter]};
// If formatter name is Cappitalized, ther result of its execution will be Capitalized as well


// Final syntax: %{word | transformer | transformer | transformer} e.x.
// formatString('%{The|col,red}', {the: () => ''the goblin'}) => '<red>The goblin</red>

export const formatters = {
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
            // @ts-ignore
            const formatter: ((str: string, ...args: any) => string) | undefined = formatters[name];
            if (!formatter) {
                throw new Error(`Formatter ${name} not found`);
            }
            return formatter(result, ...args);
        }, subString);
    });
}