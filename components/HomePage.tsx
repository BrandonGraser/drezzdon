"use client";

import Link from "next/link";

const HOTSPOTS = [
  {
    id: "shop",
    label: "Shop",
    href: "https://YOUR-STORE.myshopify.com",
    external: true,
    top: "37%",
    left: "34%",
    width: "12%",
    height: "22%",
  },
  {
    id: "work",
    label: "My Work",
    href: "/my-work",
    external: false,
    top: "40%",
    left: "54%",
    width: "10%",
    height: "18%",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    external: false,
    top: "57%",
    left: "43%",
    width: "10%",
    height: "16%",
  },
];

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
            className="absolute group flex items-center justify-center border-2 border-transparent rounded-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
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
            className="absolute group flex items-center justify-center border-2 border-transparent rounded-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
              {spot.label}
            </span>
          </Link>
        )
      )}
    </div>
  );
}
