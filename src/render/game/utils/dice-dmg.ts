import { RNG } from "rot-js";

export const parseNotation = (notation: string): { faces: number, count: number } => {
    const result = notation.match(/(\d+)d(\d+)/);
    if (result === null) {
        throw new Error(`Could not parse this notation: ${notation}`);
    }

    return {
        count: parseInt(result[1]),
        faces: parseInt(result[2])
    }
}

export class DiceDmg {
    static FromData(diceCount: number, diceFaces: number): DiceDmg {
        return new DiceDmg(diceCount, diceFaces);
    }

    static FromString(notation: string) {
        const { faces, count } = parseNotation(notation);
        return new DiceDmg(count, faces);
    }

    private constructor(
        private readonly diceCount: number,
        private readonly diceFaces: number,
    ) { }

    rollSumm(): number {
        let result = 0;
        for (let i = 0; i < this.diceCount; i++) {
            result += RNG.getUniformInt(1, this.diceFaces);
        }
        return result;
    }

    roll(): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.diceCount; i++) {
            result.push(RNG.getUniformInt(1, this.diceFaces));
        }
        return result;
    }
}