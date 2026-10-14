import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { setupInput } from "./systems/input";
import Scene from "./game/Scene";
import Crosshair from "./ui/Crosshair";
import DamageFlash from "./ui/DamageFlash";
import GameOver from "./ui/GameOver";

export default function App() {
  useEffect(() => setupInput(), []);

  return (
    <>
      <Canvas onClick={(e) => e.target.requestPointerLock?.()}>
        <Scene />
      </Canvas>
      <Crosshair />
      <DamageFlash />
      <GameOver />
    </>
  );
}
