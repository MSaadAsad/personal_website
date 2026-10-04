/** Both image and drawing use this single camera; image registration never changes. */
export function camera(
  base: { x: number; y: number; width: number; height: number },
  zoom: number,
  focus?: { x: number; y: number },
) {
  const width = base.width / zoom,
    height = base.height / zoom;
  return {
    x: (focus?.x ?? base.x + base.width / 2) - width / 2,
    y: (focus?.y ?? base.y + base.height / 2) - height / 2,
    width,
    height,
  };
}
export function crossfade(percent: number) {
  const satellite = Math.max(0, Math.min(100, percent)) / 100;
  return { satellite, drawing: 1 - satellite };
}
