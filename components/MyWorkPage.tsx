"use client";

import { useEffect, useState, useRef } from "react";

const VIDEO_ASPECT = 1920 / 1080;

const INITIAL_HOTSPOTS = [
  { id: "my-art",       label: "My Art",       href: "#", top: 8.0,  left: 12.0, width: 14.0, height: 28.0 },
  { id: "live-exhibit", label: "Live Exhibit",  href: "#", top: 8.0,  left: 43.0, width: 11.0, height: 35.0 },
  { id: "music",        label: "Music",         href: "#", top: 8.0,  left: 64.0, width: 30.0, height: 27.0 },
  { id: "short-films",  label: "Short Films",   href: "#", top: 47.0, left: 11.0, width: 22.0, height: 30.0 },
  { id: "backgrounds",  label: "Backgrounds",   href: "#", top: 47.0, left: 67.0, width: 16.0, height: 30.0 },
];

const DEBUG = true;

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

type Action =
  | { type: "move"; id: string; mouseX: number; mouseY: number; origLeft: number; origTop: number }
  | { type: "resize"; id: string; mouseX: number; mouseY: number; origW: number; origH: number };

export default function MyWorkPage() {
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [copied, setCopied] = useState(false);
  const action = useRef<Action | null>(null);

  useEffect(() => {
    function update() { setDims(calcDims()); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!dims) return;
    function onMove(e: MouseEvent) {
      if (!action.current || !dims) return;
      const dx = e.clientX - action.current.mouseX;
      const dy = e.clientY - action.current.mouseY;
      const a = action.current;
      if (a.type === "move") {
        const newLeft = a.origLeft + (dx / dims.renderedW) * 100;
        const newTop  = a.origTop  + (dy / dims.renderedH) * 100;
        setHotspots(hs => hs.map(h => h.id === a.id ? { ...h, left: newLeft, top: newTop } : h));
      } else {
        const newW = Math.max(2, a.origW + (dx / dims.renderedW) * 100);
        const newH = Math.max(2, a.origH + (dy / dims.renderedH) * 100);
        setHotspots(hs => hs.map(h => h.id === a.id ? { ...h, width: newW, height: newH } : h));
      }
    }
    function onUp() { action.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dims]);

  function startMove(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const spot = hotspots.find(h => h.id === id)!;
    action.current = { type: "move", id, mouseX: e.clientX, mouseY: e.clientY, origLeft: spot.left, origTop: spot.top };
  }

  function startResize(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const spot = hotspots.find(h => h.id === id)!;
    action.current = { type: "resize", id, mouseX: e.clientX, mouseY: e.clientY, origW: spot.width, origH: spot.height };
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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-contain object-center"
        src="https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/APDAuw3sTUKaN6Ka2D9cATA/MY%20WORK%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=27dl30cp&dl=1"
        autoPlay muted loop playsInline
      />

      {dims && hotspots.map((spot) => {
        const left   = (spot.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (spot.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (spot.width  / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;

        return (
          <div
            key={spot.id}
            className="absolute flex items-center justify-center"
            style={{ left, top, width, height, border: "2px solid blue", background: "rgba(0,0,255,0.15)", cursor: "grab", userSelect: "none" }}
            onMouseDown={(e) => startMove(e, spot.id)}
          >
            <span className="text-white text-xs tracking-widest uppercase font-bold pointer-events-none select-none">
              {spot.label}
            </span>
            {/* Resize handle — bottom-right corner */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-400"
              style={{ cursor: "nwse-resize" }}
              onMouseDown={(e) => startResize(e, spot.id)}
            />
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
