"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Hotspot positions as % of the NATIVE VIDEO FRAME (1320x880)
const HOTSPOTS = [
  {
    id: "shop",
    label: "Shop",
    href: "https://YOUR-STORE.myshopify.com",
    external: true,
    top: 49.4,
    left: 37.1,
    width: 9.1,
    height: 15.3,
  },
  {
    id: "work",
    label: "My Work",
    href: "/my-work",
    external: false,
    top: 55.7,
    left: 53.8,
    width: 6.8,
    height: 9.7,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    external: false,
    top: 73.3,
    left: 43.6,
    width: 6.8,
    height: 8.5,
  },
];

const VIDEO_ASPECT = 1320 / 880; // native video aspect ratio (16:9 = 1.5)
const DEBUG = true; // flip to false once aligned

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    function recalc() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const viewportAspect = vw / vh;

      let renderedW: number, renderedH: number;

      if (viewportAspect > VIDEO_ASPECT) {
        // viewport is wider — video fills width, crops top/bottom
        renderedW = vw;
        renderedH = vw / VIDEO_ASPECT;
      } else {
        // viewport is taller — video fills height, crops left/right
        renderedH = vh;
        renderedW = vh * VIDEO_ASPECT;
      }

      const offsetX = (vw - renderedW) / 2;
      const offsetY = (vh - renderedH) / 2;

      setOffset({ x: offsetX, y: offsetY, scale: renderedW / 100 });
    }

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">

      {/* FULLSCREEN VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/ACc2whiGSh663Pw6UWuiDTc/HOMEPAGE%20-%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=y3pb1twe&dl=1"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* HOTSPOTS — dynamically adjusted for object-cover crop */}
      {HOTSPOTS.map((spot) => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
        const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
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

        const left = (spot.left / 100) * renderedW - cropX;
        const top = (spot.top / 100) * renderedH - cropY;
        const width = (spot.width / 100) * renderedW;
        const height = (spot.height / 100) * renderedH;

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
