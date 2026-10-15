import { useGameStore } from "../store/gameStore";
import { playerState } from "./playerState";
import { resolveWalls, hitsWall, segmentBlocked } from "./collision";
import { spawnBurst } from "./effects";
import { spawnPickup } from "./pickups";

export const MAX_ENEMIES = 16;
export const MAX_ENEMY_BULLETS = 64;
export const ENEMY_RADIUS = 0.5;
export const ENEMY_HEIGHT = 2;

const GROUND_Y = 1;
const GUN_HEIGHT = 1.4;
const PLAYER_RADIUS = 0.5;
const HIT_FLASH_TIME = 0.1;
const MUZZLE_FLASH_TIME = 0.05;

const TYPES = {
  chaser: { health: 30, speed: 2.5, score: 100 },
  shooter: { health: 30, speed: 3, score: 150 },
};

const CHASER = {
  stopDistance: 1.1,
  attackRange: 1.4,
  damage: 10,
  interval: 1,
};

const SHOOTER = {
  minRange: 9,
  maxRange: 14,
  windup: 0.45,
  burstCount: 3,
  burstInterval: 0.14,
  cooldownMin: 1.2,
  cooldownMax: 2.2,
  damage: 8,
  projectileSpeed: 28,
  projectileLife: 2.5,
  baseSpread: 0.03,
  spreadPerUnit: 0.004,
  meleeRange: 2,
  meleeDamage: 15,
  meleeInterval: 1.2,
};

const enemies = [];
const enemyBullets = [];

if (import.meta.env.DEV) window.__enemies = enemies;

export const getEnemies = () => enemies;
export const getEnemyBullets = () => enemyBullets;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function spawnEnemy(x, z, type = "chaser") {
  if (enemies.length >= MAX_ENEMIES) return null;
  const config = TYPES[type];
  const enemy = {
    type,
    position: [x, GROUND_Y, z],
    rotation: 0,
    health: config.health,
    maxHealth: config.health,
    speed: config.speed,
    attackTimer: 0.5,
    hitTimer: 0,
    flashTimer: 0,
    state: "idle",
    stateTimer: randomBetween(1, 2.5),
    shotsLeft: 0,
    strafeDir: Math.random() < 0.5 ? 1 : -1,
    strafeTimer: randomBetween(1, 3),
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
  enemyBullets.length = 0;
}

function segmentCircleT(x0, z0, x1, z1, cx, cz, radius) {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const len2 = dx * dx + dz * dz;
  const t =
    len2 > 0
      ? Math.min(1, Math.max(0, ((cx - x0) * dx + (cz - z0) * dz) / len2))
      : 0;
  const ox = x0 + dx * t - cx;
  const oz = z0 + dz * t - cz;
  return ox * ox + oz * oz <= radius * radius ? t : -1;
}

export function findBulletHit(from, to) {
  let best = null;
  let bestT = Infinity;

  for (const e of enemies) {
    if (e.health <= 0) continue;
    const t = segmentCircleT(
      from.x,
      from.z,
      to.x,
      to.z,
      e.position[0],
      e.position[2],
      ENEMY_RADIUS,
    );
    if (t < 0) continue;
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

function hurtPlayer(damagePlayer, amount, shake) {
  damagePlayer(amount);
  playerState.shake = shake;
  console.log("player health:", useGameStore.getState().health);
}

function updateChaser(e, dx, dz, dist, delta, damagePlayer) {
  if (dist > CHASER.stopDistance) {
    const step = Math.min(e.speed * delta, dist - CHASER.stopDistance);
    e.position[0] += (dx / dist) * step;
    e.position[2] += (dz / dist) * step;
  }

  e.attackTimer = Math.max(0, e.attackTimer - delta);
  if (dist <= CHASER.attackRange && e.attackTimer === 0) {
    hurtPlayer(damagePlayer, CHASER.damage, 1);
    e.attackTimer = CHASER.interval;
  }
}

function fireEnemyBullet(e, dx, dz, dist) {
  const spread = SHOOTER.baseSpread + dist * SHOOTER.spreadPerUnit;
  const angle = Math.atan2(dx, dz) + (Math.random() - 0.5) * 2 * spread;
  const dirX = Math.sin(angle);
  const dirZ = Math.cos(angle);

  if (enemyBullets.length >= MAX_ENEMY_BULLETS) enemyBullets.shift();
  enemyBullets.push({
    x: e.position[0] + dirX,
    y: GUN_HEIGHT,
    z: e.position[2] + dirZ,
    vx: dirX * SHOOTER.projectileSpeed,
    vy: 0,
    vz: dirZ * SHOOTER.projectileSpeed,
    life: SHOOTER.projectileLife,
  });
  e.flashTimer = MUZZLE_FLASH_TIME;
}

function updateShooter(e, dx, dz, dist, delta, damagePlayer) {
  e.attackTimer = Math.max(0, e.attackTimer - delta);
  if (dist <= SHOOTER.meleeRange) {
    if (e.attackTimer === 0) {
      hurtPlayer(damagePlayer, SHOOTER.meleeDamage, 1);
      e.attackTimer = SHOOTER.meleeInterval;
    }
    e.state = "idle";
    return;
  }
  if (dist < 0.001) return;
  const nx = dx / dist;
  const nz = dz / dist;
  const visible = !segmentBlocked(
    e.position[0],
    GUN_HEIGHT,
    e.position[2],
    playerState.position[0],
    GUN_HEIGHT,
    playerState.position[2],
  );

  if (e.state === "idle") {
    let mx;
    let mz;
    if (!visible || dist > SHOOTER.maxRange) {
      mx = nx;
      mz = nz;
    } else if (dist < SHOOTER.minRange) {
      mx = -nx;
      mz = -nz;
    } else {
      e.strafeTimer -= delta;
      if (e.strafeTimer <= 0) {
        e.strafeDir *= -1;
        e.strafeTimer = randomBetween(1, 3);
      }
      mx = -nz * e.strafeDir;
      mz = nx * e.strafeDir;
    }
    e.position[0] += mx * e.speed * delta;
    e.position[2] += mz * e.speed * delta;
  }

  e.stateTimer -= delta;

  if (e.state === "idle") {
    if (e.stateTimer <= 0 && visible && dist <= SHOOTER.maxRange + 4) {
      e.state = "windup";
      e.stateTimer = SHOOTER.windup;
    }
  } else if (e.state === "windup") {
    if (e.stateTimer <= 0) {
      e.state = "burst";
      e.shotsLeft = SHOOTER.burstCount;
      e.stateTimer = 0;
    }
  } else if (e.state === "burst" && e.stateTimer <= 0) {
    fireEnemyBullet(e, dx, dz, dist);
    e.shotsLeft -= 1;
    if (e.shotsLeft <= 0) {
      e.state = "idle";
      e.stateTimer = randomBetween(SHOOTER.cooldownMin, SHOOTER.cooldownMax);
    } else {
      e.stateTimer = SHOOTER.burstInterval;
    }
  }
}

function updateEnemyBullets(delta, damagePlayer) {
  const [px, py, pz] = playerState.position;

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    const x0 = b.x;
    const z0 = b.z;
    b.x += b.vx * delta;
    b.y += b.vy * delta;
    b.z += b.vz * delta;
    b.life -= delta;

    const t = segmentCircleT(x0, z0, b.x, b.z, px, pz, PLAYER_RADIUS + 0.1);
    if (t >= 0 && Math.abs(b.y - py) <= 1) {
      hurtPlayer(damagePlayer, SHOOTER.damage, 0.6);
      spawnBurst(b.x, b.y, b.z, {
        count: 8,
        color: "#b41e1e",
        speed: 4,
        life: 0.3,
      });
      enemyBullets.splice(i, 1);
      continue;
    }

    if (b.life <= 0) {
      enemyBullets.splice(i, 1);
      continue;
    }

    if (b.y <= 0 || hitsWall(b)) {
      spawnBurst(b.x, Math.max(b.y, 0.05), b.z, {
        count: 5,
        color: "#f0f0ec",
        speed: 3,
        life: 0.25,
        size: 0.7,
      });
      enemyBullets.splice(i, 1);
    }
  }
}

export function updateEnemies(delta) {
  const { phase, damagePlayer } = useGameStore.getState();
  if (phase !== "playing") return;

  const px = playerState.position[0];
  const pz = playerState.position[2];

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.health <= 0) {
      useGameStore.getState().addScore(TYPES[e.type].score);
      spawnPickup(e.position[0], e.position[2]);
      spawnBurst(e.position[0], e.position[1], e.position[2], {
        count: 24,
        color: "#b41e1e",
        speed: 6,
        life: 0.6,
        size: 1.6,
      });
      enemies.splice(i, 1);
      continue;
    }

    e.hitTimer = Math.max(0, e.hitTimer - delta);
    e.flashTimer = Math.max(0, e.flashTimer - delta);

    const dx = px - e.position[0];
    const dz = pz - e.position[2];
    const dist = Math.hypot(dx, dz);
    if (dist > 0.001) e.rotation = Math.atan2(dx, dz);

    if (e.type === "shooter") {
      updateShooter(e, dx, dz, dist, delta, damagePlayer);
    } else {
      updateChaser(e, dx, dz, dist, delta, damagePlayer);
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

  updateEnemyBullets(delta, damagePlayer);
}
