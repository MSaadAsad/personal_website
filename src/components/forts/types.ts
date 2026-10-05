import type { FortPhotoId } from "./FortPhotos";
import type { ComponentType, ReactNode } from "react";
export interface Feature {
  caption?: string;
  photos?: FortPhotoId[];
  id: string;
  title: string;
  kind: string;
  image: number;
  text: string;
  note: string;
  x?: number;
  y?: number;
  hiddenInRemains?: boolean;
}
export interface SceneProps {
  remains: boolean;
  labels: boolean;
}
/** A place beyond the map, given as a true bearing and distance from the fort. */
export interface NearbyPlace {
  hiddenInRemains?: boolean;
  name: string;
  metres: number;
  bearing: number;
  note?: string;
}
export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface FortSite {
  id: string;
  name: string;
  number: string;
  eyebrow: string;
  heading: ReactNode;
  intro: string;
  other: { href: string; name: string };
  sources: string[];
  features: Feature[];
  side: number;
  ppm: number;
  viewport: Viewport;
  satellite: { href: string; width: number; height: number; transform: string };
  pinScale: number;
  centre?: { x: number; y: number };
  nearby?: NearbyPlace[];
  pinOffset: number;
  focus?: {
    x: number;
    y: number;
    zoom: number;
    feature: string;
    label: string;
  };
  Scene: ComponentType<SceneProps>;
  Detail?: ComponentType<{ id: string; remains: boolean }>;
  dimensions: string;
  archiveTitle: string;
  about: string;
  footnote: string;
  featureForView?: (feature: Feature, remains: boolean) => Feature;
}
