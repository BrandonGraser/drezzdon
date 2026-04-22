"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DESKTOP_ASPECT = 1320 / 880;
const MOBILE_ASPECT = 1080 / 1920;

const CURSOR = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACp0lEQVR4nL3XwYojRRgA4K+TKIIHD4KKrIielBVRFBFlxYue9qCoB0EEQRQ8+AqDj7GKiCKLiouKeJA5rG/gHr0ILsZMsplsZmImmaTTKQ+p3m2anhEm6RQ0ge50/V/99Vd1N4UWaAZaOzRsq/3JPUPe6HJ/CdO4SiuQ1AoINI/5fcHBjO/HvHudB8uYsMLUk5kjPgyE/EhXmJ/GvPc352rHtHkoZRpIM9ISZjTjlxEfdHi4CrNWzeQjmbEbCBmLjGX8XZQw4xm/jvioy6NrjvsWoBVIxrwfA6VLQn6cgpnO2D3i4wHnA8mZCjZPX48HUsYxC8si4v8wA96Og2meNQtNmPJzWAVJqwAFSBbIUuZDXo99rFUHrUByyDt5HZwSfBkICxZDXsvvP3Pw2EECbe5NOThpGmLwLGX/gFc2EbwByWoum+cYLNhd9SurtkoCkz5/wG/rRC/13AokQ94sT0MsvmVGFuc/zOn8w2P5vZsAJKyeDSn9cDtwVqz4jGwRz6W0Ozy+SUQTjvkqBjvOt+Z9Xp3wQzyf5ktxTuc65zeCyAE3uZhX+5z9fZ6Dq9wVl2oZsbfHE2sjAkmCa9w9Z5Qy7PFUvHZngkvcMalGdLs8uQlEAw4lnwx4odhhfPgkO7Sm/FhGpPTat8FrTcetPb28wxURJ9REv83TayNioMrtNUe8RXPClYpM9Ds8szbitLYTEWhM+a4iE4MOz24LkRzxbUUmBntxBdWNaETENxWZGHZ5vlZEfBlpwBGXKzJx0CutqLoRX1cgDnu8uE3Elzmi8OwY3eDCNhFfVCD+vcFL8b/1fGeUEJ+XEQtGfV5W51dXRDQj4rNCTcwDYcbNa9xXG6AC8WnhlX5yyMXapuAkxIRLc/qF1bCdr/CISHZo/MUj8VwT/gP7QEEft6AQpwAAAABJRU5ErkJggg==') 0 0, auto";

const DESKTOP_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://drezzdon.myshopify.com/collections/all", external: true, top: 46.5, left: 37.1, width: 9.1, height: 15.3 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 54.5, left: 53.4, width: 6.8, height: 9.7 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 70.2, left: 44.1, width: 6.8, height: 8.5 },
];

const MOBILE_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://drezzdon.myshopify.com/collections/all", external: true, top: 40.6, left: 28.3, width: 18.0, height: 10.0 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 45.2, left: 57.6, width: 14.0, height: 7.0 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 55.7, left: 40.3, width: 14.0, height: 6.0 },
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
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ cursor: CURSOR }}
    >
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
          cursor: CURSOR,
        };

        return spot.external ? (
          <a
            key={spot.id}
            href={spot.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={spot.label}
            className="absolute"
            style={style}
          />
        ) : (
          <Link
            key={spot.id}
            href={spot.href}
            aria-label={spot.label}
            className="absolute"
            style={style}
          />
        );
      })}
    </div>
  );
}
