import Player from "./Player";
import { useEffect, useRef } from "react";
import { registerCollidable } from "../systems/collision";
import CameraRig from "./CameraRig";
import Bullets from "./Bullets";

function Wall({ position, size = [4, 3, 1] }) {
  const ref = useRef();
  useEffect(() => registerCollidable(ref.current), []);
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#445" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 15, 45]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <gridHelper args={[50, 50, "#999", "#444"]} position={[0, 0.01, 0]} />

      <Wall position={[0, 1.5, -6]} />

      <Bullets />
      <CameraRig />
      <Player />
    </>
  );
}
