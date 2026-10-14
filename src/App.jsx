import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { setupInput } from "./systems/input";
import Scene from "./game/Scene";

export default function App() {
  useEffect(() => setupInput(), []);

  return (
    <Canvas onClick={(e) => e.target.requestPointerLock?.()}>
      <Scene />
    </Canvas>
  );
}
