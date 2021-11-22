import { GuessShadePreviousRoundState, GuessShadePrivatePlayerState, GuessShadePublicState, GuessShadeRound, GuessShadeSecret } from "./GuessShadeRound";

export type Secrets = GuessShadeSecret;
export type PrivatePlayerState = GuessShadePrivatePlayerState;
export type PublicState = GuessShadePublicState;
export type PreviousRoundState = GuessShadePreviousRoundState;

export const ROUNDS = {
    [GuessShadeRound.name]: GuessShadeRound,
};
Object.freeze(ROUNDS);