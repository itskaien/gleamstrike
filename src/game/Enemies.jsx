import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Enemy from "./Enemy";
import {
  MAX_ENEMIES,
  updateEnemies,
  spawnEnemy,
  resetEnemies,
} from "../systems/enemies";
import { useGameStore } from "../store/gameStore";

export default function Enemies() {
  const runId = useGameStore((s) => s.runId);

  useFrame((_, delta) => updateEnemies(delta));

  useEffect(() => {
    resetEnemies();
    spawnEnemy(8, -10);
    spawnEnemy(-8, -12);
    spawnEnemy(0, -16);
  }, [runId]);

  return Array.from({ length: MAX_ENEMIES }, (_, i) => (
    <Enemy key={i} index={i} />
  ));
}
