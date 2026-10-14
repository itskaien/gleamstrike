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
        dummy.position.copy(bullets[i].pos);
        dummy.scale.setScalar(1);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_BULLETS]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color="#ffe08a" fog={false} />
    </instancedMesh>
  );
}
