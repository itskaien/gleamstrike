import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getParticles, updateEffects, MAX_PARTICLES } from "../systems/effects";

export default function Effects() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    updateEffects(delta);
    const mesh = meshRef.current;
    if (!mesh) return;
    const particles = getParticles();

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (i < particles.length) {
        const p = particles[i];
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.size * (p.life / p.maxLife));
        mesh.setColorAt(i, p.color);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_PARTICLES]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshBasicMaterial fog={false} toneMapped={false} />
    </instancedMesh>
  );
}
