import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getPickups, updatePickups, MAX_PICKUPS } from "../systems/pickups";

export default function Pickups() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    updatePickups(delta);
    const mesh = meshRef.current;
    if (!mesh) return;
    const pickups = getPickups();

    for (let i = 0; i < MAX_PICKUPS; i++) {
      if (i < pickups.length) {
        const p = pickups[i];
        dummy.position.set(p.x, 0.7 + Math.sin(p.age * 3) * 0.12, p.z);
        dummy.rotation.set(0, p.age * 2, 0);
        dummy.scale.setScalar(Math.min(1, (p.life - p.age) / 3));
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
      args={[null, null, MAX_PICKUPS]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.4, 0.3, 0.55]} />
      <meshStandardMaterial color="#f0f0ec" emissive="#505050" />
    </instancedMesh>
  );
}
