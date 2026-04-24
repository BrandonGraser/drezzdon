"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

const MOBILE_INITIAL = [
  { id: "my-art",       label: "My Art",      top: 10.0, left: 10.0, width: 35.0, height: 20.0 },
  { id: "live-exhibit", label: "Live Exhibit", top: 30.0, left: 10.0, width: 35.0, height: 20.0 },
  { id: "music",        label: "Music",        top: 10.0, left: 55.0, width: 35.0, height: 20.0 },
  { id: "short-films",  label: "Short Films",  top: 55.0, left: 10.0, width: 35.0, height: 20.0 },
  { id: "backgrounds",  label: "Backgrounds",  top: 55.0, left: 55.0, width: 35.0, height: 20.0 },
];

const DEBUG = true;

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

type Action =
  | { type: "move";   id: string; mouseX: number; mouseY: number; origLeft: number; origTop: number }
  | { type: "resize"; id: string; mouseX: number; mouseY: number; origW: number; origH: number };

export default function MyWorkPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);
  const [mobileHotspots, setMobileHotspots] = useState(MOBILE_INITIAL);
  const [copied, setCopied] = useState(false);
  const action = useRef<Action | null>(null);

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

  useEffect(() => {
    if (!dims) return;
    function onMove(e: MouseEvent) {
      if (!action.current || !dims) return;
      const dx = e.clientX - action.current.mouseX;
      const dy = e.clientY - action.current.mouseY;
      const a = action.current;
      if (a.type === "move") {
        setMobileHotspots(hs => hs.map(h => h.id === a.id
          ? { ...h, left: a.origLeft + (dx / dims.renderedW) * 100, top: a.origTop + (dy / dims.renderedH) * 100 }
          : h));
      } else {
        setMobileHotspots(hs => hs.map(h => h.id === a.id
          ? { ...h, width: Math.max(2, a.origW + (dx / dims.renderedW) * 100), height: Math.max(2, a.origH + (dy / dims.renderedH) * 100) }
          : h));
      }
    }
    function onUp() { action.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dims]);

  function startMove(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const spot = mobileHotspots.find(h => h.id === id)!;
    action.current = { type: "move", id, mouseX: e.clientX, mouseY: e.clientY, origLeft: spot.left, origTop: spot.top };
  }

  function startResize(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const spot = mobileHotspots.find(h => h.id === id)!;
    action.current = { type: "resize", id, mouseX: e.clientX, mouseY: e.clientY, origW: spot.width, origH: spot.height };
  }

  function copyCoords() {
    const text = mobileHotspots.map(h =>
      `${h.id}: top=${h.top.toFixed(1)}% left=${h.left.toFixed(1)}% width=${h.width.toFixed(1)}% height=${h.height.toFixed(1)}%`
    ).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const videoSrc = isMobile
    ? "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/AN5ySRUBTuNniG4UgDkLTMA/MY%20WORK%209-16.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=nv4w8gai&dl=1"
    : "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/APDAuw3sTUKaN6Ka2D9cATA/MY%20WORK%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=27dl30cp&dl=1";

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-contain object-center"
        src={videoSrc}
        autoPlay muted loop playsInline
      />

      {/* DESKTOP hotspots — real links, no debug */}
      {!isMobile && dims && DESKTOP_HOTSPOTS.map((spot) => {
        const pos = DESKTOP_POSITIONS[spot.id];
        const left   = (pos.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (pos.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (pos.width  / 100) * dims.renderedW;
        const height = (pos.height / 100) * dims.renderedH;
        const style: React.CSSProperties = { position: "absolute", left, top, width, height };

        return spot.external ? (
          <a key={spot.id} href={spot.href} target="_blank" rel="noopener noreferrer" aria-label={spot.label} style={style} />
        ) : (
          <Link key={spot.id} href={spot.href} aria-label={spot.label} style={style} />
        );
      })}

      {/* MOBILE hotspots — debug mode, no links */}
      {isMobile && DEBUG && dims && mobileHotspots.map((spot) => {
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
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-400"
              style={{ cursor: "nwse-resize" }}
              onMouseDown={(e) => startResize(e, spot.id)}
            />
          </div>
        );
      })}

      {isMobile && DEBUG && (
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
