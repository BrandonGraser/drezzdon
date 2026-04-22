"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DESKTOP_ASPECT = 1320 / 880;
const MOBILE_ASPECT = 1080 / 1920;

const CURSOR = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAACZklEQVR4nLXXT2sTQRjH8e8kRfDQg4gKWvCiWLQoKlrRkzcFFcGLCIIiePEd+DpEEURFFFqlBQ+ivgXfgUdb0bbaxn9FbRJ/HvaZ7DiZte1udmDY3YTd5zPzPDPZOEBYawIO6IYf1twaw8A5HFsscMeCNwNQra0JegNaAk2ALoG2ZYZeb4CG7MjgO7oGUtAXQVOgy6Dt9WPQDtAyqA1aiTAt0HPQVdBIAcZVAfiRvLSAbVDXju0I8w30AnQdtHNQM+BHcCUA/Al6EeYH6BXoBk6j9oxSM+Fv2gr6ag/vRojVMBecE6Bm2RrwN05boJUCgO8dw/wCnbXgFYoyL6SLBWmIZ0GGPGPBh6rVQZ67TWRLsCgNXesLoJODCa4GdtYEWsBru+7S30S2My4Db6XeZ1VbbyQOdD6RBj/yjnWBZkC7gnsrzEJ24tMwDJoL0uAD+t4hXwXvQLurI/ILvxru4yTQTwu0ZDl/GhSgR8yA9lRD9ANOkVf7POgQWcFtAE0bLkTMgkbLI/ILv5tttFF/Bo0FwZ0hpxKI96C95RB9y0KAbjqn8eiBjQDxLIH4ANq3fsSq67Tv2tlxMlETH0Fj60MUBy7aXv13DjSRmIk50P61I8otHz8LgJ4kZmIedIA17ZblADHicQKxADq4+kyUB8SIRwnEJ9Dh/yOqAWLEw0RNLIKOFCOqA2LEgwRiCXQ0jRgMIEbcSyBaoGP9iMEBYsTdBOIL6Dj/vEUNFuAR/nflTgHihCFqAcSI2wHiN/k+sblOQIy4ZQiBvoNO15mCYkS2TY8HNeB8Hups4T/sEWCW7B20C/wF25xlsry2/qMAAAAASUVORK5CYII=') 0 0, auto";

const DESKTOP_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 46.5, left: 37.1, width: 9.1, height: 15.3 },
  { id: "work", label: "My Work", href: "/my-work", external: false, top: 54.5, left: 53.4, width: 6.8, height: 9.7 },
  { id: "contact", label: "Contact", href: "/contact", external: false, top: 70.2, left: 44.1, width: 6.8, height: 8.5 },
];

const MOBILE_HOTSPOTS = [
  { id: "shop", label: "Shop", href: "https://YOUR-STORE.myshopify.com", external: true, top: 40.6, left: 28.3, width: 18.0, height: 10.0 },
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
