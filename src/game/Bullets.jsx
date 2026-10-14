import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getBullets, MAX_BULLETS } from "../systems/combat";

export default function Bullets() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const bullets = getBullets();

    for (let i = 0; i < MAX_BULLETS; i++) {
      if (i < bullets.length) {
        const b = bullets[i];
        dummy.position.copy(b.pos);
        dummy.lookAt(b.pos.x + b.vel.x, b.pos.y + b.vel.y, b.pos.z + b.vel.z);
        dummy.scale.set(1, 1, 8); // stretch along the direction of travel
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_BULLETS]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#ffe08a" fog={false} />
    </instancedMesh>
  );
}
