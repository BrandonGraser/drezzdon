"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const DESKTOP_ASPECT = 1320 / 880;
const MOBILE_ASPECT = 1080 / 1920;

const DESKTOP_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 46.5, left: 37.1, width: 9.1, height: 15.3 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 54.5, left: 53.4, width: 6.8, height: 9.7 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 70.2, left: 44.1, width: 6.8, height: 8.5 },
];

// Mobile positions — drag to align, same as desktop workflow
const MOBILE_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 46.5, left: 37.1, width: 18.0, height: 10.0 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 54.5, left: 53.4, width: 14.0, height: 7.0 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 70.2, left: 44.1, width: 14.0, height: 6.0 },
];

const DEBUG = true; // flip to false once mobile hotspots are aligned

function calcDims(videoAspect: number) {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportAspect = vw / vh;
  let renderedW: number, renderedH: number;
  if (viewportAspect > videoAspect) {
    renderedW = vw; renderedH = vw / videoAspect;
  } else {
    renderedH = vh; renderedW = vh * videoAspect;
  }
  const cropX = (renderedW - vw) / 2;
  const cropY = (renderedH - vh) / 2;
  return { renderedW, renderedH, cropX, cropY };
}

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);
  const [hotspots, setHotspots] = useState(MOBILE_HOTSPOTS);
  const [dragging, setDragging] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; origLeft: number; origTop: number } | null>(null);

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

  // Drag logic for debug mode
  useEffect(() => {
    if (!dragging || !dims) return;
    function onMouseMove(e: MouseEvent) {
      if (!dragStart.current || !dims) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      const newLeft = dragStart.current.origLeft + (dx / dims.renderedW) * 100;
      const newTop = dragStart.current.origTop + (dy / dims.renderedH) * 100;
      setHotspots(hs => hs.map(h => h.id === dragging ? { ...h, left: newLeft, top: newTop } : h));
    }
    function onMouseUp() { setDragging(null); dragStart.current = null; }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, dims]);

  function onMouseDown(e: React.MouseEvent, id: string) {
    if (!DEBUG || !isMobile) return;
    e.preventDefault();
    const spot = hotspots.find(h => h.id === id)!;
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, origLeft: spot.left, origTop: spot.top };
    setDragging(id);
  }

  function copyCoords() {
    const text = hotspots.map(h =>
      `${h.id}: top=${h.top.toFixed(1)}% left=${h.left.toFixed(1)}% width=${h.width.toFixed(1)}% height=${h.height.toFixed(1)}%`
    ).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeHotspots = isMobile ? hotspots : DESKTOP_HOTSPOTS;
  const videoSrc = isMobile
    ? "https://www.dropbox.com/scl/fi/jlkwuvz4yx9cjrddr0he1/HOMEPAGE-9-16.mp4?rlkey=9yeavghsj4jdhk4nolfv8qack&st=mf4pnsr6&dl=1"
    : "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/ACc2whiGSh663Pw6UWuiDTc/HOMEPAGE%20-%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=y3pb1twe&dl=1";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-cover object-center"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      {dims && activeHotspots.map((spot) => {
        const left = (spot.left / 100) * dims.renderedW - dims.cropX;
        const top = (spot.top / 100) * dims.renderedH - dims.cropY;
        const width = (spot.width / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;

        const style: React.CSSProperties = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          ...(DEBUG && isMobile ? {
            border: "2px solid blue",
            background: "rgba(0,0,255,0.2)",
            cursor: dragging === spot.id ? "grabbing" : "grab",
          } : {}),
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
            onMouseDown={(e) => onMouseDown(e, spot.id)}
          >
            <span className={`text-white text-xs tracking-[0.2em] uppercase font-bold ${DEBUG && isMobile ? "" : "opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"}`}>
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
            onMouseDown={(e) => onMouseDown(e, spot.id)}
          >
            <span className={`text-white text-xs tracking-[0.2em] uppercase font-bold ${DEBUG && isMobile ? "" : "opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"}`}>
              {spot.label}
            </span>
          </Link>
        );
      })}

      {/* Mobile debug copy button */}
      {DEBUG && isMobile && (
        <button
          onClick={copyCoords}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
          style={{ background: copied ? "#22c55e" : "#2563eb", color: "white", border: "none" }}
        >
          {copied ? "✓ Copied!" : "Copy Coordinates"}
        </button>
      )}
    </div>
  );
}
