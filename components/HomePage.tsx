"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DESKTOP_ASPECT = 1320 / 880;
const MOBILE_ASPECT = 1080 / 1920;

const CURSOR = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACp0lEQVR4nL3XwYojRRgA4K+TKIIHD4KKrIielBVRFBFlxYue9qCoB0EEQRQ8+AqDj7GKiCKLiouKeJA5rG/gHr0ILsZMsplsZmImmaTTKQ+p3m2anhEm6RQ0ge50/V/99Vd1N4UWaAZaOzRsq/3JPUPe6HJ/CdO4SiuQ1AoINI/5fcHBjO/HvHudB8uYsMLUk5kjPgyE/EhXmJ/GvPc352rHtHkoZRpIM9ISZjTjlxEfdHi4CrNWzeQjmbEbCBmLjGX8XZQw4xm/jvioy6NrjvsWoBVIxrwfA6VLQn6cgpnO2D3i4wHnA8mZCjZPX48HUsYxC8si4v8wA96Og2meNQtNmPJzWAVJqwAFSBbIUuZDXo99rFUHrUByyDt5HZwSfBkICxZDXsvvP3Pw2EECbe5NOThpGmLwLGX/gFc2EbwByWoum+cYLNhd9SurtkoCkz5/wG/rRC/13AokQ94sT0MsvmVGFuc/zOn8w2P5vZsAJKyeDSn9cDtwVqz4jGwRz6W0Ozy+SUQTjvkqBjvOt+Z9Xp3wQzyf5ktxTuc65zeCyAE3uZhX+5z9fZ6Dq9wVl2oZsbfHE2sjAkmCa9w9Z5Qy7PFUvHZngkvcMalGdLs8uQlEAw4lnwx4odhhfPgkO7Sm/FhGpPTat8FrTcetPb28wxURJ9REv83TayNioMrtNUe8RXPClYpM9Ds8szbitLYTEWhM+a4iE4MOz24LkRzxbUUmBntxBdWNaETENxWZGHZ5vlZEfBlpwBGXKzJx0CutqLoRX1cgDnu8uE3Elzmi8OwY3eDCNhFfVCD+vcFL8b/1fGeUEJ+XEQtGfV5W51dXRDQj4rNCTcwDYcbNa9xXG6AC8WnhlX5yyMXapuAkxIRLc/qF1bCdr/CISHZo/MUj8VwT/gP7QEEft6AQpwAAAABJRU5ErkJggg==') 0 0, auto";

const DESKTOP_HOTSPOTS = [
  { id: "shop",    href: "https://drezzdon.myshopify.com/collections/all", external: true,    top: 46.5, left: 37.1, width: 9.1,  height: 15.3 },
  { id: "work",    href: "/my-work",                                        external: false,   top: 54.5, left: 53.4, width: 6.8,  height: 9.7  },
  { id: "contact", href: "#contact",                                        external: false,   top: 70.2, left: 44.1, width: 6.8,  height: 8.5  },
];

const MOBILE_HOTSPOTS = [
  { id: "shop",    href: "https://drezzdon.myshopify.com/collections/all", external: true,    top: 40.6, left: 28.3, width: 18.0, height: 10.0 },
  { id: "work",    href: "/my-work",                                        external: false,   top: 45.2, left: 57.6, width: 14.0, height: 7.0  },
  { id: "contact", href: "#contact",                                        external: false,   top: 55.7, left: 40.3, width: 14.0, height: 6.0  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/drezzdon/",         icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Spotify",   href: "https://open.spotify.com/artist/4a10dwuUNwm8ae6aSnQLUH", icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { label: "TikTok",    href: "https://www.tiktok.com/@drezzdon",            icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" },
  { label: "X",         href: "https://x.com/drezzzdon",                     icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" },
  { label: "YouTube",   href: "https://www.youtube.com/channel/UCyYl8kRx1FSkBU8SN9sxSDg", icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
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

  const activeHotspots = isMobile ? MOBILE_HOTSPOTS : DESKTOP_HOTSPOTS;
  const videoSrc = isMobile
    ? "https://www.dropbox.com/scl/fi/jlkwuvz4yx9cjrddr0he1/HOMEPAGE-9-16.mp4?rlkey=9yeavghsj4jdhk4nolfv8qack&st=mf4pnsr6&dl=1"
    : "https://www.dropbox.com/scl/fo/6tk8vtqi2yumnwal10a3g/ACc2whiGSh663Pw6UWuiDTc/HOMEPAGE%20-%2016-9.mp4?rlkey=lj9i39hr7vn4bjb7j4vlkmpzx&st=y3pb1twe&dl=1";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" style={{ cursor: CURSOR }}>

      {/* VIDEO */}
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-cover object-center"
        src={videoSrc}
        autoPlay muted loop playsInline
      />

      {/* HOTSPOTS */}
      {dims && activeHotspots.map((spot) => {
        const left   = (spot.left   / 100) * dims.renderedW - dims.cropX;
        const top    = (spot.top    / 100) * dims.renderedH - dims.cropY;
        const width  = (spot.width  / 100) * dims.renderedW;
        const height = (spot.height / 100) * dims.renderedH;
        const style: React.CSSProperties = { left, top, width, height, cursor: CURSOR };

        if (spot.id === "contact") {
          return (
            <button
              key={spot.id}
              aria-label="Contact"
              className="absolute"
              style={style}
              onClick={() => setContactOpen(true)}
            />
          );
        }

        return spot.external ? (
          <a key={spot.id} href={spot.href} target="_blank" rel="noopener noreferrer" aria-label={spot.id} className="absolute" style={style} />
        ) : (
          <Link key={spot.id} href={spot.href} aria-label={spot.id} className="absolute" style={style} />
        );
      })}

      {/* CONTACT OVERLAY */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", animation: "fadeIn 0.2s ease forwards" }}
          onClick={() => setContactOpen(false)}
        >
          <div
            className="relative flex flex-col items-center gap-6 p-8 md:p-12"
            style={{ border: "3px solid #ff0000", background: "rgba(0,0,0,0.0)", maxWidth: "90vw", animation: "popupIn 0.25s ease forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-4 font-bold text-2xl leading-none transition-transform duration-200 hover:scale-110" style={{ color: "#ff0000" }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Email */}
            <a
              href="mailto:biz@drezzdon.com"
              className="font-black leading-none transition-transform duration-200 hover:scale-105"
              style={{ color: "#ff0000", fontSize: "clamp(1.8rem, 6vw, 4rem)", fontFamily: "'acumin-pro', sans-serif", fontWeight: 700, transform: "scaleY(1.2)", display: "inline-block" }}
            >
              biz@drezzdon.com
            </a>

            {/* Social icons */}
            <div className="flex items-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="transition-transform duration-200 hover:scale-110" style={{ color: "#ff0000" }}
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
    </div>
  );
}
