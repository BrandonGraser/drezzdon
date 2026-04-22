"use client";

import Link from "next/link";

const HOTSPOTS = [
  {
    id: "shop",
    label: "Shop",
    href: "https://YOUR-STORE.myshopify.com",
    external: true,
    top: "47%",
    left: "26%",
    width: "10%",
    height: "18%",
  },
  {
    id: "work",
    label: "My Work",
    href: "/my-work",
    external: false,
    top: "52%",
    left: "55%",
    width: "8%",
    height: "14%",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    external: false,
    top: "75%",
    left: "45%",
    width: "8%",
    height: "14%",
  },
];

const DEBUG = true; // set to false when hotspots are aligned

export default function HomePage() {
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

      {/* HOTSPOTS */}
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
  );
}
