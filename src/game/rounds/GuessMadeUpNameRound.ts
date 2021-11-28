import { PlayerID } from "boardgame.io";
import { Color } from "../Color";
import { MakeUpNamePrivatePlayerState, MakeUpNamePublicState, MakeUpNameSecret, MAKE_UP_NAME_ROUND_NAME } from "./MakeUpNameRound";
import { lastRoundStateGetter, privateStateGetter, publicStateGetter, Round, secretGetter } from "./Round";

export const GUESS_MADE_UP_NAME_ROUND_NAME = 'guessMadeUpNmae';

// secret is same sa MakeUpNameRound

export interface GuessMadeUpNamePrivatePlayerState {
    selectedName: string | undefined;
    providedName: string;
}

export interface GuessMadeUpNamePublicState {
    targetColorShade: Color;
    candidateNames: string[];
}

export interface GuessMadeUpNamePreviousRoundState {
    colorName: string;
    colorValue: Color;
    guessedCorrectly: PlayerID[],
    madeUpNames: Record<PlayerID, string>;
    guessedBy: Record<PlayerID, PlayerID[]>;
}

const getSecretState = secretGetter<MakeUpNameSecret>(GUESS_MADE_UP_NAME_ROUND_NAME);
const getPrivatePlayerState = privateStateGetter<GuessMadeUpNamePrivatePlayerState>(GUESS_MADE_UP_NAME_ROUND_NAME);
const getPublicState = publicStateGetter<GuessMadeUpNamePublicState>(GUESS_MADE_UP_NAME_ROUND_NAME);

/**
 * Return ID of player who provided the specified name
 * @param players List of private player data
 * @param name Color name guessed
 * 
 * @return ID of specified name
 */
function idOfPlayerWhoProvided(players: {[id: PlayerID]: GuessMadeUpNamePrivatePlayerState}, name: string): PlayerID | undefined {
    for (const id of Object.keys(players)) {
        if (name === players[id].providedName) {
            return id;
        }
    }
    return undefined;
}

export const GuessMadeUpNameRound: Round<GuessMadeUpNamePrivatePlayerState, GuessMadeUpNamePublicState, GuessMadeUpNamePreviousRoundState> = {
    name: GUESS_MADE_UP_NAME_ROUND_NAME,
    initState: (G, ctx) => {
        if (!ctx.random) {
            return;
        }
        // We can assume we're comingfrom MakeUpNameRound. Synthesize initial state from there
        const oldPlayers = G.players as { [key: PlayerID]: MakeUpNamePrivatePlayerState; };
        const newPlayers: { [playerId: PlayerID]: GuessMadeUpNamePrivatePlayerState; } = {};

        for (const playerId of ctx.playOrder) {
            newPlayers[playerId] = {
                selectedName: undefined,
                // safe non-empty assert; all madeUpNames set by the time previous round ends
                providedName: oldPlayers[playerId].madeUpName!,
            };
        }
        G.players = newPlayers;

        let candidateNames = Object.keys(newPlayers).map((key) => newPlayers[key].providedName);
        candidateNames.push((G.secret as MakeUpNameSecret).actualName);

        candidateNames = ctx.random.Shuffle(candidateNames);

        (G.public as GuessMadeUpNamePublicState).candidateNames = candidateNames;
    },
    onBegin: () => {
        // setup completed in initState; no further setup needed here
    },
    scoreRound: (G) => {
        const secret = getSecretState(G);
        const players = getPrivatePlayerState(G);
        const playerIds = Object.keys(players);

        G.previousFirsts = [];
        G.previousSeconds = [];

        for (const id of playerIds) {
            const curPlayer = players[id];
            if (curPlayer.selectedName === secret.actualName) {
                G.scores[id] += playerIds.length + 1;
                G.previousFirsts.push(id);
            }
            // Safe non-empty assert; selectedName is defined by the time we are in the scoring round
            const providedById = idOfPlayerWhoProvided(players, curPlayer.selectedName!);
            if (providedById !== undefined) {
                G.scores[providedById] += 1;
            }
        }
    },
    buildPreviousRound: (G) => {
        if (!G.secret) {
            return;
        }

        const guessedCorrectly: PlayerID[] = [];
        const madeUpNames: Record<PlayerID, string> = {};
        const guessedBy: Record<PlayerID, PlayerID[]> = {};

        const players = getPrivatePlayerState(G);
        const secret = getSecretState(G);
        const publicState = getPublicState(G);

        for (const id of Object.keys(players)) {
            guessedBy[id] = [];
        }

        for (const id of Object.keys(players)) {
            madeUpNames[id] = players[id].providedName;
            if (players[id].selectedName === secret.actualName) {
                guessedCorrectly.push(id);
            } else {
                const playerGuess = players[id].selectedName;
                for (const secondId of Object.keys(players)) {
                    if (players[secondId].providedName === playerGuess) {
                        guessedBy[secondId].push(id);
                        break;
                    }
                }
            }
        }

        G.previousRound = {
            name: GUESS_MADE_UP_NAME_ROUND_NAME,
            data: {
                colorName: secret.actualName,
                colorValue: publicState.targetColorShade,
                guessedCorrectly: guessedCorrectly,
                madeUpNames: madeUpNames,
                guessedBy: guessedBy,
            },
        };
    },
    moves: {
        guessName: (G, ctx, name: string) => {
            if (!ctx.playerID || !ctx.events) {
                return;
            }
            const players = getPrivatePlayerState(G);

            players[ctx.playerID].selectedName = name;

            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.endTurn();
            } else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: getPrivatePlayerState,
    getPublicState: getPublicState,
    getLastRoundState: lastRoundStateGetter<GuessMadeUpNamePreviousRoundState>(GUESS_MADE_UP_NAME_ROUND_NAME),
};


