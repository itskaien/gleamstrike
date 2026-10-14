import { useGameStore } from "../store/gameStore";
import { MAG_SIZE, MAX_RESERVE } from "../constants";

export const RELOAD_TIME = 1.8;
export const LOW_AMMO_THRESHOLD = 8;
export const PICKUP_AMMO_REWARD = 30;

let reloadTimer = 0;

export function canShoot() {
  const { ammo, reloading } = useGameStore.getState();
  return !reloading && ammo > 0;
}

export function startReload() {
  const { ammo, reserve, reloading, setWeapon } = useGameStore.getState();
  if (reloading || ammo >= MAG_SIZE || reserve <= 0) return;
  reloadTimer = RELOAD_TIME;
  setWeapon({ reloading: true });
}

export function spendAmmo() {
  const { ammo, setWeapon } = useGameStore.getState();
  setWeapon({ ammo: ammo - 1 });
}

export function addReserve(amount) {
  const { reserve, setWeapon } = useGameStore.getState();
  setWeapon({ reserve: Math.min(MAX_RESERVE, reserve + amount) });
}

export function updateAmmo(delta, wantsReload) {
  const state = useGameStore.getState();
  if (state.phase !== "playing") return;

  if (wantsReload || (state.ammo === 0 && !state.reloading)) startReload();

  const { reloading, ammo, reserve, setWeapon } = useGameStore.getState();
  if (!reloading) return;

  reloadTimer -= delta;
  if (reloadTimer > 0) return;

  const loaded = Math.min(MAG_SIZE - ammo, reserve);
  setWeapon({
    ammo: ammo + loaded,
    reserve: reserve - loaded,
    reloading: false,
  });
}
