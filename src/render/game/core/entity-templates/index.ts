import { Colors } from "../../utils/colors";
import { DoorToggleEffect } from "../action-effects/door-toggle.effect";
import { Actionable } from "../components/actionable";
import { Creature } from "../components/creature";
import { Actor } from "../components/actor";
import { Glyph } from "../components/glyph";
import { Hostile } from "../components/hostile";
import { Initiative } from "../components/initiative";
import { MeleeAttackable } from "../components/melee-attackable";
import { Named } from "../components/named";
import { NonWalkThrough } from "../components/non-walk-through";
import { NPC } from "../components/npc";
import { Position } from "../components/position";
import { Renderable } from "../components/renderable";
import { Entity } from "../esc";
import { AddEntry } from "../esc/entity";
import { Fov } from "../components/fov";
import { AttackerMelee } from "../components/attacker-melee";
import { DiceDmg } from "../../utils/dice-dmg";
import { Health } from "../components/health";
import { Mortal } from "../components/mortal";

export const DoorTemplate = Entity.CreateTemplate(
    AddEntry(Position, [0, 0]),
    AddEntry(Glyph, ['-', Colors.DoorBrown, Colors.Black]),
    AddEntry(Renderable, []),
    AddEntry(NonWalkThrough, []),
    AddEntry(Actionable, [new DoorToggleEffect()]),
);

export const KoboldTemplate = Entity.CreateTemplate(
    AddEntry(Position, [0, 0]),
    AddEntry(Glyph, ['k', Colors.KoboldGreen, Colors.Black]),
    AddEntry(Renderable, []),
    AddEntry(NonWalkThrough, []),
    AddEntry(NPC, []),
    AddEntry(Named, ['kobold']),
    AddEntry(Actor, ['kobold-ai']),
    AddEntry(Initiative, [2]),
    AddEntry(Hostile, []),
    AddEntry(MeleeAttackable, []),
    AddEntry(AttackerMelee, [DiceDmg.FromString('1d4')]),
    AddEntry(Creature, []),
    AddEntry(Fov, [5]),
    AddEntry(Health, [5, 5]),
    AddEntry(Mortal, []),
);