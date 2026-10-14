import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import { isFiring } from "./input";
import { getCollidables, hitsWall } from "./collision";
import { playerState } from "./playerState";

const FIRE_INTERVAL = 0.15;
const BULLET_SPEED = 60;
const BULLET_LIFETIME = 1.5;
export const MAX_BULLETS = 64;
const SHOT_LIGHT_COST = 5;
const AIM_RANGE = 100;
const FLASH_TIME = 0.05;

const bullets = [];
let cooldown = 0;
let flashTimer = 0;

const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);
const aimPoint = new THREE.Vector3();
const muzzle = new THREE.Vector3();

export const getBullets = () => bullets;
export const isMuzzleFlashing = () => flashTimer > 0;

function shoot(camera) {
  // 1. What is under the crosshair?
  camera.updateMatrixWorld();
  raycaster.setFromCamera(screenCenter, camera);
  raycaster.far = AIM_RANGE;
  const hits = raycaster.intersectObjects(getCollidables(), false);
  if (hits.length > 0) aimPoint.copy(hits[0].point);
  else raycaster.ray.at(AIM_RANGE, aimPoint); // nothing hit: aim far ahead

  // 2. Gun position: chest height, just in front of the player
  const yaw = playerState.cameraYaw;
  const [px, py, pz] = playerState.position;
  muzzle.set(px - Math.sin(yaw) * 0.9, py + 0.4, pz - Math.cos(yaw) * 0.9);

  // 3. Fire from the gun toward the aim point
  const vel = aimPoint
    .clone()
    .sub(muzzle)
    .normalize()
    .multiplyScalar(BULLET_SPEED);
  bullets.push({ pos: muzzle.clone(), vel, life: BULLET_LIFETIME });
  if (bullets.length > MAX_BULLETS) bullets.shift();

  useGameStore.getState().consumeLight(SHOT_LIGHT_COST);
  cooldown = FIRE_INTERVAL;
  flashTimer = FLASH_TIME;
}

export function updateCombat(camera, delta) {
  cooldown = Math.max(0, cooldown - delta);
  flashTimer = Math.max(0, flashTimer - delta);

  const firing = isFiring();
  playerState.firing = firing;

  const { phase, light } = useGameStore.getState();
  if (
    firing &&
    cooldown === 0 &&
    phase === "playing" &&
    light >= SHOT_LIGHT_COST
  ) {
    shoot(camera);
  }

  // move bullets; remove old ones and ones that hit a wall
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.pos.addScaledVector(b.vel, delta);
    b.life -= delta;
    if (b.life <= 0 || hitsWall(b.pos)) bullets.splice(i, 1);
  }
}
