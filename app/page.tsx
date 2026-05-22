"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── Types ─────────────────────────────────────────────── */
interface DiscoItem {
  img: string; alt: string; type: string; title: string; year: string; href: string;
}
interface GalleryItem {
  src: string; alt: string; featured?: boolean;
}
interface TourItem {
  day: string; month: string; city: string; href: string | null; out?: boolean;
}

/* ─── Data ───────────────────────────────────────────────── */
const DISCOGRAPHY: DiscoItem[] = [
  { img: "/img/kontando-el-tiempo.jpg",       alt: "kontando el tiempo",        type: "SENCILLO",    title: "kontando el tiempo", year: "2026", href: "https://open.spotify.com/track/2bPLhS4VFelCuHPSxVPR1Y?si=_SiIM81xRUqExMXVtKJHqw" },
  { img: "/img/BUENOS-VALORES-MALOS-MODALS.jpg", alt: "BUENOS VALORES MALOS MODALES", type: "ÁLBUM DEBUT", title: "BVMM",               year: "2025", href: "https://open.spotify.com/album/6tUILrPjOM4zx0TCK8xwwY?si=WfKA5mx6RbuzCz6z-R-GEw" },
  { img: "/img/SOLO-ESTOY-JUGANDO.jpg",       alt: "Solo Estoy Jugando",        type: "MIXTAPE",     title: "solo estoy jugando", year: "2024", href: "https://open.spotify.com/album/3Xp05lTrokyNhmksd0knNL?si=NvtBJz2fTli2leyd0YJF_g" },
  { img: "/img/Single-Irrekonocible.jpg",     alt: "irrekonocible",             type: "SENCILLO",    title: "irrekonocible",      year: "2026", href: "https://open.spotify.com/track/413vaWwe4B9Bw0EU5MOziB?si=h5sfjehbS02sF3tS5K1VWQ" },
];

const GALLERY: GalleryItem[] = [
  { src: "/img/IMG_2405.PNG", alt: "KUINA silueta escenario" },
  { src: "/img/IMG_2403.PNG", alt: "KUINA en escena azul" },
  { src: "/img/IMG_2396.PNG", alt: "KUINA luz estadio" },
  { src: "/img/IMG_2400.PNG", alt: "KUINA en vivo tiara" },
  { src: "/img/IMG_2404.PNG", alt: "KUINA actuando" },
  { src: "/img/IMG_2384.PNG", alt: "KUINA flash" },
  { src: "/img/IMG_2385.PNG", alt: "KUINA" },
  { src: "/img/Castillo3.PNG", alt: "KUINA castillo" },
];

const TOUR: TourItem[] = [
  { day: "17", month: "MAYO",  city: "Santiago",     href: null,    out: true  },
  { day: "05", month: "JUNIO", city: "Talca",         href: "https://www.ecopass.cl/events/kuina---por-siempre-tour---talca---viernes-05-junio/17974" },
  { day: "06", month: "JUNIO", city: "Koncepción",    href: "https://primeticket.cl/details/por-siempre-tour-en-concepcion" },
  { day: "12", month: "JUNIO", city: "Temuko",        href: "https://www.passline.com/eventos/temuko-por-siempre-tour-kuina" },
  { day: "13", month: "JUNIO", city: "Valdivia",      href: "https://portaldisc.com/evento/kuina-tour-2026-valdivia" },
  { day: "14", month: "JUNIO", city: "Puerto Montt",  href: "https://www.passline.com/eventos/puerto-montt-por-siempre-tour-kuina" },
  { day: "26", month: "JUNIO", city: "La Serena",     href: "https://www.passline.com/eventos/la-serena-por-siempre-tour-kuina" },
  { day: "28", month: "JUNIO", city: "Valparaíso",    href: "https://www.passline.com/eventos/valparaiso-por-siempre-tour-kuina" },
];

/* per-image scatter layout — rotate + vertical stagger */
const GALLERY_META = [
  { rotate: -1.8, mt: 0,  aspect: "3/4"  },
  { rotate:  2.2, mt: 36, aspect: "4/5"  },
  { rotate: -0.9, mt: 8,  aspect: "3/4"  },
  { rotate:  1.5, mt: 52, aspect: "4/5"  },
  { rotate: -2.4, mt: 18, aspect: "3/4"  },
  { rotate:  0.8, mt: 28, aspect: "4/5"  },
  { rotate: -1.4, mt: 44, aspect: "1/1"  },
  { rotate:  2.9, mt: 14, aspect: "4/5"  },
];

const CASTLE_LOADER =
  "M 40 170 L 40 100 L 58 100 L 58 75 L 68 75 L 68 100 L 85 100 L 85 65 L 92 65 L 92 55 L 100 48 L 108 55 L 108 65 L 115 65 L 115 100 L 132 100 L 132 75 L 142 75 L 142 100 L 160 100 L 160 170 Z M 52 125 L 60 125 L 60 138 L 52 138 Z M 78 122 L 88 122 L 88 138 L 78 138 Z M 95 92 L 105 92 L 105 108 L 95 108 Z M 112 122 L 122 122 L 122 138 L 112 138 Z M 140 125 L 148 125 L 148 138 L 140 138 Z M 92 145 L 108 145 L 108 170 L 92 170 Z";

const CASTLE_HERO =
  "M 50 280 L 50 180 L 80 180 L 80 130 L 95 130 L 95 180 L 130 180 L 130 110 L 145 110 L 145 95 L 160 95 L 160 80 L 175 95 L 175 110 L 195 110 L 195 60 L 205 60 L 205 50 L 215 50 L 215 60 L 225 60 L 225 110 L 245 110 L 245 80 L 260 95 L 260 110 L 275 110 L 275 95 L 290 95 L 290 130 L 320 130 L 320 180 L 350 180 L 350 280 Z M 75 220 L 90 220 L 90 245 L 75 245 Z M 145 215 L 165 215 L 165 250 L 145 250 Z M 195 150 L 215 150 L 215 195 L 195 195 Z M 245 215 L 265 215 L 265 250 L 245 250 Z M 310 220 L 325 220 L 325 245 L 310 245 Z M 175 250 L 225 250 L 225 280 L 175 280 Z";

/* ─── Rabbit SVG ─────────────────────────────────────────── */
function RabbitSvg({ blood = false }: { blood?: boolean }) {
  const s = blood ? "#9B0014" : "#4D6EF5";
  const f = blood ? "#00060E" : "#001230";
  const e = blood ? "#9B0014" : "#4D6EF5";
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="50" cy="70" rx="22" ry="18" fill={f} stroke={s} strokeWidth="0.5" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="15" ry="13" fill={f} stroke={s} strokeWidth="0.5" opacity="0.8" />
      <ellipse cx="42" cy="32" rx="4"  ry="14" fill={f} stroke={s} strokeWidth="0.5" opacity="0.8" />
      <ellipse cx="58" cy="32" rx="4"  ry="14" fill={f} stroke={s} strokeWidth="0.5" opacity="0.8" />
      <circle  cx="46" cy="48" r="1.5" fill={e} />
      <circle  cx="54" cy="48" r="1.5" fill={e} />
      <ellipse cx="74" cy="68" rx="6"  ry="5"  fill={f} stroke={s} strokeWidth="0.5" opacity="0.8" />
    </svg>
  );
}

/* ─── Reveal wrapper ─────────────────────────────────────── */
function Reveal({ children, className = "", style, delay = 0 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Custom cursor — desktop only, gated in JS ──────────── */
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const mousePos  = useRef({ x: 0, y: 0 });
  const trailPos  = useRef(Array.from({ length: 8 }, () => ({ x: 0, y: 0 })));
  const rafRef    = useRef<number>(0);
  const [big, setBig] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only run on pointer-capable (non-touch) desktops
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    setIsDesktop(mq.matches);
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top  = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMove);

    const onEnter = () => setBig(true);
    const onLeave = () => setBig(false);
    const targets = document.querySelectorAll("a, button");
    targets.forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });

    function animate() {
      let px = mousePos.current.x, py = mousePos.current.y;
      trailPos.current.forEach((t, i) => {
        t.x += (px - t.x) * 0.3;
        t.y += (py - t.y) * 0.3;
        const el = trailsRef.current[i];
        if (el) { el.style.left = t.x + "px"; el.style.top = t.y + "px"; }
        px = t.x; py = t.y;
      });
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      targets.forEach(el => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={cursorRef} aria-hidden
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-[width,height] duration-200"
        style={{ width: big ? 40 : 20, height: big ? 40 : 20 }}
      >
        <span className="absolute inset-0 flex items-center justify-center" style={{ color: "#4D6EF5", fontSize: 18, animation: "cursorPulse 2s ease-in-out infinite", textShadow: "0 0 8px #3355DD, 0 0 16px #0A2FA0" }}>✦</span>
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailsRef.current[i] = el; }}
          aria-hidden
          className="fixed w-1 h-1 bg-celeste rounded-full pointer-events-none z-[9998]"
          style={{ opacity: (1 - i / 8) * 0.4, boxShadow: "0 0 10px #3355DD", transform: `translate(-50%, -50%) scale(${1 - (i / 8) * 0.8})` }}
        />
      ))}
    </>
  );
}

/* ─── Particles — desktop only, reduced count ────────────── */
function Particles() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(window.matchMedia("(min-width: 768px)").matches);
  }, []);
  if (!show) return null;

  const items = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: (i * 13.7) % 100,
    duration: 15 + (i * 7.3) % 20,
    delay: (i * 3.11) % 20,
    size: 1 + (i * 0.04) % 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden>
      {items.map(p => (
        <div key={p.id} className="absolute rounded-full bg-frost opacity-0"
          style={{ left: p.left + "vw", width: p.size + "px", height: p.size + "px", boxShadow: "0 0 6px #4D6EF5", animation: `float ${p.duration}s linear ${p.delay}s infinite` }}
        />
      ))}
    </div>
  );
}

/* ─── useAmbientAudio ────────────────────────────────────── */
function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended,   setEnded]   = useState(false);
  const [volume,  setVolume]  = useState(0.28);

  useEffect(() => {
    const audio = new Audio("/audio/kontando-el-tiempo.mp3");
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;
    audio.addEventListener("ended", () => { setPlaying(false); setEnded(true); });
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const fade = useCallback((target: number, duration = 800, onDone?: () => void) => {
    if (!audioRef.current) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const start = audioRef.current.volume;
    const t0 = Date.now();
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const p = Math.min((Date.now() - t0) / duration, 1);
      audioRef.current.volume = start + (target - start) * p;
      if (p >= 1) { clearInterval(fadeRef.current!); fadeRef.current = null; onDone?.(); }
    }, 30);
  }, []);

  const play = useCallback((vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => { setPlaying(true); setEnded(false); fade(vol); }).catch(() => {});
  }, [fade]);

  const pause = useCallback(() => {
    fade(0, 600, () => { audioRef.current?.pause(); setPlaying(false); });
  }, [fade]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current && playing) audioRef.current.volume = v;
  }, [playing]);

  useEffect(() => {
    const handle = () => {
      if (!audioRef.current) return;
      if (document.hidden && playing)  audioRef.current.pause();
      if (!document.hidden && playing) audioRef.current.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [playing]);

  return { playing, ended, volume, play: () => play(volume), pause, changeVolume };
}

/* ─── AudioToggle ────────────────────────────────────────── */
function AudioToggle() {
  const { playing, ended, volume, play, pause, changeVolume } = useAmbientAudio();
  const [showVol, setShowVol] = useState(false);
  const label = ended ? "reproducir" : playing ? "kontando..." : "reproducir";

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {showVol && (
          <motion.div key="slider" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 64 }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => changeVolume(parseFloat(e.target.value))} className="volume-slider w-16" aria-label="Volumen" />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => { if (playing) { pause(); setShowVol(false); } else { play(); setShowVol(true); } }}
        className="flex items-center gap-1.5 border border-white/30 font-mono text-[0.6rem] tracking-[0.18em] px-3 py-1.5 transition-all duration-300 hover:border-celeste hover:bg-celeste/10 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
        aria-label={playing ? "Pausar audio" : "Reproducir audio"}
      >
        <span className="flex items-center gap-[2px] h-3" aria-hidden>
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="block w-[2px] bg-celeste rounded-[1px]" style={{ height: 3, animation: playing ? `wave 0.9s ease-in-out ${i * 0.15}s infinite` : undefined }} />
          ))}
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
}

/* ─── Corner Rabbit ──────────────────────────────────────── */
function CornerRabbit() {
  const [clicks, setClicks] = useState(0);
  const [spin, setSpin] = useState(false);
  const [red, setRed]   = useState(false);

  const handleClick = () => {
    const n = clicks + 1; setClicks(n);
    if (n >= 3) { setSpin(true); setTimeout(() => { setSpin(false); setClicks(0); }, 1500); }
  };

  return (
    <button
      onClick={handleClick} onMouseEnter={() => setRed(true)} onMouseLeave={() => setRed(false)}
      className="fixed bottom-4 right-4 z-[60] opacity-40 hover:opacity-100 transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
      style={{ width: 80, height: 80 }} aria-label="Easter egg" title="hi."
    >
      <motion.div animate={spin ? { rotate: 360, scale: 1.3 } : { rotate: 0, scale: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ width: "100%", height: "100%" }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {/* body */}
          <ellipse cx="50" cy="70" rx="24" ry="18" fill="#000B1E" stroke={red ? "#9B0014" : "#4D6EF5"} strokeWidth="0.6" />
          {/* head */}
          <ellipse cx="50" cy="50" rx="17" ry="14" fill="#000B1E" stroke={red ? "#9B0014" : "#4D6EF5"} strokeWidth="0.6" />
          {/* ears */}
          <ellipse cx="40" cy="28" rx="5" ry="18" fill="#000B1E" stroke={red ? "#9B0014" : "#4D6EF5"} strokeWidth="0.6" />
          <ellipse cx="60" cy="28" rx="5" ry="18" fill="#000B1E" stroke={red ? "#9B0014" : "#4D6EF5"} strokeWidth="0.6" />
          {/* inner ears */}
          <ellipse cx="40" cy="28" rx="2" ry="12" fill={red ? "#9B0014" : "#0A2FA0"} opacity="0.7" />
          <ellipse cx="60" cy="28" rx="2" ry="12" fill={red ? "#9B0014" : "#0A2FA0"} opacity="0.7" />
          {/* eyes */}
          <circle cx="44" cy="50" r="2.2" fill={red ? "#9B0014" : "#4D6EF5"} style={{ transition: "fill 0.3s" }} />
          <circle cx="56" cy="50" r="2.2" fill={red ? "#9B0014" : "#4D6EF5"} style={{ transition: "fill 0.3s" }} />
          <circle cx="44.7" cy="49.3" r="0.6" fill="#00060E" />
          <circle cx="56.7" cy="49.3" r="0.6" fill="#00060E" />
          {/* nose */}
          <ellipse cx="50" cy="57" rx="1.2" ry="0.8" fill={red ? "#9B0014" : "#4D6EF5"} opacity="0.8" />
          {/* pentagram inscribed in torso — tierno y siniestro */}
          <path d="M50,62 L54,74 L43,67 L57,67 L46,74 Z"
            fill="none"
            stroke={red ? "#9B0014" : "#3355DD"}
            strokeWidth="0.5"
            opacity={red ? 0.95 : 0.55}
            style={{ transition: "stroke 0.3s, opacity 0.3s" }}
          />
        </svg>
      </motion.div>
    </button>
  );
}

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-10 backdrop-blur-md"
      style={{ background: "rgba(0,8,20,0.96)" }} onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-w-[90vw] max-h-[85vh] object-contain" style={{ boxShadow: "0 30px 100px rgba(10,47,160,0.4)" }} />
      </motion.div>
      <button onClick={onClose} className="absolute top-4 right-4 border border-celeste text-white w-11 h-11 font-mono text-base transition-all duration-300 hover:bg-celeste hover:text-void focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste" aria-label="Cerrar imagen">✕</button>
    </motion.div>
  );
}

/* ─── Seraphim wings — lo etéreo-celestial ──────────────── */
function SeraphimWings({ opacity = 0.07, size = 400 }: { opacity?: number; size?: number }) {
  return (
    <svg viewBox="0 0 400 300" width={size} height={size * 0.75} aria-hidden style={{ opacity }}>
      {/* 3 pares de alas — izquierda */}
      <path d="M200,150 C170,100 110,90 60,60 C100,95 155,100 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.6" />
      <path d="M200,150 C165,125 100,120 40,110 C85,120 150,125 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.5" />
      <path d="M200,150 C175,140 130,142 80,145 C120,143 162,142 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
      <path d="M200,150 C170,165 120,180 65,200 C110,178 158,165 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.5" />
      <path d="M200,150 C172,172 128,195 75,225 C115,192 162,170 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
      <path d="M200,150 C178,185 148,215 110,245 C142,210 175,182 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.3" />
      {/* 3 pares de alas — derecha (espejo) */}
      <path d="M200,150 C230,100 290,90 340,60 C300,95 245,100 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.6" />
      <path d="M200,150 C235,125 300,120 360,110 C315,120 250,125 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.5" />
      <path d="M200,150 C225,140 270,142 320,145 C280,143 238,142 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
      <path d="M200,150 C230,165 280,180 335,200 C290,178 242,165 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.5" />
      <path d="M200,150 C228,172 272,195 325,225 C285,192 238,170 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
      <path d="M200,150 C222,185 252,215 290,245 C258,210 225,182 200,150" fill="none" stroke="#4D6EF5" strokeWidth="0.3" />
      {/* centro — cabeza del serafín */}
      <circle cx="200" cy="148" r="6" fill="none" stroke="#4D6EF5" strokeWidth="0.5" />
      <circle cx="200" cy="148" r="2" fill="#4D6EF5" opacity="0.4" />
    </svg>
  );
}

/* ─── Ghost Rabbit — el guardián que asoma en penumbra ───── */
function GhostRabbit({ opacity = 0.045, size = 380 }: { opacity?: number; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden
      width={size} height={size} style={{ opacity, filter: "blur(0.4px)" }}>
      <ellipse cx="50" cy="72" rx="28" ry="20" fill="none" stroke="#4D6EF5" strokeWidth="0.35" />
      <ellipse cx="50" cy="50" rx="20" ry="17" fill="none" stroke="#4D6EF5" strokeWidth="0.35" />
      <ellipse cx="40" cy="26" rx="6" ry="22" fill="none" stroke="#4D6EF5" strokeWidth="0.35" />
      <ellipse cx="60" cy="26" rx="6" ry="22" fill="none" stroke="#4D6EF5" strokeWidth="0.35" />
      <ellipse cx="40" cy="26" rx="2.5" ry="15" fill="#0A2FA0" opacity="0.3" />
      <ellipse cx="60" cy="26" rx="2.5" ry="15" fill="#0A2FA0" opacity="0.3" />
      <circle cx="43" cy="49" r="2" fill="#4D6EF5" opacity="0.6" />
      <circle cx="57" cy="49" r="2" fill="#4D6EF5" opacity="0.6" />
      <ellipse cx="50" cy="57" rx="1.5" ry="1" fill="#4D6EF5" opacity="0.4" />
      {/* pentagrama — la versión satánica */}
      <path d="M50,62 L54,75 L43,67 L57,67 L46,75 Z" fill="none" stroke="#3355DD" strokeWidth="0.4" opacity="0.5" />
      {/* tiara */}
      <path d="M38,35 L40,30 L44,34 L48,28 L50,33 L52,28 L56,34 L60,30 L62,35" fill="none" stroke="#8B7020" strokeWidth="0.4" opacity="0.6" />
    </svg>
  );
}

/* ─── Star sparkles — scattered hand-drawn glints ───────── */
function StarField() {
  const stars = [
    { top: "11%", left: "6%",   size: 18, dur: 2.4, delay: 0    },
    { top: "27%", left: "90%",  size: 9,  dur: 3.3, delay: 0.8  },
    { top: "58%", left: "3%",   size: 12, dur: 2.9, delay: 1.5  },
    { top: "36%", left: "87%",  size: 7,  dur: 4.2, delay: 0.3  },
    { top: "78%", left: "19%",  size: 14, dur: 2.1, delay: 2.1  },
    { top: "7%",  left: "51%",  size: 6,  dur: 3.8, delay: 0.9  },
    { top: "84%", left: "77%",  size: 10, dur: 2.7, delay: 1.4  },
    { top: "46%", left: "12%",  size: 5,  dur: 3.5, delay: 1.9  },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", top: s.top, left: s.left,
          fontSize: s.size, color: "#4D6EF5", userSelect: "none",
          textShadow: `0 0 ${s.size}px #3355DD, 0 0 ${s.size * 2}px rgba(77,110,245,0.3)`,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }}>✦</span>
      ))}
    </div>
  );
}

/* ─── Shared section label ───────────────────────────────── */
function SectionLabel({ children, center = false }: { children: string; center?: boolean }) {
  return (
    <div className={`font-mono text-celeste flex items-center gap-4 ${center ? "justify-center" : ""}`} style={{ fontSize: "0.7rem", letterSpacing: "0.5em" }}>
      <span className="block shrink-0" style={{ width: 40, height: 1, background: "#4D6EF5" }} />
      {children}
      {center && <span className="block shrink-0" style={{ width: 40, height: 1, background: "#4D6EF5" }} />}
    </div>
  );
}

/* ═══════════════ MAIN PAGE ══════════════════════════════════ */
export default function KuinaPage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [lightbox,   setLightbox]   = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaderDone(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Cursor />
      <Particles />
      <CornerRabbit />

      {/* Floating rabbits — desktop only, CSS hidden on mobile */}
      <div aria-hidden className="fixed pointer-events-none z-[50] opacity-0 bottom-20 hidden md:block" style={{ width: 60, height: 60, left: -80, animation: "hopAcross 18s linear 3s infinite" }}>
        <RabbitSvg />
      </div>
      <div aria-hidden className="fixed pointer-events-none z-[50] opacity-0 hidden md:block" style={{ width: 40, height: 40, top: "30%", right: -60, animation: "hopBackwards 25s linear 8s infinite" }}>
        <RabbitSvg blood />
      </div>

      {/* Atmospheric BG */}
      <div aria-hidden className="fixed inset-0 z-[-2]" style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(10,47,160,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,18,60,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(0,12,36,0.4) 0%, #00060E 80%)" }} />
      <div aria-hidden className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ── Loader ── */}
      <AnimatePresence>
        {!loaderDone && (
          <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="fixed inset-0 bg-void z-[10000] flex flex-col items-center justify-center" aria-label="Cargando" role="status">
            <svg viewBox="0 0 200 200" className="w-36 h-36 mb-8" preserveAspectRatio="xMidYMid meet" aria-hidden>
              <g transform="translate(0,10)">
                <path d={CASTLE_LOADER} fill="none" stroke="#4D6EF5" strokeWidth="1.2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: "drawCastle 2.5s ease forwards", filter: "drop-shadow(0 0 8px #3355DD)" }} />
              </g>
            </svg>
            <p className="font-display text-4xl text-white opacity-0" style={{ letterSpacing: "0.4em", paddingLeft: "0.4em", animation: "fadeInName 1s ease 1.8s forwards", textShadow: "0 0 20px #0A2FA0" }}>
              KUINA
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center mix-blend-difference px-5 py-4 md:px-12 md:py-6">
        <span className="font-display text-white text-lg md:text-[1.3rem] tracking-[0.3em]">KUINA</span>
        <ul className="hidden md:flex gap-9 list-none m-0 p-0">
          {[["#about","kuina"],["#music","música"],["#tour","tour"],["#gallery","archivo"],["#contact","contacto"]].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="font-mono text-white no-underline relative group focus-visible:outline-none" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-celeste transition-[width] duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <AudioToggle />
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen px-6">
        {/* estadio a oscuras — siluetas de escenario apenas visibles */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <Image src="/img/IMG_2403.PNG" alt="" fill priority sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.06, filter: "brightness(0.35) contrast(2.2) saturate(0)" }}
          />
        </div>
        {/* bruma que respira */}
        <div aria-hidden className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse at 50% 65%, rgba(10,47,160,0.28) 0%, transparent 60%)", animation: "brumaBreathe 7s ease-in-out infinite" }}
        />
        {/* gradiente de profundidad */}
        <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{ background: "linear-gradient(180deg, #00060E 0%, rgba(0,6,14,0.4) 40%, rgba(0,6,14,0.5) 70%, #00060E 100%)" }} />
        {/* brillos estelares */}
        <StarField />
        {/* serafines — lo etéreo-celestial como marca de agua */}
        <div aria-hidden className="absolute pointer-events-none z-0" style={{ top: "5%", left: "-8%", transform: "rotate(-15deg)" }}>
          <SeraphimWings opacity={0.055} size={500} />
        </div>
        <div aria-hidden className="absolute pointer-events-none z-0" style={{ bottom: "8%", right: "-10%", transform: "rotate(12deg) scaleX(-1)" }}>
          <SeraphimWings opacity={0.04} size={380} />
        </div>
        {/* el guardián — konejo como protagonista del mundo */}
        <div aria-hidden className="absolute pointer-events-none z-0" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <GhostRabbit opacity={0.04} size={420} />
        </div>
        {/* castillo SVG */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.1 }}>
          <svg viewBox="0 0 400 300" className="w-[90%] max-w-[900px]" style={{ filter: "drop-shadow(0 0 30px #0A2FA0)" }}>
            <path d={CASTLE_HERO} fill="none" stroke="#4D6EF5" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="font-mono mb-6 opacity-0" style={{ fontSize: "0.65rem", letterSpacing: "0.45em", color: "#8B7020", animation: "heroFadeIn 1.2s ease 0.3s forwards" }}>
            POR SIEMPRE TOUR · MMXXVI
          </p>
          <h1 className="font-display leading-none text-white opacity-0" style={{ fontSize: "clamp(4.5rem, 18vw, 14rem)", letterSpacing: "0.05em", textShadow: "0 0 40px #0A2FA0, 0 0 80px #003566", animation: "heroFadeIn 1.5s ease 0.6s forwards" }}>
            <span className="relative inline-block">
              KUINA
              <span aria-hidden className="absolute inset-0 text-electric" style={{ animation: "glitch-1 4s infinite", zIndex: -1 }}>KUINA</span>
              <span aria-hidden className="absolute inset-0 text-blood"   style={{ animation: "glitch-2 4s infinite", zIndex: -1 }}>KUINA</span>
            </span>
          </h1>
          {/* voz caligráfica — el contrapunto frágil al grito */}
          <p className="font-script opacity-0 mt-4" style={{ fontSize: "clamp(1.4rem, 4.5vw, 2.8rem)", color: "#EDE5CE", letterSpacing: "0.02em", animation: "heroFadeIn 1.5s ease 1.2s forwards" }}>
            por siempre
          </p>
          {/* sello siniestro — Pirata One, un solo momento */}
          <p className="font-seal opacity-0 mt-3" style={{ fontSize: "clamp(0.7rem, 1.5vw, 1rem)", color: "rgba(77,110,245,0.5)", letterSpacing: "0.15em", animation: "heroFadeIn 1s ease 1.8s forwards" }}>
            koneja · kastillo · medianoche
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 font-mono text-white/60" style={{ fontSize: "0.6rem", letterSpacing: "0.4em", animation: "heroFadeIn 1s ease 2s forwards" }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, transparent, #4D6EF5)", animation: "scrollPulse 2s ease-in-out infinite" }} />
          <span className="hidden sm:block">desliza · ↓ · descubre</span>
          <span className="sm:hidden">↓</span>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="relative px-5 py-20 md:px-12 md:py-[120px]" style={{ minHeight: "100vh" }}>
        <div aria-hidden className="absolute top-0 right-0 pointer-events-none overflow-hidden" style={{ opacity: 0.06 }}>
          <SeraphimWings size={320} opacity={1} />
        </div>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <Reveal>
            {/* fanzine frame — borde de papel, recorte, tilt */}
            <div className="grain" style={{
              position: "relative",
              padding: "5px 6px 14px 5px",
              background: "#00060E",
              boxShadow: "0 0 60px rgba(10,47,160,0.55), 0 40px 100px rgba(0,0,0,0.85), 3px 4px 0 rgba(77,110,245,0.12), -2px -3px 0 rgba(77,110,245,0.06)",
              transform: "rotate(-1.8deg)",
              clipPath: "polygon(0% 0.8%, 1.2% 0%, 98.5% 0.3%, 100% 0%, 99.6% 98.8%, 100% 100%, 1.5% 99.5%, 0% 100%)",
            }}>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <Image
                  src="/img/IMG_2397.PNG"
                  alt="KUINA"
                  width={1125}
                  height={1398}
                  sizes="(max-width: 768px) 90vw, 45vw"
                  style={{ width: "100%", height: "auto", display: "block", filter: "brightness(1.05) contrast(1.1) saturate(1.1)" }}
                />
                <div aria-hidden className="scanlines" />
                {/* duotone blue wash */}
                <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, rgba(10,47,160,0.18) 0%, transparent 50%, rgba(51,85,221,0.1) 100%)", mixBlendMode: "color" as const }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, transparent 50%, rgba(0,6,14,0.7) 100%)" }} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="md:pr-6">
            <SectionLabel>ACTO I</SectionLabel>
            <h2 className="font-display leading-none text-white mt-4 mb-8 md:mb-12" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", textShadow: "0 0 30px rgba(10,47,160,0.5)" }}>
              la <em className="font-serif italic font-light text-frost" style={{ textShadow: "none" }}>koneja</em><br />azul
            </h2>
            <p className="font-script text-frost mb-5" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1.5 }}>
              Vino del sur. Cambió su pelo por el color del cielo a medianoche.
            </p>
            <p className="font-serif font-light mb-5" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              Leonora Tonini Cáceres dejó Lautaro a los 18 con un sueño y un nombre artístico que aún no terminaba de pronunciar. Hoy, bajo la tiara que jamás se quita, construye un castillo donde guarda lo que la lastima y lo que la salva.
            </p>
            <p className="font-serif font-light" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              Su música se mueve entre el <span style={{ color: "#4D6EF5" }}>trap, el pop alternativo</span> y la balada herida.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: "1px solid rgba(77,110,245,0.15)" }}>
              {[["+200K","oyentes / mes"],["93K","seguidores IG"],["2025","álbum debut"]].map(([num, label]) => (
                <div key={label}>
                  <span className="font-display block leading-none text-electric" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>{num}</span>
                  <span className="font-mono block uppercase text-white/50 mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ MUSIC ═══ */}
      <section id="music" className="px-5 py-20 md:px-12 md:py-[120px]" style={{ minHeight: "100vh", background: "linear-gradient(180deg, transparent 0%, rgba(0,4,12,0.85) 50%, transparent 100%)" }}>
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-2"><SectionLabel>ACTO II</SectionLabel></Reveal>
          <Reveal className="mb-10 md:mb-16">
            <h2 className="font-display leading-none text-white mt-3" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", textShadow: "0 0 30px rgba(10,47,160,0.5)" }}>
              la <em className="font-serif italic font-light text-frost" style={{ textShadow: "none" }}>música</em>
            </h2>
          </Reveal>

          {/* Featured — kontando el tiempo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-24">
            <Reveal>
              <a href="https://open.spotify.com/track/2bPLhS4VFelCuHPSxVPR1Y?si=_SiIM81xRUqExMXVtKJHqw" target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste" style={{ aspectRatio: "1", boxShadow: "0 20px 60px rgba(10,47,160,0.3)" }}>
                <Image src="/img/kontando-el-tiempo.jpg" alt="kontando el tiempo" fill sizes="(max-width: 768px) 90vw, 50vw" style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.7s ease" }} className="group-hover:scale-[1.03]" />
                <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "linear-gradient(135deg, transparent 60%, rgba(10,47,160,0.2))" }} />
                <div aria-hidden className="scanlines" />
              </a>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="font-mono text-celeste mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.4em" }}>NUEVO SENCILLO · 2026</div>
              <h3 className="font-display leading-none text-white mb-3" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "0.02em" }}>kontando el tiempo</h3>
              <p className="font-mono mb-5 text-celeste/70 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}>KUINA ° Young Cister ° Ovyze</p>
              <p className="font-serif italic font-light text-white/70 mb-8" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.6, maxWidth: 480 }}>El tiempo pasa. Las cuentas también.</p>
              <a href="https://open.spotify.com/track/2bPLhS4VFelCuHPSxVPR1Y?si=_SiIM81xRUqExMXVtKJHqw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 font-mono uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", padding: "14px 28px", background: "#4D6EF5", color: "#00060E", border: "1px solid #4D6EF5" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#fff"; (e.currentTarget as HTMLElement).style.borderColor="#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#4D6EF5"; (e.currentTarget as HTMLElement).style.borderColor="#4D6EF5"; }}
              >ESCUCHAR <span aria-hidden>→</span></a>
            </Reveal>
          </div>

          {/* Discography grid — 2 cols mobile, 4 desktop */}
          <Reveal>
            <SectionLabel>DISCOGRAFÍA</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8">
              {DISCOGRAPHY.map((item) => (
                <motion.a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="group relative overflow-hidden block focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
                  style={{ aspectRatio: "1", cursor: "none" }}
                  whileHover={{ y: -4 }} transition={{ duration: 0.35, ease: [0.23,1,0.32,1] }}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }}
                >
                  <Image src={item.img} alt={item.alt} fill sizes="(max-width: 768px) 45vw, 25vw" style={{ objectFit: "cover", objectPosition: "center", filter: "brightness(0.88) contrast(1.15)" }} />
                  <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,8,20,0.95))" }} />
                  {/* selection-box corners — lenguaje Solo Estoy Jugando */}
                  <div aria-hidden className="absolute inset-0 pointer-events-none z-[3] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span className="absolute top-2 left-2 block w-5 h-5 border-t border-l border-celeste" />
                    <span className="absolute top-2 right-2 block w-5 h-5 border-t border-r border-celeste" />
                    <span className="absolute bottom-2 left-2 block w-5 h-5 border-b border-l border-celeste" />
                    <span className="absolute bottom-2 right-2 block w-5 h-5 border-b border-r border-celeste" />
                  </div>
                  <div className="absolute z-[2] bottom-3 left-3 right-3">
                    <div className="font-mono text-celeste uppercase" style={{ fontSize: "0.5rem", letterSpacing: "0.25em", marginBottom: 3 }}>{item.type} · {item.year}</div>
                    <div className="font-display text-white leading-tight" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>{item.title}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TOUR ═══ */}
      <section id="tour" className="relative px-5 py-20 md:px-12 md:py-[120px]" style={{ minHeight: "100vh" }}>
        <div aria-hidden className="absolute inset-0 z-[-1]" style={{ backgroundImage: "url('/img/silhouette.jpeg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.04 }} />
        <div aria-hidden className="absolute hidden lg:block" style={{ right: -100, top: "50%", transform: "translateY(-50%)", width: 400, height: 400, opacity: 0.06, filter: "drop-shadow(0 0 40px #0A2FA0)" }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="70" rx="24" ry="18" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
            <ellipse cx="50" cy="50" rx="17" ry="14" fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
            <ellipse cx="40" cy="28" rx="5" ry="18"  fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
            <ellipse cx="60" cy="28" rx="5" ry="18"  fill="none" stroke="#4D6EF5" strokeWidth="0.4" />
            <circle cx="44" cy="50" r="2" fill="#4D6EF5" /><circle cx="56" cy="50" r="2" fill="#4D6EF5" />
          </svg>
        </div>

        <Reveal className="text-center mb-12 md:mb-20">
          <SectionLabel center>ACTO III</SectionLabel>
          <h2 className="font-display leading-none text-white mt-4 mb-5" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", textShadow: "0 0 30px rgba(10,47,160,0.4)" }}>
            por <em className="font-serif italic font-light text-frost" style={{ textShadow: "none" }}>siempre</em> tour
          </h2>
          <p className="font-serif italic font-light text-frost mx-auto" style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)", maxWidth: 560 }}>
            Ocho fechas. Chile entero. Un castillo que se desarma y se vuelve a armar en cada escenario.
          </p>
        </Reveal>

        <div className="max-w-[900px] mx-auto flex flex-col gap-[2px]">
          {TOUR.map(({ day, month, city, href, out }, i) => (
            <Reveal key={city} delay={i * 0.06}>
              <motion.a
                href={out ? undefined : href ?? undefined}
                target={out ? undefined : "_blank"}
                rel={out ? undefined : "noopener noreferrer"}
                className="relative overflow-hidden text-white no-underline w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
                style={{
                  display: "grid", gridTemplateColumns: "64px 1fr auto", gap: "16px", alignItems: "center",
                  padding: "20px 16px",
                  background: out ? "rgba(20,0,0,0.5)" : "rgba(0,4,12,0.7)",
                  border: `1px solid ${out ? "rgba(155,0,20,0.25)" : "rgba(77,110,245,0.08)"}`,
                  cursor: out ? "default" : "pointer",
                  opacity: out ? 0.6 : 1,
                }}
                whileHover={out ? {} : { x: 4, backgroundColor: "rgba(10,47,160,0.12)", borderColor: "rgba(77,110,245,0.8)" }}
                transition={{ duration: 0.25, ease: [0.23,1,0.32,1] }}
              >
                {!out && <motion.span aria-hidden className="absolute left-0 top-0 bottom-0 bg-celeste origin-top" style={{ width: 2 }} initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.25 }} />}
                <div>
                  <div className="font-display leading-none" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: out ? "#9B0014" : "#3355DD" }}>{day}</div>
                  <div className="font-mono uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", marginTop: 3, color: out ? "rgba(155,0,20,0.7)" : "#EDE5CE" }}>{month}</div>
                </div>
                <div>
                  <div className="font-display uppercase" style={{ fontSize: "clamp(1.1rem, 3.5vw, 2rem)", letterSpacing: "0.08em", textDecoration: out ? "line-through" : "none", textDecorationColor: "#9B0014" }}>{city}</div>
                </div>
                <div className="font-mono uppercase shrink-0 text-center" style={{
                  fontSize: "0.5rem", letterSpacing: "0.2em", padding: "6px 10px",
                  color: out ? "#9B0014" : "#4D6EF5",
                  border: `1px solid ${out ? "rgba(155,0,20,0.4)" : "rgba(77,110,245,0.5)"}`,
                }}>
                  {out ? "PASADO" : "ENTRADAS"}
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section id="gallery" className="px-5 py-20 md:px-12 md:py-[120px]" style={{ minHeight: "100vh" }}>
        <div className="max-w-[1400px] mx-auto">
          <Reveal><SectionLabel>ACTO IV</SectionLabel></Reveal>
          <Reveal>
            <h2 className="font-display leading-none text-white mt-3 mb-8 md:mb-12" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", textShadow: "0 0 30px rgba(10,47,160,0.5)" }}>
              archivo <em className="font-serif italic font-light text-frost" style={{ textShadow: "none" }}>azul</em>
            </h2>
          </Reveal>

          {/* Scattered — 2 cols mobile, 4 cols desktop, staggered tops + rotations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 items-start">
            {GALLERY.map((item, i) => {
              const m = GALLERY_META[i];
              return (
                <motion.button
                  key={item.src}
                  onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                  className="grain group focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
                  style={{
                    position: "relative", overflow: "hidden", display: "block", border: "none",
                    cursor: "none", background: "#00060E",
                    aspectRatio: m.aspect,
                    marginTop: i >= 2 ? m.mt : 0, // stagger only from row 2 on mobile
                    transform: `rotate(${m.rotate}deg)`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(77,110,245,0.08)",
                    transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease",
                  }}
                  whileHover={{ rotate: 0, scale: 1.03, boxShadow: "0 20px 60px rgba(10,47,160,0.35), 0 0 0 1px rgba(77,110,245,0.3)" }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.23,1,0.32,1] }}
                  aria-label={`Ver ${item.alt}`}
                >
                  <Image
                    src={item.src} alt={item.alt} fill loading="eager"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.88) contrast(1.18) saturate(0.9)" }}
                  />
                  <div aria-hidden className="scanlines" style={{ opacity: 0.5 }} />
                  <div aria-hidden className="absolute inset-0 pointer-events-none z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,8,20,0.6))" }} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="px-5 py-20 md:px-12 md:py-[120px] text-center" style={{ minHeight: "100vh", background: "linear-gradient(180deg, transparent, rgba(0,4,12,0.9))" }}>
        <Reveal>
          <SectionLabel center>ACTO V</SectionLabel>
          <h2 className="font-display leading-none text-white mt-4 mb-4" style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)", letterSpacing: "0.05em" }}>
            sígueme <em className="font-serif italic font-light text-frost">al castillo</em>
          </h2>
          <p className="font-serif italic font-light text-frost mb-12" style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)" }}>
            no contesto, pero leo todo.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-[900px] mx-auto">
            {[
              { platform: "INSTAGRAM", handle: "@bunnyambitionboi",  href: "https://www.instagram.com/bunnyambitionboi/" },
              { platform: "SPOTIFY",   handle: "KUINA",              href: "https://open.spotify.com/intl-es/artist/2fjInVWSawW5FUnXd3QLqbSu" },
              { platform: "TIKTOK",    handle: "@bunnyambitionboii", href: "https://www.tiktok.com/@bunnyambitionboii" },
              { platform: "YOUTUBE",   handle: "@KUINAKONEJO",       href: "https://www.youtube.com/@KUINAKONEJO" },
            ].map(({ platform, handle, href }) => (
              <motion.a key={platform} href={href} target="_blank" rel="noopener noreferrer"
                className="relative overflow-hidden no-underline text-white block focus-visible:outline focus-visible:outline-2 focus-visible:outline-celeste"
                style={{ padding: "24px 16px", border: "1px solid rgba(77,110,245,0.2)", background: "rgba(0,16,39,0.4)" }}
                whileHover={{ y: -3, borderColor: "rgba(77,110,245,1)", backgroundColor: "rgba(10,47,160,0.1)" }}
                transition={{ duration: 0.25, ease: [0.23,1,0.32,1] }}
              >
                <motion.span aria-hidden className="absolute bottom-0 left-0 w-full" style={{ height: 2, background: "linear-gradient(90deg, transparent, #4D6EF5, transparent)" }} initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.55, ease: "easeInOut" }} />
                <div className="font-mono text-celeste uppercase mb-2.5" style={{ fontSize: "0.6rem", letterSpacing: "0.35em" }}>{platform}</div>
                <div className="font-display" style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.03em" }}>{handle}</div>
              </motion.a>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14 pt-10" style={{ borderTop: "1px solid rgba(77,110,245,0.15)" }}>
          <p className="font-mono uppercase text-white/50" style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}>
            BOOKING & PRENSA · <a href="mailto:booking@kuina.cl" className="text-celeste no-underline" style={{ borderBottom: "1px solid #4D6EF5" }}>booking@kuina.cl</a>
          </p>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="text-center px-5 py-10" style={{ borderTop: "1px solid rgba(77,110,245,0.1)" }}>
        <div className="font-display text-white" style={{ fontSize: "1.4rem", letterSpacing: "0.4em" }}>KUINA</div>
        <div className="font-serif italic text-frost mt-1">por siempre</div>
        <p className="font-mono uppercase text-white/30 mt-5" style={{ fontSize: "0.5rem", letterSpacing: "0.3em" }}>
          © MMXXVI · TODOS LOS DERECHOS RESERVADOS · SITIO POR <a href="https://www.showup.lat" className="text-celeste no-underline">SHOWUP</a>
        </p>
      </footer>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
}
