import { useGameStore } from "../store/gameStore";
import { playerState } from "./playerState";
import { resetEnemies } from "./enemies";
import { resetCombat } from "./combat";
import { clearEffects } from "./effects";

export function restartGame() {
  playerState.position[0] = 0;
  playerState.position[1] = 1;
  playerState.position[2] = 0;
  playerState.rotation = 0;
  playerState.firing = false;
  playerState.shake = 0;

  resetEnemies();
  resetCombat();
  clearEffects();
  useGameStore.getState().resetGame();
}
