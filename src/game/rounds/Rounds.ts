import { GuessMadeUpNamePreviousRoundState, GuessMadeUpNamePrivatePlayerState, GuessMadeUpNamePublicState, GuessMadeUpNameRound } from "./GuessMadeUpNameRound";
import { GuessNamePreviousRoundState, GuessNamePrivatePlayerState, GuessNamePublicState, GuessNameRound, GuessNameSecret } from "./GuessNameRound";
import { GuessShadePreviousRoundState, GuessShadePrivatePlayerState, GuessShadePublicState, GuessShadeRound, GuessShadeSecret } from "./GuessShadeRound";
import { MakeUpNamePrivatePlayerState, MakeUpNamePublicState, MakeUpNameRound, MakeUpNameSecret } from "./MakeUpNameRound";

export type Secrets = GuessShadeSecret 
| GuessNameSecret 
| MakeUpNameSecret;

export type PrivatePlayerState = GuessShadePrivatePlayerState 
| GuessNamePrivatePlayerState 
| MakeUpNamePrivatePlayerState
| GuessMadeUpNamePrivatePlayerState;

export type PublicState = GuessShadePublicState 
| GuessNamePublicState 
| MakeUpNamePublicState 
| GuessMadeUpNamePublicState;;

export type PreviousRoundState = GuessShadePreviousRoundState 
| GuessNamePreviousRoundState 
| GuessMadeUpNamePreviousRoundState;

export const ROUNDS = {
    [GuessShadeRound.name]: GuessShadeRound,
    [GuessNameRound.name]: GuessNameRound,
    [MakeUpNameRound.name]: MakeUpNameRound,
    [GuessMadeUpNameRound.name]: GuessMadeUpNameRound,
};

export const NEXT_ROUND_OPTIONS = [
    GuessShadeRound.name, GuessNameRound.name, MakeUpNameRound.name
];
Object.freeze(ROUNDS);