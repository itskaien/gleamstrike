import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { consumeMouseDelta } from "../systems/input";
import { playerState } from "../systems/playerState";
import { getCollidables } from "../systems/collision";

const SENSITIVITY = 0.002;
const MIN_PITCH = -0.2;
const MAX_PITCH = 1.2;
const DISTANCE = 6;
const PIVOT_HEIGHT = 0.5;
const FOLLOW_SPEED = 10;
const WALL_PADDING = 0.3;

export default function CameraRig() {
  const { camera, gl } = useThree();

  const yaw = useRef(0);
  const pitch = useRef(0.4);
  const smoothPivot = useRef(new THREE.Vector3(0, 1.5, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const target = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const m = consumeMouseDelta();
    if (document.pointerLockElement === gl.domElement) {
      yaw.current -= m.x * SENSITIVITY;
      pitch.current += m.y * SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        MIN_PITCH,
        MAX_PITCH,
      );
    }
    playerState.cameraYaw = yaw.current;

    const [px, py, pz] = playerState.position;
    target.current.set(px, py + PIVOT_HEIGHT, pz);
    const t = 1 - Math.exp(-FOLLOW_SPEED * delta);
    smoothPivot.current.lerp(target.current, t);

    const cosP = Math.cos(pitch.current);
    dir.current.set(
      Math.sin(yaw.current) * cosP,
      Math.sin(pitch.current),
      Math.cos(yaw.current) * cosP,
    );

    let distance = DISTANCE;
    raycaster.current.set(smoothPivot.current, dir.current);
    raycaster.current.far = DISTANCE;
    const hits = raycaster.current.intersectObjects(getCollidables(), false);
    if (hits.length > 0) {
      distance = Math.max(hits[0].distance - WALL_PADDING, 0.5);
    }

    camera.position
      .copy(smoothPivot.current)
      .addScaledVector(dir.current, distance);
    camera.lookAt(smoothPivot.current);
  });

  return null;
}
