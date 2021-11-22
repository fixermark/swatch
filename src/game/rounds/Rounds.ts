import { GuessNamePreviousRoundState, GuessNamePrivatePlayerState, GuessNamePublicState, GuessNameRound, GuessNameSecret } from "./GuessNameRound";
import { GuessShadePreviousRoundState, GuessShadePrivatePlayerState, GuessShadePublicState, GuessShadeRound, GuessShadeSecret } from "./GuessShadeRound";

export type Secrets = GuessShadeSecret | GuessNameSecret;
export type PrivatePlayerState = GuessShadePrivatePlayerState | GuessNamePrivatePlayerState;
export type PublicState = GuessShadePublicState | GuessNamePublicState;
export type PreviousRoundState = GuessShadePreviousRoundState | GuessNamePreviousRoundState;

export const ROUNDS = {
    [GuessShadeRound.name]: GuessShadeRound,
    [GuessNameRound.name]: GuessNameRound,
};
Object.freeze(ROUNDS);