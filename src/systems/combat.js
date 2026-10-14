import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import { isFiring } from "./input";
import { hitsWall } from "./collision";
import { playerState } from "./playerState";

const FIRE_INTERVAL = 0.15;
const BULLET_SPEED = 60;
const BULLET_LIFETIME = 1.5;
export const MAX_BULLETS = 64;
const SHOT_LIGHT_COST = 5;
const FLASH_TIME = 0.05;

const bullets = []; // each: { pos, vel, life }
let cooldown = 0;
let flashTimer = 0;

export const getBullets = () => bullets;
export const isMuzzleFlashing = () => flashTimer > 0;

function shoot() {
  // level direction the camera is facing
  const yaw = playerState.cameraYaw;
  const dirX = -Math.sin(yaw);
  const dirZ = -Math.cos(yaw);

  // gun: chest height, just in front of the player
  const [px, py, pz] = playerState.position;
  const pos = new THREE.Vector3(px + dirX * 0.9, py + 0.4, pz + dirZ * 0.9);
  const vel = new THREE.Vector3(dirX, 0, dirZ).multiplyScalar(BULLET_SPEED);

  bullets.push({ pos, vel, life: BULLET_LIFETIME });
  if (bullets.length > MAX_BULLETS) bullets.shift();

  useGameStore.getState().consumeLight(SHOT_LIGHT_COST);
  cooldown = FIRE_INTERVAL;
  flashTimer = FLASH_TIME;
}

export function updateCombat(delta) {
  cooldown = Math.max(0, cooldown - delta);
  flashTimer = Math.max(0, flashTimer - delta);

  const firing = isFiring();
  playerState.firing = firing;

  const { phase, light } = useGameStore.getState();
  if (light < SHOT_LIGHT_COST) useGameStore.getState().restoreLight(100); // TEMP: remove in step 12

  if (
    firing &&
    cooldown === 0 &&
    phase === "playing" &&
    light >= SHOT_LIGHT_COST
  ) {
    shoot();
  }

  // move bullets; remove old ones and ones that hit a wall
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.pos.addScaledVector(b.vel, delta);
    b.life -= delta;
    if (b.life <= 0 || hitsWall(b.pos)) bullets.splice(i, 1);
  }
}
