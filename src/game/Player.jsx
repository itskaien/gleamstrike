import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getKeys } from "../systems/input";
import { playerState } from "../systems/playerState";
import { updateMovement } from "../systems/movement";

export default function Player() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    updateMovement(playerState, getKeys(), delta);

    const g = groupRef.current;
    if (g) {
      g.position.set(...playerState.position);
      g.rotation.y = playerState.rotation;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position={[0, 0.4, 0.55]}>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}
