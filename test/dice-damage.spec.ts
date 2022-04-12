import { DiceDmg, parseNotation } from "../src/render/game/utils/dice-dmg";

// Notation {diceCount}d{diceFaces}

describe("Dice dmg", () => {

    test("Should parse notaion correctly", () => {
        const { count, faces } = parseNotation("2d7");
        expect(count).toBe(2);
        expect(faces).toBe(7);
    });

    test("Should return a dice-dmg instance", () => {
        const diceDmg = DiceDmg.FromString("2d6");
        expect(diceDmg).toBeInstanceOf(DiceDmg);
    });

    test("Should roll for summ", () => {
        const diceDmg = DiceDmg.FromString("2d6");
        expect(typeof diceDmg.rollSumm()).toBe('number');
    });

    test("Should roll", () => {
        const diceDmg = DiceDmg.FromString("2d6");
        const result = diceDmg.roll();
        expect(result.length).toBe(2);
    });
});