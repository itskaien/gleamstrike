import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import { isFiring, consumeShot, consumeReload } from "./input";
import { getCollidables, hitsWall } from "./collision";
import { playerState } from "./playerState";
import { damageEnemy, findBulletHit, raycastEnemies } from "./enemies";
import { spawnBurst } from "./effects";
import { canShoot, spendAmmo, updateAmmo } from "./ammo";

const FIRE_INTERVAL = 0.12;
const BULLET_SPEED = 80;
const BULLET_LIFETIME = 1.5;
const BULLET_DAMAGE = 10;
export const MAX_BULLETS = 64;
const AIM_RANGE = 120;
const FLASH_TIME = 0.05;
const AIM_HOLD = 0.4;

const bullets = [];
let cooldown = 0;
let flashTimer = 0;
let aimHold = 0;

const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);
const aimPoint = new THREE.Vector3();
const muzzle = new THREE.Vector3();
const previous = new THREE.Vector3();

export const getBullets = () => bullets;
export const isMuzzleFlashing = () => flashTimer > 0;

function shoot(camera) {
  const yaw = playerState.cameraYaw;
  const [px, py, pz] = playerState.position;
  muzzle.set(px - Math.sin(yaw) * 0.9, py + 0.4, pz - Math.cos(yaw) * 0.9);

  camera.updateMatrixWorld();
  raycaster.setFromCamera(screenCenter, camera);
  raycaster.near = camera.position.distanceTo(muzzle);
  raycaster.far = AIM_RANGE;

  let aimDist = AIM_RANGE;
  const hits = raycaster.intersectObjects(getCollidables(), false);
  if (hits.length > 0) aimDist = hits[0].distance;

  const ray = raycaster.ray;
  if (ray.direction.y < 0) {
    const t = -ray.origin.y / ray.direction.y;
    if (t > 0 && t < aimDist) aimDist = t;
  }

  const enemyDist = raycastEnemies(
    ray.origin,
    ray.direction,
    raycaster.near,
    aimDist,
  );
  if (enemyDist < aimDist) aimDist = enemyDist;
  ray.at(aimDist, aimPoint);

  const vel = aimPoint
    .clone()
    .sub(muzzle)
    .normalize()
    .multiplyScalar(BULLET_SPEED);
  bullets.push({ pos: muzzle.clone(), vel, life: BULLET_LIFETIME });
  if (bullets.length > MAX_BULLETS) bullets.shift();

  spendAmmo();
  cooldown = FIRE_INTERVAL;
  flashTimer = FLASH_TIME;
}

export function updateCombat(camera, delta) {
  updateAmmo(delta, consumeReload());

  cooldown = Math.max(0, cooldown - delta);
  flashTimer = Math.max(0, flashTimer - delta);

  const firing = isFiring() || consumeShot();
  if (firing) aimHold = AIM_HOLD;
  else aimHold = Math.max(0, aimHold - delta);
  playerState.firing = aimHold > 0;

  const { phase } = useGameStore.getState();
  if (firing && cooldown === 0 && phase === "playing" && canShoot()) {
    shoot(camera);
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    previous.copy(b.pos);
    b.pos.addScaledVector(b.vel, delta);
    b.life -= delta;

    const hit = findBulletHit(previous, b.pos);
    if (hit) {
      damageEnemy(hit.enemy, BULLET_DAMAGE);
      spawnBurst(
        previous.x + (b.pos.x - previous.x) * hit.t,
        previous.y + (b.pos.y - previous.y) * hit.t,
        previous.z + (b.pos.z - previous.z) * hit.t,
        { count: 10, color: "#b41e1e", speed: 5, life: 0.35 },
      );
      bullets.splice(i, 1);
      continue;
    }

    if (b.pos.y <= 0 || hitsWall(b.pos)) {
      spawnBurst(b.pos.x, Math.max(b.pos.y, 0.05), b.pos.z, {
        count: 6,
        color: "#f0f0ec",
        speed: 3,
        life: 0.25,
        size: 0.7,
      });
      bullets.splice(i, 1);
      continue;
    }

    if (b.life <= 0) bullets.splice(i, 1);
  }
}

export function resetCombat() {
  bullets.length = 0;
  cooldown = 0;
  flashTimer = 0;
  aimHold = 0;
}
