import { useGameStore } from "../store/gameStore";
import { MAX_RESERVE } from "../constants";
import { playerState } from "./playerState";
import { addReserve, PICKUP_AMMO_REWARD } from "./ammo";
import { spawnBurst } from "./effects";

export const MAX_PICKUPS = 32;

const PICKUP_RADIUS = 1.2;
const LIFETIME = 30;

const pickups = [];

export const getPickups = () => pickups;

export function spawnPickup(x, z) {
  if (pickups.length >= MAX_PICKUPS) pickups.shift();
  pickups.push({ x, z, age: 0, life: LIFETIME });
}

export function resetPickups() {
  pickups.length = 0;
}

export function updatePickups(delta) {
  const { phase, reserve } = useGameStore.getState();
  if (phase !== "playing") return;

  const canCollect = reserve < MAX_RESERVE;
  const px = playerState.position[0];
  const pz = playerState.position[2];

  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.age += delta;

    if (p.age >= p.life) {
      pickups.splice(i, 1);
      continue;
    }

    const dx = px - p.x;
    const dz = pz - p.z;
    if (canCollect && dx * dx + dz * dz <= PICKUP_RADIUS * PICKUP_RADIUS) {
      addReserve(PICKUP_AMMO_REWARD);
      spawnBurst(p.x, 0.8, p.z, {
        count: 8,
        color: "#f0f0ec",
        speed: 3,
        life: 0.3,
        size: 0.7,
      });
      pickups.splice(i, 1);
    }
  }
}
