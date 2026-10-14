import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { setupInput } from "./systems/input";
import Scene from "./game/Scene";

export default function App() {
  useEffect(() => setupInput(), []);

  return (
    <Canvas camera={{ position: [0, 6, 10], fov: 60 }}>
      <Scene />
    </Canvas>
  );
}
