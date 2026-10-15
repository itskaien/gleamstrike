import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getEnemies } from "../systems/enemies";

const BODY_COLORS = { chaser: "#656565", shooter: "#6b6652" };

export default function Enemy({ index }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const gunRef = useRef();
  const flashRef = useRef();

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;

    const e = getEnemies()[index];
    if (!e) {
      g.visible = false;
      return;
    }

    g.visible = true;
    g.position.set(e.position[0], e.position[1], e.position[2]);
    g.rotation.y = e.rotation;

    const body = bodyRef.current;
    body.color.set(BODY_COLORS[e.type]);
    if (e.hitTimer > 0) body.emissive.set("#f0f0ec");
    else if (e.state === "windup") body.emissive.set("#3a3a3a");
    else body.emissive.set("#000000");

    gunRef.current.visible = e.type === "shooter";
    flashRef.current.visible = e.flashTimer > 0;
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial ref={bodyRef} color="#656565" />
      </mesh>

      <mesh position={[0, 0.5, 0.45]}>
        <boxGeometry args={[0.5, 0.15, 0.2]} />
        <meshBasicMaterial color="#f0f0ec" />
      </mesh>

      <mesh ref={gunRef} position={[0, 0.4, 0.6]} visible={false}>
        <boxGeometry args={[0.15, 0.2, 0.9]} />
        <meshStandardMaterial color="#1a1b1c" />
      </mesh>

      <mesh ref={flashRef} position={[0, 0.4, 1.15]} visible={false}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#f0f0ec" />
      </mesh>
    </group>
  );
}
