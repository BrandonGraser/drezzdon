"use client";

import Link from "next/link";
import NavButtons from "@/components/NavButtons";
import { useEffect, useState } from "react";

const DESKTOP_ASPECT = 1920 / 1080;
const MOBILE_ASPECT = 1080 / 1920;

const DESKTOP_HOTSPOTS = [
  { id: "my-art",       label: "My Art",      href: "https://www.instagram.com/drezzdon/?hl=en",  external: true  },
  { id: "live-exhibit", label: "Live Exhibit", href: "#",                                           external: false },
  { id: "music",        label: "Music",        href: "https://linktr.ee/drezzdon",                 external: true  },
  { id: "short-films",  label: "Short Films",  href: "https://www.youtube.com/@drezzdon/videos",   external: true  },
  { id: "backgrounds",  label: "Backgrounds",  href: "#",                                           external: false },
];

const DESKTOP_POSITIONS: Record<string, { top: number; left: number; width: number; height: number }> = {
  "my-art":       { top: 16.1, left: 18.5, width: 11.6, height: 34.0 },
  "live-exhibit": { top: 20.0, left: 43.2, width: 13.4, height: 38.0 },
  "music":        { top: 17.4, left: 61.9, width: 27.3, height: 24.9 },
  "short-films":  { top: 61.4, left: 17.0, width: 26.9, height: 24.5 },
  "backgrounds":  { top: 52.6, left: 65.0, width: 11.8, height: 33.6 },
};

const MOBILE_HOTSPOTS = [
  { id: "my-art",       label: "My Art",      href: "https://www.instagram.com/drezzdon/?hl=en",  external: true,  top: 17.4, left: 7.8,  width: 24.4, height: 22.4 },
  { id: "live-exhibit", label: "Live Exhibit", href: "#",                                           external: false, top: 41.9, left: 59.8, width: 28.0, height: 25.2 },
  { id: "music",        label: "Music",        href: "https://linktr.ee/drezzdon",                 external: true,  top: 10.6, left: 40.0, width: 51.2, height: 14.9 },
  { id: "short-films",  label: "Short Films",  href: "https://www.youtube.com/@drezzdon/videos",   external: true,  top: 80.4, left: 24.4, width: 49.8, height: 14.5 },
  { id: "backgrounds",  label: "Backgrounds",  href: "#",                                           external: false, top: 53.3, left: 5.6,  width: 24.8, height: 22.3 },
];

function calcDims(aspect: number) {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportAspect = vw / vh;
  let renderedW: number, renderedH: number;
  if (viewportAspect > aspect) {
    renderedW = vw; renderedH = vw / aspect;
  } else {
    renderedH = vh; renderedW = vh * aspect;
  }
  const cropX = (renderedW - vw) / 2;
  const cropY = (renderedH - vh) / 2;
  return { renderedW, renderedH, cropX, cropY };
}

export default function MyWorkPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);

  useEffect(() => {
    function update() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDims(calcDims(mobile ? MOBILE_ASPECT : DESKTOP_ASPECT));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const activeHotspots = isMobile ? MOBILE_HOTSPOTS : DESKTOP_HOTSPOTS.map(h => ({ ...h, ...DESKTOP_POSITIONS[h.id] }));
  const videoSrc = isMobile
    ? "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/AN5ySRUBTuNniG4UgDkLTMA/MY%20WORK%209-16.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=nv4w8gai&dl=1"
    : "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/APDAuw3sTUKaN6Ka2D9cATA/MY%20WORK%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=27dl30cp&dl=1";

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <NavButtons />
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-contain object-center"
        src={videoSrc}
        autoPlay muted loop playsInline
      />

      {dims && activeHotspots.map((spot) => {
        const left   = (spot.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (spot.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (spot.width  / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;
        const style: React.CSSProperties = { position: "absolute", left, top, width, height };

        return spot.external ? (
          <a key={spot.id} href={spot.href} target="_blank" rel="noopener noreferrer" aria-label={spot.label} style={style} />
        ) : (
          <Link key={spot.id} href={spot.href} aria-label={spot.label} style={style} />
        );
      })}
    </div>
  );
}
