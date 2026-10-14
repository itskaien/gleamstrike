import Player from "./Player";

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

      <Player />
    </>
  );
}
