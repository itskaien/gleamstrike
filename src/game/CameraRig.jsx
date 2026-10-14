import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { consumeMouseDelta } from "../systems/input";
import { playerState } from "../systems/playerState";
import { getCollidables } from "../systems/collision";

const SENSITIVITY = 0.001;
const MAX_DELTA = 60;
const MIN_PITCH = -0.5;
const MAX_PITCH = 0.9;
const DISTANCE = 4.5;
const SHOULDER_OFFSET = 0.9;
const PIVOT_HEIGHT = 0.6;
const FOLLOW_SPEED = 14;
const WALL_PADDING = 0.3;
const MIN_CAMERA_HEIGHT = 0.4;
const SHAKE_STRENGTH = 0.4;
const SHAKE_DECAY = 3;

export default function CameraRig() {
  const yaw = useRef(0);
  const pitch = useRef(0.1);
  const smoothPivot = useRef(new THREE.Vector3(0, 1.6, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const target = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { camera, gl } = state;

    const m = consumeMouseDelta();
    if (document.pointerLockElement === gl.domElement) {
      const dx = THREE.MathUtils.clamp(m.x, -MAX_DELTA, MAX_DELTA);
      const dy = THREE.MathUtils.clamp(m.y, -MAX_DELTA, MAX_DELTA);
      yaw.current -= dx * SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current + dy * SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH,
      );
    }
    playerState.cameraYaw = yaw.current;

    const [px, py, pz] = playerState.position;
    target.current.set(px, py + PIVOT_HEIGHT, pz);
    smoothPivot.current.lerp(
      target.current,
      1 - Math.exp(-FOLLOW_SPEED * delta),
    );

    const cp = Math.cos(pitch.current);
    forward.current.set(
      -Math.sin(yaw.current) * cp,
      -Math.sin(pitch.current),
      -Math.cos(yaw.current) * cp,
    );

    offset.current.copy(forward.current).multiplyScalar(-DISTANCE);
    offset.current.x += Math.cos(yaw.current) * SHOULDER_OFFSET;
    offset.current.z += -Math.sin(yaw.current) * SHOULDER_OFFSET;
    let len = offset.current.length();
    offset.current.divideScalar(len);

    raycaster.current.set(smoothPivot.current, offset.current);
    raycaster.current.far = len;
    const hits = raycaster.current.intersectObjects(getCollidables(), false);
    if (hits.length > 0) len = Math.max(hits[0].distance - WALL_PADDING, 0.5);

    camera.position
      .copy(smoothPivot.current)
      .addScaledVector(offset.current, len);
    camera.position.y = Math.max(camera.position.y, MIN_CAMERA_HEIGHT);

    const shake = playerState.shake;
    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake * SHAKE_STRENGTH;
      camera.position.y += (Math.random() - 0.5) * shake * SHAKE_STRENGTH;
      camera.position.z += (Math.random() - 0.5) * shake * SHAKE_STRENGTH;
      playerState.shake = Math.max(0, shake - delta * SHAKE_DECAY);
    }

    lookAt.current.copy(camera.position).add(forward.current);
    camera.lookAt(lookAt.current);
  });

  return null;
}
