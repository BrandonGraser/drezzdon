"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const DESKTOP_ASPECT = 2160 / 1080; // 2:1 ultrawide
const MOBILE_ASPECT  = 1080 / 1920;

const CURSOR_RED  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACp0lEQVR4nL3XwYojRRgA4K+TKIIHD4KKrIielBVRFBFlxYue9qCoB0EEQRQ8+AqDj7GKiCKLiouKeJA5rG/gHr0ILsZMsplsZmImmaTTKQ+p3m2anhEm6RQ0ge50/V/99Vd1N4UWaAZaOzRsq/3JPUPe6HJ/CdO4SiuQ1AoINI/5fcHBjO/HvHudB8uYsMLUk5kjPgyE/EhXmJ/GvPc352rHtHkoZRpIM9ISZjTjlxEfdHi4CrNWzeQjmbEbCBmLjGX8XZQw4xm/jvioy6NrjvsWoBVIxrwfA6VLQn6cgpnO2D3i4wHnA8mZCjZPX48HUsYxC8si4v8wA96Og2meNQtNmPJzWAVJqwAFSBbIUuZDXo99rFUHrUByyDt5HZwSfBkICxZDXsvvP3Pw2EECbe5NOThpGmLwLGX/gFc2EbwByWoum+cYLNhd9SurtkoCkz5/wG/rRC/13AokQ94sT0MsvmVGFuc/zOn8w2P5vZsAJKyeDSn9cDtwVqz4jGwRz6W0Ozy+SUQTjvkqBjvOt+Z9Xp3wQzyf5ktxTuc65zeCyAE3uZhX+5z9fZ6Dq9wVl2oZsbfHE2sjAkmCa9w9Z5Qy7PFUvHZngkvcMalGdLs8uQlEAw4lnwx4odhhfPgkO7Sm/FhGpPTat8FrTcetPb28wxURJ9REv83TayNioMrtNUe8RXPClYpM9Ds8szbitLYTEWhM+a4iE4MOz24LkRzxbUUmBntxBdWNaETENxWZGHZ5vlZEfBlpwBGXKzJx0CutqLoRX1cgDnu8uE3Elzmi8OwY3eDCNhFfVCD+vcFL8b/1fGeUEJ+XEQtGfV5W51dXRDQj4rNCTcwDYcbNa9xXG6AC8WnhlX5yyMXapuAkxIRLc/qF1bCdr/CISHZo/MUj8VwT/gP7QEEft6AQpwAAAABJRU5ErkJggg==";
const HOME_IMG = "data:image/png;base64,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";

const CURSOR_BLUE = "data:image/png;base64,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";

const DEBUG = false;

const DESKTOP_META = [
  { id: "my-art",       label: "My Art",      href: "https://www.instagram.com/drezzdon/?hl=en",  external: true  },
  { id: "live-exhibit", label: "Live Exhibit", href: "#",                                           external: false },
  { id: "music",        label: "Music",        href: "/my-music",                 external: false },
  { id: "short-films",  label: "Short Films",  href: "https://www.youtube.com/@drezzdon/videos",   external: true  },
  { id: "backgrounds",  label: "Backgrounds",  href: "/backgrounds",                                   external: false },
];

const MOBILE_META = [
  { id: "my-art",       label: "My Art",      href: "https://www.instagram.com/drezzdon/?hl=en",  external: true  },
  { id: "live-exhibit", label: "Live Exhibit", href: "#",                                           external: false },
  { id: "music",        label: "Music",        href: "/my-music",                 external: false },
  { id: "short-films",  label: "Short Films",  href: "https://www.youtube.com/@drezzdon/videos",   external: true  },
  { id: "backgrounds",  label: "Backgrounds",  href: "/backgrounds",                                   external: false },
];

const INIT_DESKTOP = [
  { id: "my-art",       top: 11.9, left: 17.4, width: 10.2, height: 32.0 },
  { id: "live-exhibit", top: 11.4, left: 70.5, width: 11.1, height: 35.4 },
  { id: "music",        top: 17.6, left: 37.4, width: 23.1, height: 23.2 },
  { id: "short-films",  top: 63.0, left: 17.3, width: 22.9, height: 23.1 },
  { id: "backgrounds",  top: 57.0, left: 62.2, width: 9.9,  height: 31.9 },
];

const INIT_MOBILE = [
  { id: "my-art",       top: 31.7, left: 8.6,  width: 24.4, height: 22.4 },
  { id: "live-exhibit", top: 34.0, left: 53.8, width: 28.0, height: 25.2 },
  { id: "music",        top: 12.2, left: 35.4, width: 56.8, height: 15.8 },
  { id: "short-films",  top: 77.7, left: 11.4, width: 42.6, height: 12.3 },
  { id: "backgrounds",  top: 72.7, left: 69.2, width: 24.8, height: 22.3 },
];

type HotspotPos = { id: string; top: number; left: number; width: number; height: number };
type Action =
  | { type: "move";   id: string; mouseX: number; mouseY: number; origLeft: number; origTop: number }
  | { type: "resize"; id: string; mouseX: number; mouseY: number; origW: number; origH: number };

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

export default function MyWorkPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState<ReturnType<typeof calcDims>>(null);
  const [hovering, setHovering] = useState(false);
  const [desktopPos, setDesktopPos] = useState<HotspotPos[]>(INIT_DESKTOP);
  const [mobilePos,  setMobilePos]  = useState<HotspotPos[]>(INIT_MOBILE);
  const [copied, setCopied] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
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
      const setter = isMobile ? setMobilePos : setDesktopPos;
      if (a.type === "move") {
        setter(hs => hs.map(h => h.id === a.id
          ? { ...h, left: a.origLeft + (dx / dims.renderedW) * 100, top: a.origTop + (dy / dims.renderedH) * 100 }
          : h));
      } else {
        setter(hs => hs.map(h => h.id === a.id
          ? { ...h, width: Math.max(1, a.origW + (dx / dims.renderedW) * 100), height: Math.max(1, a.origH + (dy / dims.renderedH) * 100) }
          : h));
      }
    }
    function onUp() { action.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dims, isMobile]);

  function startMove(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const pos = (isMobile ? mobilePos : desktopPos).find(h => h.id === id)!;
    action.current = { type: "move", id, mouseX: e.clientX, mouseY: e.clientY, origLeft: pos.left, origTop: pos.top };
  }

  function startResize(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    const pos = (isMobile ? mobilePos : desktopPos).find(h => h.id === id)!;
    action.current = { type: "resize", id, mouseX: e.clientX, mouseY: e.clientY, origW: pos.width, origH: pos.height };
  }

  function copyCoords() {
    const positions = isMobile ? mobilePos : desktopPos;
    const text = positions.map(h =>
      `${h.id}: top=${h.top.toFixed(1)}% left=${h.left.toFixed(1)}% width=${h.width.toFixed(1)}% height=${h.height.toFixed(1)}%`
    ).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const hoverOn  = () => setHovering(true);
  const hoverOff = () => setHovering(false);

  const activePos  = isMobile ? mobilePos  : desktopPos;
  const activeMeta = isMobile ? MOBILE_META : DESKTOP_META;

  const videoSrc = isMobile
    ? `/api/video?src=${encodeURIComponent("https://www.dropbox.com/scl/fi/qz0ip69ebeyitg50wpqr7/MY-WORK-1080x1920.mp4?rlkey=om2c7k62pvuaos3v65ctl91vo&raw=1")}`
    : `/api/video?src=${encodeURIComponent("https://www.dropbox.com/scl/fi/517d6vjq72kft5f5l2jv7/MY-WORK-2160x1080.mp4?rlkey=k4ewqna2cw59va577p5gtr0v9&raw=1")}`;

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden bg-black"
      style={{ cursor: isMobile ? "auto" : "none" }}
      onMouseMove={(e) => {
        if (cursorRef.current) {
          cursorRef.current.style.left = e.clientX + "px";
          cursorRef.current.style.top  = e.clientY + "px";
        }
      }}
    >
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-contain object-center"
        src={videoSrc}
        autoPlay muted loop playsInline
      />

      {/* DEBUG HOTSPOTS */}
      {dims && DEBUG && activePos.map((pos) => (
        <div
          key={pos.id}
          className="absolute flex items-center justify-center"
          style={{
            left:   (pos.left   / 100) * dims.renderedW - dims.cropX,
            top:    (pos.top    / 100) * dims.renderedH - dims.cropY,
            width:  (pos.width  / 100) * dims.renderedW,
            height: (pos.height / 100) * dims.renderedH,
            border: "2px solid blue",
            background: "rgba(0,0,255,0.15)",
            cursor: "grab",
            userSelect: "none",
          }}
          onMouseDown={(e) => startMove(e, pos.id)}
        >
          <span className="text-white text-xs tracking-widest uppercase font-bold pointer-events-none select-none">
            {pos.id}
          </span>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-400"
            style={{ cursor: "nwse-resize" }}
            onMouseDown={(e) => startResize(e, pos.id)}
          />
        </div>
      ))}

      {/* LIVE HOTSPOTS */}
      {dims && !DEBUG && activeMeta.map((spot) => {
        const pos = activePos.find(h => h.id === spot.id)!;
        const left   = (pos.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (pos.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (pos.width  / 100) * dims.renderedW;
        const height = (pos.height / 100) * dims.renderedH;
        const style: React.CSSProperties = { left, top, width, height, cursor: "none" };
        return spot.external ? (
          <a key={spot.id} href={spot.href} target="_blank" rel="noopener noreferrer" aria-label={spot.label} className="absolute" style={style}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff} />
        ) : (
          <Link key={spot.id} href={spot.href} aria-label={spot.label} className="absolute" style={style}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff} />
        );
      })}

      {/* DEBUG COPY BUTTON */}
      {DEBUG && (
        <button
          onClick={copyCoords}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
          style={{ background: copied ? "#22c55e" : "#2563eb", color: "white", border: "none", cursor: "none" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        >
          {copied ? "✓ Copied!" : isMobile ? "Copy Mobile Coords" : "Copy Desktop Coords"}
        </button>
      )}

      {/* HOME NAV */}
      <a href="/" aria-label="Home"
        className="fixed top-4 left-4 z-50 w-14 h-14 flex items-center justify-center transition-transform duration-200 hover:scale-110"
        onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        style={{ cursor: isMobile ? "auto" : "none" }}
      >
        <img src={HOME_IMG} alt="Home" className="w-full h-full object-contain" />
      </a>

      {/* CUSTOM CURSOR - desktop only */}
      {!isMobile && <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          top: 0, left: 0,
          width: hovering ? "42px" : "32px",
          height: hovering ? "42px" : "32px",
          transition: "width 0.2s ease, height 0.2s ease",
          backgroundImage: `url('${hovering ? CURSOR_BLUE : CURSOR_RED}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />}
    </div>
  );
}
