import Player from "./Player";
import { useEffect, useRef } from "react";
import { registerCollidable } from "../systems/collision";
import CameraRig from "./CameraRig";
import Bullets from "./Bullets";
import Enemies from "./Enemies";
import Effects from "./Effects";
import EnemyBullets from "./EnemyBullets";
import Pickups from "./Pickups";

function Wall({ position, size = [4, 3, 1] }) {
  const ref = useRef();
  useEffect(() => registerCollidable(ref.current), []);
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#343638" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#101112"]} />
      <fog attach="fog" args={["#101112", 15, 45]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#101112" />
      </mesh>

      <gridHelper args={[50, 50, "#999", "#444"]} position={[0, 0.01, 0]} />

      <Wall position={[0, 1.5, -6]} />

      <Bullets />
      <EnemyBullets />
      <Effects />
      <Pickups />
      <CameraRig />
      <Enemies />
      <Player />
    </>
  );
}
