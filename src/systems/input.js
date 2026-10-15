const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  dash: false,
};

const mouse = {
  deltaX: 0,
  deltaY: 0,
  firing: false,
  shotQueued: false,
};

let reloadQueued = false;

export function setupInput() {
  const handleKeyDown = (e) => {
    if (e.code === "KeyW") keys.forward = true;
    if (e.code === "KeyS") keys.backward = true;
    if (e.code === "KeyA") keys.left = true;
    if (e.code === "KeyD") keys.right = true;
    if (e.code === "Space") {
      keys.dash = true;
      e.preventDefault();
    }
    if (e.code === "KeyR" && !e.repeat) reloadQueued = true;
    if (e.code === "KeyF" && document.pointerLockElement) mouse.firing = true;
  };

  const handleKeyUp = (e) => {
    if (e.code === "KeyW") keys.forward = false;
    if (e.code === "KeyS") keys.backward = false;
    if (e.code === "KeyA") keys.left = false;
    if (e.code === "KeyD") keys.right = false;
    if (e.code === "Space") keys.dash = false;
    if (e.code === "KeyF") mouse.firing = false;
  };

  const handleMouseMove = (e) => {
    mouse.deltaX += e.movementX;
    mouse.deltaY += e.movementY;
  };

  const handleMouseDown = (e) => {
    if (e.button === 0 && document.pointerLockElement) {
      mouse.firing = true;
      mouse.shotQueued = true;
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 0) mouse.firing = false;
  };

  const handleLockChange = () => {
    if (!document.pointerLockElement) mouse.firing = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("pointerlockchange", handleLockChange);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("pointerlockchange", handleLockChange);
  };
}

export function getKeys() {
  return keys;
}

export function isFiring() {
  return mouse.firing;
}

export function consumeShot() {
  const queued = mouse.shotQueued;
  mouse.shotQueued = false;
  return queued;
}

export function consumeReload() {
  const queued = reloadQueued;
  reloadQueued = false;
  return queued;
}

export function consumeMouseDelta() {
  const delta = { x: mouse.deltaX, y: mouse.deltaY };
  mouse.deltaX = 0;
  mouse.deltaY = 0;
  return delta;
}
