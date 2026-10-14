import * as THREE from "three";

export const MAX_PARTICLES = 300;

const particles = [];

export const getParticles = () => particles;

export function spawnBurst(
  x,
  y,
  z,
  { count = 8, color = "#ffffff", speed = 4, life = 0.4, size = 1 } = {},
) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    const angle = Math.random() * Math.PI * 2;
    const s = speed * (0.4 + Math.random() * 0.6);
    particles.push({
      pos: new THREE.Vector3(x, y, z),
      vel: new THREE.Vector3(
        Math.cos(angle) * s,
        (0.2 + Math.random() * 0.8) * s,
        Math.sin(angle) * s,
      ),
      life,
      maxLife: life,
      size,
      color: new THREE.Color(color),
    });
  }
}

export function updateEffects(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= delta;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    p.vel.y -= 12 * delta;
    p.pos.addScaledVector(p.vel, delta);
    if (p.pos.y < 0.05) {
      p.pos.y = 0.05;
      p.vel.y *= -0.3;
      p.vel.x *= 0.6;
      p.vel.z *= 0.6;
    }
  }
}

export function clearEffects() {
  particles.length = 0;
}
