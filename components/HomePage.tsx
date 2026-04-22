"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const VIDEO_ASPECT = 1320 / 880;

const HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 46.5, left: 37.1, width: 9.1, height: 15.3 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 54.5, left: 53.4, width: 6.8, height: 9.7 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 70.2, left: 44.1, width: 6.8, height: 8.5 },
];

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

export default function HomePage() {
  const [dims, setDims] = useState(calcDims);

  useEffect(() => {
    function update() { setDims(calcDims()); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/ACc2whiGSh663Pw6UWuiDTc/HOMEPAGE%20-%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=y3pb1twe&dl=1"
        autoPlay
        muted
        loop
        playsInline
      />

      {dims && HOTSPOTS.map((spot) => {
        const left = (spot.left / 100) * dims.renderedW - dims.cropX;
        const top = (spot.top / 100) * dims.renderedH - dims.cropY;
        const width = (spot.width / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;

        const style: React.CSSProperties = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        };

        return spot.external ? (
          <a
            key={spot.id}
            href={spot.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={spot.label}
            className="absolute group flex items-center justify-center rounded-sm transition-all duration-300 hover:bg-white/10 hover:border hover:border-white/30"
            style={style}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
              {spot.label}
            </span>
          </a>
        ) : (
          <Link
            key={spot.id}
            href={spot.href}
            aria-label={spot.label}
            className="absolute group flex items-center justify-center rounded-sm transition-all duration-300 hover:bg-white/10 hover:border hover:border-white/30"
            style={style}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
              {spot.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
