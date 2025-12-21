// /core/state.js
export const GameState = {
    IDLE: "idle",
    EXPLORING: "exploring",
    BATTLE: "battle",
    DIALOG: "dialog",
    MENU: "menu"
};

export let currentState = GameState.IDLE;

export function setGameState(state) {
    currentState = state;
}

export function isGameState(state) {
    return currentState === state;
}
