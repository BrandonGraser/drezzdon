"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Hotspot positions as % of the NATIVE VIDEO FRAME (1320x880)
const HOTSPOTS = [
  {
    id: "shop",
    label: "Shop",
    href: "https://YOUR-STORE.myshopify.com",
    external: true,
    top: 37.0,
    left: 35.5,
    width: 9.1,
    height: 15.3,
  },
  {
    id: "work",
    label: "My Work",
    href: "/my-work",
    external: false,
    top: 44.0,
    left: 53.0,
    width: 6.8,
    height: 9.7,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    external: false,
    top: 61.0,
    left: 43.0,
    width: 6.8,
    height: 8.5,
  },
];

const VIDEO_ASPECT = 1320 / 880;
const DEBUG = true;

function calcPositions() {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportAspect = vw / vh;

  let renderedW: number, renderedH: number;
  if (viewportAspect > VIDEO_ASPECT) {
    renderedW = vw;
    renderedH = vw / VIDEO_ASPECT;
  } else {
    renderedH = vh;
    renderedW = vh * VIDEO_ASPECT;
  }

  const cropX = (renderedW - vw) / 2;
  const cropY = (renderedH - vh) / 2;

  return { renderedW, renderedH, cropX, cropY };
}

export default function HomePage() {
  const [dims, setDims] = useState(calcPositions);

  useEffect(() => {
    function update() { setDims(calcPositions()); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* FULLSCREEN VIDEO */}
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

        const style = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: DEBUG ? "2px solid blue" : "2px solid transparent",
          background: DEBUG ? "rgba(0,0,255,0.2)" : "transparent",
        };

        return spot.external ? (
          <a
            key={spot.id}
            href={spot.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={spot.label}
            className="absolute flex items-center justify-center rounded-sm"
            style={style}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase font-bold">
              {spot.label}
            </span>
          </a>
        ) : (
          <Link
            key={spot.id}
            href={spot.href}
            aria-label={spot.label}
            className="absolute flex items-center justify-center rounded-sm"
            style={style}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase font-bold">
              {spot.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
