"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const DESKTOP_ASPECT = 1320 / 880;
const MOBILE_ASPECT  = 1080 / 1920;

const CURSOR_RED  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACp0lEQVR4nL3XwYojRRgA4K+TKIIHD4KKrIielBVRFBFlxYue9qCoB0EEQRQ8+AqDj7GKiCKLiouKeJA5rG/gHr0ILsZMsplsZmImmaTTKQ+p3m2anhEm6RQ0ge50/V/99Vd1N4UWaAZaOzRsq/3JPUPe6HJ/CdO4SiuQ1AoINI/5fcHBjO/HvHudB8uYsMLUk5kjPgyE/EhXmJ/GvPc352rHtHkoZRpIM9ISZjTjlxEfdHi4CrNWzeQjmbEbCBmLjGX8XZQw4xm/jvioy6NrjvsWoBVIxrwfA6VLQn6cgpnO2D3i4wHnA8mZCjZPX48HUsYxC8si4v8wA96Og2meNQtNmPJzWAVJqwAFSBbIUuZDXo99rFUHrUByyDt5HZwSfBkICxZDXsvvP3Pw2EECbe5NOThpGmLwLGX/gFc2EbwByWoum+cYLNhd9SurtkoCkz5/wG/rRC/13AokQ94sT0MsvmVGFuc/zOn8w2P5vZsAJKyeDSn9cDtwVqz4jGwRz6W0Ozy+SUQTjvkqBjvOt+Z9Xp3wQzyf5ktxTuc65zeCyAE3uZhX+5z9fZ6Dq9wVl2oZsbfHE2sjAkmCa9w9Z5Qy7PFUvHZngkvcMalGdLs8uQlEAw4lnwx4odhhfPgkO7Sm/FhGpPTat8FrTcetPb28wxURJ9REv83TayNioMrtNUe8RXPClYpM9Ds8szbitLYTEWhM+a4iE4MOz24LkRzxbUUmBntxBdWNaETENxWZGHZ5vlZEfBlpwBGXKzJx0CutqLoRX1cgDnu8uE3Elzmi8OwY3eDCNhFfVCD+vcFL8b/1fGeUEJ+XEQtGfV5W51dXRDQj4rNCTcwDYcbNa9xXG6AC8WnhlX5yyMXapuAkxIRLc/qF1bCdr/CISHZo/MUj8VwT/gP7QEEft6AQpwAAAABJRU5ErkJggg==";
const CURSOR_BLUE = "data:image/png;base64,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";

const DEBUG = false;

const DESKTOP_META = [
  { id: "shop",    href: "https://drezzdon.myshopify.com/collections/all", external: true  },
  { id: "work",    href: "/my-work",                                        external: false },
  { id: "contact", href: "/contact",                                        external: false },
];

const MOBILE_META = [
  { id: "shop",    href: "https://drezzdon.myshopify.com/collections/all", external: true  },
  { id: "work",    href: "/my-work",                                        external: false },
  { id: "contact", href: "/contact",                                        external: false },
];

const INIT_DESKTOP = [
  { id: "shop",    top: 20.6, left: 17.1, width: 27.4, height: 15.0 },
  { id: "work",    top: 69.6, left: 25.5, width: 24.8, height: 9.4  },
  { id: "contact", top: 46.8, left: 1.0,  width: 34.9, height: 8.9  },
];

const INIT_MOBILE = [
  { id: "shop",    top: 20.6, left: 2.9,  width: 39.8, height: 8.7  },
  { id: "work",    top: 30.4, left: 50.8, width: 45.2, height: 8.1  },
  { id: "contact", top: 70.2, left: 18.5, width: 59.8, height: 6.7  },
];

type HotspotPos = { id: string; top: number; left: number; width: number; height: number };
type Action =
  | { type: "move";   id: string; mouseX: number; mouseY: number; origLeft: number; origTop: number }
  | { type: "resize"; id: string; mouseX: number; mouseY: number; origW: number; origH: number };

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/drezzdon/",                         icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "TikTok",    href: "https://www.tiktok.com/@drezzdon",                            icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" },
  { label: "Spotify",   href: "https://open.spotify.com/artist/4a10dwuUNwm8ae6aSnQLUH",     icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
];

const POPUP_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/drezzdon/",                         icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Spotify",   href: "https://open.spotify.com/artist/4a10dwuUNwm8ae6aSnQLUH",     icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { label: "TikTok",    href: "https://www.tiktok.com/@drezzdon",                            icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" },
  { label: "X",         href: "https://x.com/drezzzdon",                                    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" },
  { label: "YouTube",   href: "https://www.youtube.com/channel/UCyYl8kRx1FSkBU8SN9sxSDg",  icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

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
  const [contactOpen, setContactOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [desktopPos, setDesktopPos] = useState<HotspotPos[]>(INIT_DESKTOP);
  const [mobilePos,  setMobilePos]  = useState<HotspotPos[]>(INIT_MOBILE);
  const [copied, setCopied] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [isMobile]);


  const hoverOn  = () => setHovering(true);
  const hoverOff = () => setHovering(false);

  const activePos  = isMobile ? mobilePos  : desktopPos;
  const activeMeta = isMobile ? MOBILE_META : DESKTOP_META;


  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ cursor: isMobile ? "auto" : "none" }}
      onMouseMove={(e) => {
        if (cursorRef.current) {
          cursorRef.current.style.left = e.clientX + "px";
          cursorRef.current.style.top  = e.clientY + "px";
        }
      }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        key={isMobile ? "mobile" : "desktop"}
        className="absolute inset-0 w-full h-full object-cover object-center"
        autoPlay muted loop playsInline
        src={isMobile
          ? "https://www.dropbox.com/scl/fi/w1gzajceiiz0votljrcdt/test.mp4?rlkey=okyfk4j2nva1pkpj0s8vz0k68&raw=1"
          : "https://www.dropbox.com/scl/fi/nregtfu5s1gnio984i7rs/HOMEPAGE-16-9.mp4?rlkey=rsmqdiyjrsz8ir2e2krurf81l&raw=1"
        }
      />

      {/* HOTSPOTS */}
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
      {dims && !DEBUG && activeMeta.map((spot) => {
        const pos = activePos.find(h => h.id === spot.id)!;
        const left   = (pos.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (pos.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (pos.width  / 100) * dims.renderedW;
        const height = (pos.height / 100) * dims.renderedH;
        const style: React.CSSProperties = { left, top, width, height, cursor: isMobile ? "auto" : "none" };

        return spot.external ? (
          <a key={spot.id} href={spot.href} target="_blank" rel="noopener noreferrer" aria-label={spot.id} className="absolute" style={style}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff} />
        ) : (
          <Link key={spot.id} href={spot.href} aria-label={spot.id} className="absolute" style={style}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff} />
        );
      })}
      {/* SOCIAL ICONS — bottom-right desktop, bottom-center mobile */}
      <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex gap-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            className="transition-transform duration-200 hover:scale-110"
            style={{ color: "#ff0000", cursor: isMobile ? "auto" : "none" }}
            onMouseEnter={hoverOn} onMouseLeave={hoverOff}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d={s.icon} />
            </svg>
          </a>
        ))}
      </div>

      {/* CONTACT OVERLAY */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", animation: "fadeIn 0.2s ease forwards", cursor: isMobile ? "auto" : "none" }}
          onClick={() => setContactOpen(false)}
        >
          <div
            className="relative flex flex-col items-center gap-6 p-8 md:p-12"
            style={{ border: "3px solid #ff0000", maxWidth: "90vw", animation: "popupIn 0.25s ease forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-4 font-bold text-2xl leading-none transition-transform duration-200 hover:scale-110"
              style={{ color: "#ff0000", cursor: isMobile ? "auto" : "none" }}
              aria-label="Close"
              onMouseEnter={hoverOn} onMouseLeave={hoverOff}
            >✕</button>

            <a href="mailto:biz@drezzdon.com"
              className="font-black leading-none transition-transform duration-200 hover:scale-105"
              style={{ color: "#ff0000", fontSize: "clamp(1.8rem, 6vw, 4rem)", fontFamily: "'acumin-pro', sans-serif", fontWeight: 700, transform: "scaleY(1.2)", display: "inline-block", cursor: isMobile ? "auto" : "none" }}
              onMouseEnter={hoverOn} onMouseLeave={hoverOff}
            >biz@drezzdon.com</a>

            <div className="flex items-center gap-6">
              {POPUP_SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="transition-transform duration-200 hover:scale-110"
                  style={{ color: "#ff0000", cursor: isMobile ? "auto" : "none" }}
                  onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEBUG COPY BUTTON */}
      {DEBUG && (
        <button
          onClick={copyCoords}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
          style={{ background: copied ? "#22c55e" : "#2563eb", color: "white", border: "none", cursor: isMobile ? "auto" : "none" }}
          onMouseEnter={hoverOn} onMouseLeave={hoverOff}
        >
          {copied ? "✓ Copied!" : isMobile ? "Copy Mobile Coords" : "Copy Desktop Coords"}
        </button>
      )}
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
