/** Radius is half the opposite-vertex diameter. Round for deterministic SSR. */
export function octagon(x: number, y: number, radius: number) {
  return Array.from(
    { length: 8 },
    (_, i) =>
      `${(x + Math.cos(Math.PI / 8 + (i * Math.PI) / 4) * radius).toFixed(4)},${(y + Math.sin(Math.PI / 8 + (i * Math.PI) / 4) * radius).toFixed(4)}`,
  ).join(" ");
}
