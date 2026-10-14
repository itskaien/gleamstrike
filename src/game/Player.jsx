import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getKeys } from "../systems/input";
import { playerState } from "../systems/playerState";
import { updateMovement } from "../systems/movement";
import { updateCombat, isMuzzleFlashing } from "../systems/combat";
import { useGameStore } from "../store/gameStore";

export default function Player() {
  const groupRef = useRef();
  const flashRef = useRef();

  useFrame((state, delta) => {
    if (useGameStore.getState().phase === "playing") {
      updateMovement(playerState, getKeys(), delta);
    }
    updateCombat(state.camera, delta);

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
        <meshStandardMaterial color="#A6A8AA" />
      </mesh>

      <mesh position={[0, 0.4, 0.55]}>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="#F0F0EC" />
      </mesh>

      <mesh ref={flashRef} position={[0, 0.4, 0.9]} visible={false}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#ffd966" />
      </mesh>
    </group>
  );
}
