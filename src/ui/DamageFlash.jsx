import { useGameStore } from "../store/gameStore";

export default function DamageFlash() {
  const hits = useGameStore((s) => s.damageCount);
  if (hits === 0) return null;
  return <div key={hits} className="damage-flash" />;
}
