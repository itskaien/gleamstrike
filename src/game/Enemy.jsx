import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getEnemies } from "../systems/enemies";

export default function Enemy({ index }) {
  const ref = useRef();

  useFrame(() => {
    const g = ref.current;
    if (!g) return;

    const e = getEnemies()[index];
    if (!e) {
      g.visible = false; // no enemy in this slot
      return;
    }

    g.visible = true;
    g.position.set(e.position[0], e.position[1], e.position[2]);
    g.rotation.y = e.rotation;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#8b1e3f" emissive="#3a0516" />
      </mesh>

      {/* glowing eye strip so you can see which way it faces */}
      <mesh position={[0, 0.5, 0.45]}>
        <boxGeometry args={[0.5, 0.15, 0.2]} />
        <meshBasicMaterial color="#ff3355" />
      </mesh>
    </group>
  );
}
