"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type ViewMode = "hero" | "craft" | "stamp";

export interface BagAnimationState {
  progress: number;
  craftProgress: number;
  lifestyleProgress: number;
  viewMode: ViewMode;
  rotation: number;
  scale: number;
  cameraZ: number;
  shellX: number;
  shellY: number;
  shellScale: number;
  inGalleryMode: boolean;
  stampHoldActive: boolean;
}

const defaultState: BagAnimationState = {
  progress: 0,
  craftProgress: 0,
  lifestyleProgress: 0,
  viewMode: "hero",
  rotation: Math.PI * 0.15,
  scale: 1,
  cameraZ: 5.5,
  shellX: 0,
  shellY: 0,
  shellScale: 1,
  inGalleryMode: false,
  stampHoldActive: false,
};

const ScrollContext = createContext<BagAnimationState>(defaultState);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function computeBagState(
  progress: number,
  craftProgress: number,
  lifestyleProgress: number,
  stampHoldActive: boolean,
  pastCraftBag: boolean,
): BagAnimationState {
  const frontAngle = Math.PI * 0.12;
  const sideAngle = Math.PI * 0.52;
  const baseRotation = progress * Math.PI * 2 + Math.PI * 0.15;
  const stampAnim = stampHoldActive ? 1 : lifestyleProgress;
  const logoActive = stampAnim > 0.02 || stampHoldActive;

  if (logoActive) {
    const entry = clamp(stampAnim / 0.45);
    const zoom = clamp((stampAnim - 0.35) / 0.65);

    return {
      progress,
      craftProgress,
      lifestyleProgress,
      viewMode: "stamp",
      rotation: lerp(sideAngle, frontAngle, clamp(stampAnim / 0.55)),
      scale: lerp(1, 1.45, zoom),
      cameraZ: lerp(5.5, 3.1, zoom),
      shellX: lerp(-92, 0, entry),
      shellY: lerp(56, 68, entry),
      shellScale: lerp(1, 1.18, zoom),
      inGalleryMode: true,
      stampHoldActive,
    };
  }

  if (craftProgress > 0.02 && !pastCraftBag) {
    const entry = clamp(craftProgress / 0.45);
    const zoom = clamp((craftProgress - 0.35) / 0.65);

    return {
      progress,
      craftProgress,
      lifestyleProgress,
      viewMode: "craft",
      rotation: lerp(baseRotation, sideAngle, clamp(craftProgress / 0.55)),
      scale: lerp(1, 1.45, zoom),
      cameraZ: lerp(5.5, 3.1, zoom),
      shellX: lerp(92, 0, entry),
      shellY: lerp(0, 28, entry),
      shellScale: lerp(1, 1.18, zoom),
      inGalleryMode: true,
      stampHoldActive: false,
    };
  }

  return {
    progress,
    craftProgress,
    lifestyleProgress,
    viewMode: "hero",
    rotation: baseRotation,
    scale: 1,
    cameraZ: 5.5,
    shellX: 0,
    shellY: 0,
    shellScale: 1,
    inGalleryMode: false,
    stampHoldActive: false,
  };
}

export function ScrollProvider({
  children,
  progress,
  craftProgress,
  lifestyleProgress,
  stampHoldActive,
  pastCraftBag,
}: {
  children: ReactNode;
  progress: number;
  craftProgress: number;
  lifestyleProgress: number;
  stampHoldActive: boolean;
  pastCraftBag: boolean;
}) {
  const value = useMemo(
    () => computeBagState(progress, craftProgress, lifestyleProgress, stampHoldActive, pastCraftBag),
    [progress, craftProgress, lifestyleProgress, stampHoldActive, pastCraftBag],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollProgress() {
  return useContext(ScrollContext);
}
