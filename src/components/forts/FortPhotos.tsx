import type { CSSProperties } from "react";

const photos = {
  pond: ['padhar-pond.jpg', 'Chappar near Padhar'],
  wall: ['padhar-wall.jpg', 'Padhar: surviving brick wall and loopholes'],
  buttress: ['padhar-buttress.jpg', 'Padhar: gatehouse buttress incorporated into a house'],
  well: ['padhar-well.jpg', 'Padhar: brick-lined well'],
  gateContext: ['padhar-gate-context.jpg', 'Padhar: gatehouse and adjoining wall'],
  gate: ['padhar-gate.jpg', 'Padhar: surviving gate arch'],
  stonework: ['batala-stonework.jpg', 'Batala: exposed stonework'],
  foundation: ['batala-foundation.jpg', 'Batala: partly buried masonry'],
  batalaWall: ['batala-wall.jpg', 'Batala: masonry along the slope'],
  historicalMap: ['bhimber-historical-map.png', '1921 Survey of India map showing Padhar, Hir, Barnala and Batala'],
} as const;
const photoRatios: Record<keyof typeof photos, number> = {
  pond: 1120 / 504, wall: 1120 / 504, buttress: 504 / 1120,
  well: 1600 / 759, gateContext: 1600 / 759, gate: 759 / 1600,
  stonework: 1600 / 759, foundation: 1600 / 759, batalaWall: 1600 / 759,
  historicalMap: 860 / 1320,
};
export type FortPhotoId = keyof typeof photos;

export function FortPhotos({ images }: { images: FortPhotoId[] }) {
  return (
    <div className="fort-photos" style={{ "--photo-columns": images.map(id => `${photoRatios[id]}fr`).join(" ") } as CSSProperties}>
      {images.map(id => {
        const [file, caption] = photos[id];
        const src = `/assets/writing/bhimber-forts/${file}`;
        return <figure key={id} className={photoRatios[id] < 1 ? "fort-photo-portrait" : undefined}>
          <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open photograph: ${caption}`}>
            <img src={src} alt={caption} loading="lazy" />
          </a>
          <figcaption>{caption}</figcaption>
        </figure>;
      })}
    </div>
  );
}
