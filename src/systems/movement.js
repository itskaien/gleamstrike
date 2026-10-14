import { resolveWalls } from "./collision";

const SPEED = 5;
const TURN_SPEED = 12;
const PLAYER_RADIUS = 0.5;
const GROUND_Y = 1;
const ARENA_LIMIT = 24.5;

const DASH_SPEED = 18;
const DASH_DURATION = 0.15;
const DASH_COOLDOWN = 1;

const dash = { timer: 0, cooldown: 0, x: 0, z: 0 };

export function updateMovement(p, keys, delta) {
  let ix = 0;
  let iz = 0;
  if (keys.forward) iz -= 1;
  if (keys.backward) iz += 1;
  if (keys.left) ix -= 1;
  if (keys.right) ix += 1;

  const len = Math.hypot(ix, iz);
  if (len > 0) {
    ix /= len;
    iz /= len;
  }

  const sin = Math.sin(p.cameraYaw);
  const cos = Math.cos(p.cameraYaw);
  const mx = ix * cos + iz * sin;
  const mz = -ix * sin + iz * cos;

  dash.cooldown = Math.max(0, dash.cooldown - delta);
  dash.timer = Math.max(0, dash.timer - delta);

  if (keys.dash && dash.cooldown === 0 && dash.timer === 0) {
    const hasInput = mx !== 0 || mz !== 0;
    dash.x = hasInput ? mx : Math.sin(p.rotation);
    dash.z = hasInput ? mz : Math.cos(p.rotation);
    dash.timer = DASH_DURATION;
    dash.cooldown = DASH_COOLDOWN;
  }

  let vx = mx * SPEED;
  let vz = mz * SPEED;
  if (dash.timer > 0) {
    vx = dash.x * DASH_SPEED;
    vz = dash.z * DASH_SPEED;
  }

  if (vx !== 0 || vz !== 0) {
    const target = Math.atan2(vx, vz);
    let diff = target - p.rotation;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    p.rotation += diff * (1 - Math.exp(-TURN_SPEED * delta));
  }

  p.position[0] += vx * delta;
  p.position[2] += vz * delta;

  p.position[0] = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, p.position[0]));
  p.position[2] = Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, p.position[2]));
  resolveWalls(p.position, PLAYER_RADIUS);

  p.position[1] = GROUND_Y;
}
