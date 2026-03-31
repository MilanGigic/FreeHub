export const regimeLabel: Record<string, string> = {
  frilenser: "Frilenser",
  pausal: "Paušalno oporezivanje",
  knjigas: "Knjigo­vodstveno preduzeće",
};

export const modelLabel: Record<string, string> = {
  modelA: "Model A — normirani troškovi",
  modelB: "Model B — stvarni troškovi",
};

export const businessModelLabel: Record<string, string> = {
  services: "Usluge",
  goods: "Roba",
  mixed: "Mešovito",
};

export function fmt(val: string | null | undefined) {
  if (!val) return "—";
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString("sr-RS") + " RSD";
}
