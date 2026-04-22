"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const VIDEO_ASPECT = 1320 / 880;
const DEBUG = true;

const INITIAL_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 37.0, left: 35.5, width: 9.1, height: 15.3 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 44.0, left: 53.0, width: 6.8, height: 9.7 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 61.0, left: 43.0, width: 6.8, height: 8.5 },
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
  return { renderedW, renderedH, cropX, cropY, vw, vh };
}

export default function HomePage() {
  const [dims, setDims] = useState(calcDims);
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [dragging, setDragging] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; origLeft: number; origTop: number } | null>(null);

  useEffect(() => {
    function update() { setDims(calcDims()); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
    if (!DEBUG) return;
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

      {dims && hotspots.map((spot) => {
        const left = (spot.left / 100) * dims.renderedW - dims.cropX;
        const top = (spot.top / 100) * dims.renderedH - dims.cropY;
        const width = (spot.width / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;

        const style: React.CSSProperties = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: "2px solid blue",
          background: "rgba(0,0,255,0.2)",
          cursor: dragging === spot.id ? "grabbing" : "grab",
          userSelect: "none",
        };

        return (
          <div
            key={spot.id}
            className="absolute flex items-center justify-center rounded-sm"
            style={style}
            onMouseDown={(e) => onMouseDown(e, spot.id)}
          >
            <span className="text-white text-xs tracking-[0.2em] uppercase font-bold pointer-events-none">
              {spot.label}
            </span>
          </div>
        );
      })}

      {DEBUG && (
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
