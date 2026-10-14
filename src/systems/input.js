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
};

export function setupInput() {
  const handleKeyDown = (e) => {
    if (e.code === "KeyW") keys.forward = true;
    if (e.code === "KeyS") keys.backward = true;
    if (e.code === "KeyA") keys.left = true;
    if (e.code === "KeyD") keys.right = true;
    if (e.code === "Space") keys.dash = true;
  };

  const handleKeyUp = (e) => {
    if (e.code === "KeyW") keys.forward = false;
    if (e.code === "KeyS") keys.backward = false;
    if (e.code === "KeyA") keys.left = false;
    if (e.code === "KeyD") keys.right = false;
    if (e.code === "Space") keys.dash = false;
  };

  const handleMouseMove = (e) => {
    mouse.deltaX += e.movementX;
    mouse.deltaY += e.movementY;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}

export function getKeys() {
  return keys;
}

export function consumeMouseDelta() {
  const delta = { x: mouse.deltaX, y: mouse.deltaY };
  mouse.deltaX = 0;
  mouse.deltaY = 0;
  return delta;
}
