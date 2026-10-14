import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getKeys } from "../systems/input";
import { playerState } from "../systems/playerState";
import { updateMovement } from "../systems/movement";
import { updateCombat, isMuzzleFlashing } from "../systems/combat";

export default function Player() {
  const groupRef = useRef();
  const flashRef = useRef();

  useFrame((_, delta) => {
    updateMovement(playerState, getKeys(), delta);
    updateCombat(delta);

    const g = groupRef.current;
    if (g) {
      g.position.set(...playerState.position);
      g.rotation.y = playerState.rotation;
    }
    if (flashRef.current) flashRef.current.visible = isMuzzleFlashing();
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* temporary "nose" / gun */}
      <mesh position={[0, 0.4, 0.55]}>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* muzzle flash: only visible for 0.05s after each shot */}
      <mesh ref={flashRef} position={[0, 0.4, 0.9]} visible={false}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#ffd966" />
      </mesh>
    </group>
  );
}
