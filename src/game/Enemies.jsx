import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Enemy from "./Enemy";
import {
  MAX_ENEMIES,
  updateEnemies,
  spawnEnemy,
  resetEnemies,
} from "../systems/enemies";

export default function Enemies() {
  useFrame((_, delta) => updateEnemies(delta));

  // TEMP: one test enemy. Wave spawning replaces this in step 14.
  useEffect(() => {
    resetEnemies(); // also keeps dev double-mounting from spawning two
    spawnEnemy(8, -10);
  }, []);

  return Array.from({ length: MAX_ENEMIES }, (_, i) => (
    <Enemy key={i} index={i} />
  ));
}
