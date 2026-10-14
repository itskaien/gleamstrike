import { create } from "zustand";
import { MAG_SIZE, START_RESERVE } from "../constants";

const MAX_HEALTH = 100;
const HIGH_SCORE_KEY = "gleamstrike:highScore";

function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    return;
  }
}

export const useGameStore = create((set) => ({
  phase: "playing",
  health: MAX_HEALTH,
  ammo: MAG_SIZE,
  reserve: START_RESERVE,
  reloading: false,
  score: 0,
  wave: 1,
  damageCount: 0,
  highScore: loadHighScore(),
  isNewBest: false,
  runId: 0,

  damagePlayer: (amount) =>
    set((state) => {
      if (state.phase !== "playing") return state;
      const health = Math.max(0, state.health - amount);
      const next = { health, damageCount: state.damageCount + 1 };
      if (health > 0) return next;

      const isNewBest = state.score > state.highScore;
      if (isNewBest) saveHighScore(state.score);
      return {
        ...next,
        phase: "gameover",
        isNewBest,
        highScore: isNewBest ? state.score : state.highScore,
      };
    }),

  setWeapon: (partial) => set(partial),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  nextWave: () => set((state) => ({ wave: state.wave + 1 })),

  resetGame: () =>
    set((state) => ({
      phase: "playing",
      health: MAX_HEALTH,
      ammo: MAG_SIZE,
      reserve: START_RESERVE,
      reloading: false,
      score: 0,
      wave: 1,
      damageCount: 0,
      isNewBest: false,
      runId: state.runId + 1,
    })),
}));
