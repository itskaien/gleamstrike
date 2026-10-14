import { useGameStore } from "../store/gameStore";
import { playerState } from "./playerState";
import { resolveWalls } from "./collision";
import { spawnBurst } from "./effects";

export const MAX_ENEMIES = 16;
export const ENEMY_RADIUS = 0.5;
export const ENEMY_HEIGHT = 2;

const SPEED = 2.5;
const MAX_HEALTH = 30;
const GROUND_Y = 1;
const STOP_DISTANCE = 1.1;
const ATTACK_RANGE = 1.4;
const ATTACK_DAMAGE = 10;
const ATTACK_INTERVAL = 1;
const HIT_FLASH_TIME = 0.1;

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
    hitTimer: 0,
  };
  enemies.push(enemy);
  return enemy;
}

export function damageEnemy(enemy, amount) {
  enemy.health -= amount;
  enemy.hitTimer = HIT_FLASH_TIME;
}

export function resetEnemies() {
  enemies.length = 0;
}

export function findBulletHit(from, to) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const len2 = dx * dx + dz * dz;
  let best = null;
  let bestT = Infinity;

  for (const e of enemies) {
    if (e.health <= 0) continue;
    const t =
      len2 > 0
        ? Math.min(
            1,
            Math.max(
              0,
              ((e.position[0] - from.x) * dx + (e.position[2] - from.z) * dz) /
                len2,
            ),
          )
        : 0;
    const cx = from.x + dx * t - e.position[0];
    const cz = from.z + dz * t - e.position[2];
    if (cx * cx + cz * cz > ENEMY_RADIUS * ENEMY_RADIUS) continue;
    const y = from.y + (to.y - from.y) * t;
    if (Math.abs(y - e.position[1]) > ENEMY_HEIGHT / 2) continue;
    if (t < bestT) {
      bestT = t;
      best = e;
    }
  }

  return best ? { enemy: best, t: bestT } : null;
}

export function raycastEnemies(origin, dir, minDist, maxDist) {
  const a = dir.x * dir.x + dir.z * dir.z;
  let nearest = Infinity;
  if (a < 1e-6) return nearest;

  for (const e of enemies) {
    if (e.health <= 0) continue;
    const ox = origin.x - e.position[0];
    const oz = origin.z - e.position[2];
    const b = 2 * (ox * dir.x + oz * dir.z);
    const c = ox * ox + oz * oz - ENEMY_RADIUS * ENEMY_RADIUS;
    const disc = b * b - 4 * a * c;
    if (disc < 0) continue;
    const t = (-b - Math.sqrt(disc)) / (2 * a);
    if (t < minDist || t > maxDist || t >= nearest) continue;
    if (Math.abs(origin.y + dir.y * t - e.position[1]) > ENEMY_HEIGHT / 2)
      continue;
    nearest = t;
  }

  return nearest;
}

export function updateEnemies(delta) {
  const { phase, damagePlayer } = useGameStore.getState();
  if (phase !== "playing") return;

  const px = playerState.position[0];
  const pz = playerState.position[2];

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.health <= 0) {
      spawnBurst(e.position[0], e.position[1], e.position[2], {
        count: 24,
        color: "#ff3355",
        speed: 6,
        life: 0.6,
        size: 1.6,
      });
      enemies.splice(i, 1);
      continue;
    }

    e.hitTimer = Math.max(0, e.hitTimer - delta);

    const dx = px - e.position[0];
    const dz = pz - e.position[2];
    const dist = Math.hypot(dx, dz);

    if (dist > 0.001) e.rotation = Math.atan2(dx, dz);

    if (dist > STOP_DISTANCE) {
      const step = Math.min(e.speed * delta, dist - STOP_DISTANCE);
      e.position[0] += (dx / dist) * step;
      e.position[2] += (dz / dist) * step;
    }

    e.attackTimer = Math.max(0, e.attackTimer - delta);
    if (dist <= ATTACK_RANGE && e.attackTimer === 0) {
      damagePlayer(ATTACK_DAMAGE);
      playerState.shake = 1;
      console.log("player health:", useGameStore.getState().health);
      e.attackTimer = ATTACK_INTERVAL;
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i];
      const b = enemies[j];
      const dx = b.position[0] - a.position[0];
      const dz = b.position[2] - a.position[2];
      const d = Math.hypot(dx, dz);
      const min = ENEMY_RADIUS * 2;
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

  for (const e of enemies) resolveWalls(e.position, ENEMY_RADIUS);
}
