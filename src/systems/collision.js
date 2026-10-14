const collidables = new Set();

export function registerCollidable(obj) {
  collidables.add(obj);
  return () => collidables.delete(obj);
}

export function getCollidables() {
  return [...collidables];
}
