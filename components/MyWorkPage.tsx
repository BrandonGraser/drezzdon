"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const VIDEO_ASPECT = 1920 / 1080;

const HOTSPOTS = [
  { id: "my-art",       label: "My Art",      href: "https://www.instagram.com/drezzdon/?hl=en",     external: true  },
  { id: "live-exhibit", label: "Live Exhibit", href: "#",                                              external: false },
  { id: "music",        label: "Music",        href: "https://linktr.ee/drezzdon",                    external: true  },
  { id: "short-films",  label: "Short Films",  href: "https://www.youtube.com/@drezzdon/videos",      external: true  },
  { id: "backgrounds",  label: "Backgrounds",  href: "#",                                              external: false },
];

const POSITIONS: Record<string, { top: number; left: number; width: number; height: number }> = {
  "my-art":       { top: 16.1, left: 18.5, width: 11.6, height: 34.0 },
  "live-exhibit": { top: 20.0, left: 43.2, width: 13.4, height: 38.0 },
  "music":        { top: 17.4, left: 61.9, width: 27.3, height: 24.9 },
  "short-films":  { top: 61.4, left: 17.0, width: 26.9, height: 24.5 },
  "backgrounds":  { top: 52.6, left: 65.0, width: 11.8, height: 33.6 },
};

function calcDims() {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportAspect = vw / vh;
  let renderedW: number, renderedH: number;
  if (viewportAspect > VIDEO_ASPECT) {
    renderedW = vw; renderedH = vw / VIDEO_ASPECT;
  } else {
    renderedH = vh; renderedW = vh * VIDEO_ASPECT;
  }
  const cropX = (renderedW - vw) / 2;
  const cropY = (renderedH - vh) / 2;
  return { renderedW, renderedH, cropX, cropY };
}

export default function MyWorkPage() {
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);

  useEffect(() => {
    function update() { setDims(calcDims()); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-contain object-center"
        src="https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/APDAuw3sTUKaN6Ka2D9cATA/MY%20WORK%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=27dl30cp&dl=1"
        autoPlay muted loop playsInline
      />

      {dims && HOTSPOTS.map((spot) => {
        const pos = POSITIONS[spot.id];
        const left   = (pos.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (pos.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (pos.width  / 100) * dims.renderedW;
        const height = (pos.height / 100) * dims.renderedH;

        const style: React.CSSProperties = { position: "absolute", left, top, width, height };

        return spot.external ? (
          <a
            key={spot.id}
            href={spot.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={spot.label}
            style={style}
          />
        ) : (
          <Link
            key={spot.id}
            href={spot.href}
            aria-label={spot.label}
            style={style}
          />
        );
      })}
    </div>
  );
}
