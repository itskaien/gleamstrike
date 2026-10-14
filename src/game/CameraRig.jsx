import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { consumeMouseDelta } from "../systems/input";
import { playerState } from "../systems/playerState";
import { getCollidables } from "../systems/collision";

const SENSITIVITY = 0.001;
const MAX_DELTA = 60; // pixels per frame, tames trackpad whips
const MIN_PITCH = -0.5; // looking up
const MAX_PITCH = 0.9; // looking down
const DISTANCE = 4.5; // how far behind the player
const SHOULDER_OFFSET = 0.9; // camera sits to the right (negative = left shoulder)
const PIVOT_HEIGHT = 0.6; // pivot above capsule center (shoulder/head level)
const FOLLOW_SPEED = 14;
const WALL_PADDING = 0.3;
const MIN_CAMERA_HEIGHT = 0.4; // keep the camera out of the floor

export default function CameraRig() {
  const yaw = useRef(0);
  const pitch = useRef(0.1); // positive = looking down
  const smoothPivot = useRef(new THREE.Vector3(0, 1.6, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const target = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { camera, gl } = state;

    // 1. Mouse look (only while pointer is locked)
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

    // 2. Pivot follows the player smoothly
    const [px, py, pz] = playerState.position;
    target.current.set(px, py + PIVOT_HEIGHT, pz);
    const t = 1 - Math.exp(-FOLLOW_SPEED * delta);
    smoothPivot.current.lerp(target.current, t);

    // 3. The direction the camera LOOKS (this is where the crosshair points)
    const cp = Math.cos(pitch.current);
    forward.current.set(
      -Math.sin(yaw.current) * cp,
      -Math.sin(pitch.current),
      -Math.cos(yaw.current) * cp,
    );

    // 4. Camera sits behind the look direction, shifted onto the shoulder
    offset.current.copy(forward.current).multiplyScalar(-DISTANCE);
    offset.current.x += Math.cos(yaw.current) * SHOULDER_OFFSET;
    offset.current.z += -Math.sin(yaw.current) * SHOULDER_OFFSET;
    let len = offset.current.length();
    offset.current.divideScalar(len);

    // 5. Camera collision: pull in if a wall is in the way
    raycaster.current.set(smoothPivot.current, offset.current);
    raycaster.current.far = len;
    const hits = raycaster.current.intersectObjects(getCollidables(), false);
    if (hits.length > 0) len = Math.max(hits[0].distance - WALL_PADDING, 0.5);

    // 6. Place the camera, then look ALONG the forward direction
    camera.position
      .copy(smoothPivot.current)
      .addScaledVector(offset.current, len);
    camera.position.y = Math.max(camera.position.y, MIN_CAMERA_HEIGHT);
    lookAt.current.copy(camera.position).add(forward.current);
    camera.lookAt(lookAt.current);
  });

  return null;
}
