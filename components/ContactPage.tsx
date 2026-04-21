"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
      >
        <Link href="/" className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-200">
          ← Home
        </Link>
        <ul className="flex gap-9 list-none">
          <li><Link href="/my-work" className="text-xs tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-200">My Work</Link></li>
          <li><Link href="/contact" className="text-xs tracking-[0.18em] uppercase text-white transition-colors duration-200">Contact</Link></li>
          <li><a href="https://YOUR-STORE.myshopify.com" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-200">Shop</a></li>
        </ul>
      </nav>
      <main className="pt-36 pb-20 px-12 max-w-6xl mx-auto" style={{ animation: "fadeUp 0.6s ease forwards" }}>
        <h1 className="text-7xl font-light tracking-tight mb-12">Contact</h1>
        <p className="text-white/40 text-sm tracking-widest uppercase">Content coming soon</p>
      </main>
    </div>
  );
}
