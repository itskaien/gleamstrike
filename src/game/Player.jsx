import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getKeys } from "../systems/input";

export default function Player() {
  const meshRef = useRef();

  const player = useRef({
    position: [0, 1, 0],
    rotation: 0,
    velocity: [0, 0, 0],
  });

  useFrame((_, delta) => {
    const keys = getKeys();
    const p = player.current;

    let x = 0;
    let z = 0;

    if (keys.forward) z -= 1;
    if (keys.backward) z += 1;
    if (keys.left) x -= 1;
    if (keys.right) x += 1;

    const len = Math.hypot(x, z);
    if (len > 0) {
      x /= len;
      z /= len;
    }

    const speed = 5;
    p.position[0] += x * speed * delta;
    p.position[2] += z * speed * delta;

    if (meshRef.current) {
      meshRef.current.position.set(p.position[0], p.position[1], p.position[2]);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
