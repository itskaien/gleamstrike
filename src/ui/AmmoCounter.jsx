import { useGameStore } from "../store/gameStore";
import { LOW_AMMO_THRESHOLD } from "../systems/ammo";

export default function AmmoCounter() {
  const ammo = useGameStore((s) => s.ammo);
  const reserve = useGameStore((s) => s.reserve);
  const reloading = useGameStore((s) => s.reloading);
  const phase = useGameStore((s) => s.phase);

  if (phase !== "playing") return null;

  let warning = null;
  if (reloading) warning = "Reloading";
  else if (ammo === 0 && reserve === 0) warning = "No ammo";
  else if (ammo <= LOW_AMMO_THRESHOLD)
    warning = reserve > 0 ? "Reload" : "Low ammo";

  return (
    <div className="ammo">
      {warning && <p className="ammo-warning">{warning}</p>}
      <div className="ammo-row">
        <span className="ammo-mag">{ammo}</span>
        <span className="ammo-reserve">/ {reserve}</span>
      </div>
    </div>
  );
}
