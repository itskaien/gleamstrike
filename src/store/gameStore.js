import { create } from "zustand";

const MAX_HEALTH = 100;
const MAX_LIGHT = 100;

export const useGameStore = create((set) => ({
  phase: "playing",
  health: MAX_HEALTH,
  light: MAX_LIGHT,
  score: 0,
  wave: 1,
  damageCount: 0,

  damagePlayer: (amount) =>
    set((state) => {
      if (state.phase !== "playing") return state;
      const health = Math.max(0, state.health - amount);
      return {
        health,
        damageCount: state.damageCount + 1,
        phase: health <= 0 ? "gameover" : state.phase,
      };
    }),

  consumeLight: (amount) =>
    set((state) => ({ light: Math.max(0, state.light - amount) })),

  restoreLight: (amount) =>
    set((state) => ({ light: Math.min(MAX_LIGHT, state.light + amount) })),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  nextWave: () => set((state) => ({ wave: state.wave + 1 })),

  resetGame: () =>
    set({
      phase: "playing",
      health: MAX_HEALTH,
      light: MAX_LIGHT,
      score: 0,
      wave: 1,
      damageCount: 0,
    }),
}));
