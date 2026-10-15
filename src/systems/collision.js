import * as THREE from "three";

const colliders = new Map();

export function registerCollidable(obj) {
  obj.updateWorldMatrix(true, false);
  colliders.set(obj, new THREE.Box3().setFromObject(obj));
  return () => colliders.delete(obj);
}

export function getCollidables() {
  return [...colliders.keys()];
}

export function resolveWalls(pos, radius) {
  for (const box of colliders.values()) {
    const cx = THREE.MathUtils.clamp(pos[0], box.min.x, box.max.x);
    const cz = THREE.MathUtils.clamp(pos[2], box.min.z, box.max.z);
    const dx = pos[0] - cx;
    const dz = pos[2] - cz;
    const d2 = dx * dx + dz * dz;

    if (d2 >= radius * radius) continue;

    if (d2 > 0) {
      const d = Math.sqrt(d2);
      pos[0] = cx + (dx / d) * radius;
      pos[2] = cz + (dz / d) * radius;
    } else {
      const left = pos[0] - box.min.x;
      const right = box.max.x - pos[0];
      const front = pos[2] - box.min.z;
      const back = box.max.z - pos[2];
      const m = Math.min(left, right, front, back);
      if (m === left) pos[0] = box.min.x - radius;
      else if (m === right) pos[0] = box.max.x + radius;
      else if (m === front) pos[2] = box.min.z - radius;
      else pos[2] = box.max.z + radius;
    }
  }
}

export function hitsWall(point) {
  for (const box of colliders.values()) {
    if (box.containsPoint(point)) return true;
  }
  return false;
}

export function segmentBlocked(ax, ay, az, bx, by, bz) {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const steps = Math.ceil(Math.hypot(dx, dy, dz) / 0.5);
  const point = { x: 0, y: 0, z: 0 };
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    point.x = ax + dx * t;
    point.y = ay + dy * t;
    point.z = az + dz * t;
    if (hitsWall(point)) return true;
  }
  return false;
}
