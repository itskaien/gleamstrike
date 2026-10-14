import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { restartGame } from "../systems/game";

function restart() {
  restartGame();
  document.querySelector("canvas")?.requestPointerLock?.();
}

export default function GameOver() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const highScore = useGameStore((s) => s.highScore);
  const isNewBest = useGameStore((s) => s.isNewBest);

  useEffect(() => {
    if (phase === "gameover") document.exitPointerLock();
  }, [phase]);

  if (phase !== "gameover") return null;

  return (
    <div className="gameover">
      <h1>Game Over</h1>
      {isNewBest && <p className="gameover-best">New high score</p>}
      <dl className="gameover-stats">
        <div>
          <dt>Score</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>Wave</dt>
          <dd>{wave}</dd>
        </div>
        <div>
          <dt>Best</dt>
          <dd>{highScore}</dd>
        </div>
      </dl>
      <button onClick={restart}>Restart</button>
    </div>
  );
}
