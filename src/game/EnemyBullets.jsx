import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getEnemyBullets, MAX_ENEMY_BULLETS } from "../systems/enemies";

export default function EnemyBullets() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const bullets = getEnemyBullets();

    for (let i = 0; i < MAX_ENEMY_BULLETS; i++) {
      if (i < bullets.length) {
        const b = bullets[i];
        dummy.position.set(b.x, b.y, b.z);
        dummy.lookAt(b.x + b.vx, b.y + b.vy, b.z + b.vz);
        dummy.scale.set(1, 1, 6);
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
      args={[null, null, MAX_ENEMY_BULLETS]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#d9402b" fog={false} />
    </instancedMesh>
  );
}
