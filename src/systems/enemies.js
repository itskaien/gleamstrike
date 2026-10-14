import { useGameStore } from "../store/gameStore";
import { playerState } from "./playerState";
import { resolveWalls } from "./collision";

export const MAX_ENEMIES = 16;

const RADIUS = 0.5;
const SPEED = 2.5;
const MAX_HEALTH = 30;
const GROUND_Y = 1;
const STOP_DISTANCE = 1.1;
const ATTACK_RANGE = 1.4;
const ATTACK_DAMAGE = 10;
const ATTACK_INTERVAL = 1;

const enemies = [];

if (import.meta.env.DEV) window.__enemies = enemies;

export const getEnemies = () => enemies;

export function spawnEnemy(x, z) {
  if (enemies.length >= MAX_ENEMIES) return null;
  const enemy = {
    position: [x, GROUND_Y, z],
    rotation: 0,
    health: MAX_HEALTH,
    maxHealth: MAX_HEALTH,
    speed: SPEED,
    attackTimer: 0.5,
  };
  enemies.push(enemy);
  return enemy;
}

export function damageEnemy(enemy, amount) {
  enemy.health -= amount;
}

export function resetEnemies() {
  enemies.length = 0;
}

export function updateEnemies(delta) {
  const { phase, damagePlayer } = useGameStore.getState();
  if (phase !== "playing") return;

  const px = playerState.position[0];
  const pz = playerState.position[2];

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.health <= 0) {
      enemies.splice(i, 1);
      continue;
    }

    const dx = px - e.position[0];
    const dz = pz - e.position[2];
    const dist = Math.hypot(dx, dz);

    if (dist > 0.001) e.rotation = Math.atan2(dx, dz);

    if (dist > STOP_DISTANCE) {
      const step = Math.min(e.speed * delta, dist - STOP_DISTANCE);
      e.position[0] += (dx / dist) * step;
      e.position[2] += (dz / dist) * step;
    }

    // damage the player when close
    e.attackTimer = Math.max(0, e.attackTimer - delta);
    if (dist <= ATTACK_RANGE && e.attackTimer === 0) {
      damagePlayer(ATTACK_DAMAGE);
      console.log("player health:", useGameStore.getState().health); // TEMP until the HUD (step 19)
      e.attackTimer = ATTACK_INTERVAL;
    }
  }

  // keep enemies from stacking on top of each other
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i];
      const b = enemies[j];
      const dx = b.position[0] - a.position[0];
      const dz = b.position[2] - a.position[2];
      const d = Math.hypot(dx, dz);
      const min = RADIUS * 2;
      if (d < min && d > 0.0001) {
        const push = (min - d) / 2;
        const nx = dx / d;
        const nz = dz / d;
        a.position[0] -= nx * push;
        a.position[2] -= nz * push;
        b.position[0] += nx * push;
        b.position[2] += nz * push;
      }
    }
  }

  for (const e of enemies) resolveWalls(e.position, RADIUS);
}
