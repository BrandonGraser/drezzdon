"use client";

import Link from "next/link";

// Positions as % of the VIDEO FRAME (16:9), not the viewport.
// Measure from the top-left corner of the actual video image.
const HOTSPOTS = [
  {
    id: "shop",
    label: "Shop",
    href: "https://YOUR-STORE.myshopify.com",
    external: true,
    top: "47%",
    left: "36%",
    width: "10%",
    height: "18%",
  },
  {
    id: "work",
    label: "My Work",
    href: "/my-work",
    external: false,
    top: "47%",
    left: "57%",
    width: "8%",
    height: "14%",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    external: false,
    top: "68%",
    left: "46%",
    width: "8%",
    height: "12%",
  },
];

const DEBUG = true; // flip to false once aligned

export default function HomePage() {
  return (
    // Full viewport, black background for letterbox bars
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">

      {/* 16:9 container — video never crops, hotspots always match */}
      <div
        className="relative"
        style={{
          aspectRatio: "16 / 9",
          width: "min(100vw, 177.78vh)", // fits width OR height, whichever is smaller
          height: "min(100vh, 56.25vw)",
        }}
      >
        <video
          className="absolute inset-0 w-full h-full"
          src="https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/ACc2whiGSh663Pw6UWuiDTc/HOMEPAGE%20-%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=y3pb1twe&dl=1"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* HOTSPOTS — positioned relative to the video frame */}
        {HOTSPOTS.map((spot) =>
          spot.external ? (
            <a
              key={spot.id}
              href={spot.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={spot.label}
              className="absolute flex items-center justify-center rounded-sm"
              style={{
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
                border: DEBUG ? "2px solid blue" : "2px solid transparent",
                background: DEBUG ? "rgba(0,0,255,0.2)" : "transparent",
              }}
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
              style={{
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
                border: DEBUG ? "2px solid blue" : "2px solid transparent",
                background: DEBUG ? "rgba(0,0,255,0.2)" : "transparent",
              }}
            >
              <span className="text-white text-xs tracking-[0.2em] uppercase font-bold">
                {spot.label}
              </span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
