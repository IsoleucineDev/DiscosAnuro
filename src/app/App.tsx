import { useState, useRef, useCallback, useId } from "react";
import html2canvas from "html2canvas";
import {
  Check, ArrowRight, Music2, Sparkles, Upload,
  RotateCcw, Download, LayoutGrid, Type, Palette, X,
  CheckCircle2, Loader2
} from "lucide-react";

/* ══════════════════════════════════════════════
   PALETTE
══════════════════════════════════════════════ */
const P = {
  paper:    "#F6F0E6",
  ivory:    "#FCF8F2",
  sand:     "#E8DCC8",
  sandMid:  "#D4C9B5",
  coffee:   "#43382F",
  coffeeMid:"#6B5D52",
  soft:     "#222222",
  muted:    "#8A7E74",
  terra:    "#B5654A",
  sage:     "#7B9E87",
  teal:     "#3D7B7B",
  mustard:  "#C4A843",
  rose:     "#C4937A",
};

/* ══════════════════════════════════════════════
   THEMES
══════════════════════════════════════════════ */
const THEMES = {
  // ── Claros ──
  paper:   { bg: P.paper,   card: P.ivory,   fg: P.soft,    accent: P.terra,   label: "Papel"   },
  ivory:   { bg: P.ivory,   card: "#EDE8DF", fg: P.soft,    accent: P.teal,    label: "Marfil"  },
  sage:    { bg: "#E8EDE8", card: "#F0F4F0", fg: "#1E2D2A", accent: "#3D7B7B", label: "Salvia"  },
  arena:   { bg: P.sand,    card: "#DDD1BB", fg: P.coffee,  accent: P.mustard, label: "Arena"   },
  // ── Oscuros ──
  coffee:  { bg: P.coffee,  card: "#352C24", fg: "#F0EBE1", accent: P.mustard, label: "Café"    },
  noche:   { bg: "#1A1F2E", card: "#222840", fg: "#E8E4D8", accent: P.mustard, label: "Noche"   },
  carbon:  { bg: "#252220", card: "#2E2A27", fg: "#F0EBE1", accent: P.rose,    label: "Carbón"  },
  tinta:   { bg: "#1E2D2A", card: "#243530", fg: "#EDF0EB", accent: "#A8C8A0", label: "Tinta"   },
};

/* ══════════════════════════════════════════════
   PAPER GRAIN OVERLAY
══════════════════════════════════════════════ */
function PaperGrain({ opacity = 0.18 }: { opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`grain-${id}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="8" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   WATERCOLOR BLOB
══════════════════════════════════════════════ */
function WcBlob({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        borderRadius: "62% 38% 46% 54% / 60% 44% 56% 40%",
        background: color,
        filter: "blur(22px)",
        opacity: 0.28,
        ...style,
      }}
    />
  );
}

/* ══════════════════════════════════════════════
   WASHI TAPE STRIP
══════════════════════════════════════════════ */
function WashiTape({ color, width = 60, rotate = -2, style }: { color: string; width?: number; rotate?: number; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width,
        height: 14,
        background: color,
        opacity: 0.72,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <PaperGrain opacity={0.35} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   HAND-DRAWN ARROW (SVG path)
══════════════════════════════════════════════ */
function HandArrow({ color = P.coffee, style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", ...style }}>
      <path d="M2 14 C10 12, 28 10, 50 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 7 C47 10, 50 13, 44 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   SCRIBBLE UNDERLINE
══════════════════════════════════════════════ */
function Underline({ color = P.terra, width = 120 }: { color?: string; width?: number }) {
  return (
    <svg viewBox={`0 0 ${width} 8`} fill="none" style={{ display: "block", width, height: 8 }}>
      <path d={`M2 5 C${width * 0.15} 2, ${width * 0.35} 7, ${width * 0.55} 4 C${width * 0.7} 2, ${width * 0.85} 6, ${width - 2} 4`} stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   STAMP / SEAL
══════════════════════════════════════════════ */
function Stamp({ text, color = P.coffee }: { text: string; color?: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      border: `2px solid ${color}`,
      borderRadius: "50%", width: 52, height: 52, transform: "rotate(-8deg)",
      opacity: 0.7,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.12em", color, textAlign: "center", lineHeight: 1.3, padding: 2 }}>{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   POLAROID FRAME
══════════════════════════════════════════════ */
function Polaroid({ src, alt, rotate = -2, tape = true, tapeColor = P.mustard }: { src: string | null; alt: string; rotate?: number; tape?: boolean; tapeColor?: string }) {
  return (
    <div style={{
      position: "relative", display: "inline-block",
      transform: `rotate(${rotate}deg)`,
      filter: "drop-shadow(0 6px 16px rgba(67,56,47,0.20))",
    }}>
      <div style={{ background: P.ivory, padding: "8px 8px 28px 8px", boxShadow: "inset 0 0 0 1px rgba(67,56,47,0.08)" }}>
        <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: P.sand }}>
          {src
            ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${P.sandMid} 0%, ${P.coffeeMid} 100%)` }} />
          }
        </div>
      </div>
      {tape && (
        <WashiTape color={tapeColor} width={48} rotate={-1} style={{ top: -6, left: "50%", transform: `translateX(-50%) rotate(-1deg)` }} />
      )}
    </div>
  );
}


/* ══════════════════════════════════════════════
   POST DATA TYPE
══════════════════════════════════════════════ */
interface PostData {
  photo: string | null;   // fondo / imagen principal
  photo2: string | null;  // imagen central (portada: arte del álbum)
  title: string;
  subtitle: string;
  body: string;
  label: string;
  author: string;
  stat: string;
  statLabel: string;
  theme: keyof typeof THEMES;
  templateId: string;
  fontPair: FontPairKey;
}

const DEFAULT_POST: PostData = {
  photo: null,
  photo2: null,
  title: "Lo grabaron en 3 semanas. Nadie sabía que cambiaría todo.",
  subtitle: "Definitely Maybe",
  body: "No había plan. Solo cuatro tipos con guitarras baratas, una grabadora y demasiada cafeína. Así nació uno de los debuts más importantes del rock.",
  label: "DISCOSAURIO",
  author: "Discosaurio",
  stat: "73%",
  statLabel: "de los oyentes lo escuchan completo de una sola vez",
  theme: "paper",
  templateId: "cover",
  fontPair: "fraunces",
};

/* ══════════════════════════════════════════════
   TEMPLATE: PORTADA — estilo Far Out / editorial
   photo  = imagen de fondo (atmosférica, oscura)
   photo2 = arte central (portada del álbum / imagen destacada)
══════════════════════════════════════════════ */
function TplCover({ d }: { d: PostData }) {
  const fp = FONT_PAIRS[d.fontPair ?? "fraunces"];
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "#111010", position: "relative" }}>

      {/* ── FONDO: foto atmosférica ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {d.photo
          ? <img src={d.photo} alt="fondo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, #2A2420 0%, #1A1310 100%)` }} />
        }
        {/* Oscurecer fondo para que resalte la imagen central */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,8,0.55)" }} />
      </div>

      {/* ── SECCIÓN SUPERIOR: badge + imagen central ── */}
      <div style={{ position: "relative", zIndex: 1, flex: "0 0 62%", display: "flex", flexDirection: "column", padding: "14px 16px 0" }}>

        {/* Badge marca + subtítulo estilo Far Out */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ background: "#F5F0E8", padding: "3px 8px" }}>
            <span style={{ fontFamily: fp.display, fontSize: 11, fontWeight: 900, color: "#111010", letterSpacing: "-0.01em" }}>
              {d.author || "sound"}
            </span>
          </div>
          {d.subtitle && (
            <span style={{ fontFamily: fp.display, fontSize: 13, fontStyle: "italic", fontWeight: 300, color: "#F5F0E8", opacity: 0.9 }}>
              {d.subtitle}
            </span>
          )}
        </div>

        {/* Imagen central con marco blanco — el arte del álbum */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 14 }}>
          <div style={{
            width: "88%", aspectRatio: "1/1",
            background: "#2A2420",
            padding: 6,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          }}>
            {d.photo2
              ? <img src={d.photo2} alt="arte" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${P.coffeeMid} 0%, #1A1310 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>ÁLBUM</span></div>
            }
          </div>
        </div>
      </div>

      {/* ── PANEL INFERIOR: título + párrafo + marca ── */}
      <div style={{
        position: "relative", zIndex: 1,
        flex: 1,
        background: "#F5F0E8",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px 12px",
        textAlign: "center",
      }}>
        <div>
          {/* Título bold grande — igual que Far Out */}
          <h2 style={{
            fontFamily: fp.display, fontSize: 21, fontWeight: 900,
            lineHeight: 1.1, color: "#111010", margin: "0 0 9px", letterSpacing: "-0.01em",
          }}>
            {d.title}
          </h2>

          {/* Párrafo italic — misma fuente, misma escala */}
          {d.body && (
            <p style={{
              fontFamily: fp.display, fontSize: 10.5, fontWeight: 300,
              fontStyle: "italic", lineHeight: 1.7,
              color: "#111010", opacity: 0.78, margin: 0,
            }}>
              {d.body}
            </p>
          )}
        </div>

        {/* Marca al fondo — estilo "FAR OUT" */}
        {d.label && (
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em",
            color: "#111010", opacity: 0.40, paddingTop: 6,
          }}>
            {d.label}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: ARTÍCULO EDITORIAL
══════════════════════════════════════════════ */
function TplEditorial({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      <PaperGrain />
      {/* Photo area with washi tape mounting */}
      <div className="relative flex-shrink-0" style={{ height: "50%", zIndex: 1 }}>
        <WashiTape color={t.accent} width={60} rotate={-1} style={{ top: 8, left: "30%", zIndex: 3 }} />
        <WashiTape color={t.accent} width={48} rotate={2} style={{ top: 8, right: "20%", zIndex: 3 }} />
        <div className="w-full h-full overflow-hidden" style={{ padding: "20px 20px 8px", background: "transparent" }}>
          <div className="w-full h-full overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(67,56,47,0.18)" }}>
            {d.photo
              ? <img src={d.photo} alt="editorial" className="w-full h-full object-cover" />
              : <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${P.sand} 0%, ${P.sandMid} 100%)` }} />
            }
          </div>
        </div>
        {d.label && (
          <div className="absolute bottom-2 left-5" style={{ background: t.accent, padding: "2px 8px", fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.15em", color: "#FCF8F2" }}>
            {d.label}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="relative flex-1 px-5 pt-3 pb-1 flex flex-col justify-between" style={{ zIndex: 1 }}>
        <WcBlob color={t.accent} style={{ width: 100, height: 80, bottom: -20, right: -20 }} />
        <div>
          <h2 className="leading-tight mb-2" style={{ fontFamily: fp.display, fontSize: 21, fontWeight: 700, color: t.fg }}>
            {d.title}
          </h2>
          {d.body && (
            <p style={{ fontFamily: fp.body, fontSize: 11, lineHeight: 1.6, color: t.fg, opacity: 0.65, fontStyle: "italic" }}>
              {d.body}
            </p>
          )}
          {d.author && (
            <div className="mt-2 flex items-center gap-2">
              <HandArrow color={t.accent} style={{ width: 40, height: 18 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.fg, opacity: 0.5 }}>By {d.author}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: QUOTE
══════════════════════════════════════════════ */
function TplQuote({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      <PaperGrain />
      <WcBlob color={t.accent} style={{ width: 200, height: 180, top: -60, left: -60 }} />
      <WcBlob color={t.accent} style={{ width: 150, height: 130, bottom: -40, right: -40 }} />

      <div className="relative flex-1 flex flex-col justify-center px-8 py-10" style={{ zIndex: 1 }}>
        {/* Giant open-quote watercolor mark */}
        <div className="absolute top-8 left-5" style={{ fontFamily: fp.display, fontSize: 120, fontWeight: 700, fontStyle: "italic", lineHeight: 1, color: t.accent, opacity: 0.12, userSelect: "none" }}>"</div>

        {d.label && (
          <div className="mb-4" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: t.accent }}>
            {d.label}
          </div>
        )}

        <blockquote className="relative" style={{ fontFamily: fp.display, fontSize: 20, fontStyle: "italic", fontWeight: 700, lineHeight: 1.45, color: t.fg }}>
          "{d.title}"
        </blockquote>

        <div className="mt-4 mb-4">
          <Underline color={t.accent} width={80} />
        </div>

        {d.body && (
          <p className="mb-4" style={{ fontFamily: fp.body, fontSize: 12, lineHeight: 1.6, color: t.fg, opacity: 0.60 }}>
            {d.body}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: t.accent, opacity: 0.85 }}>
            <Music2 size={12} color="#FCF8F2" />
          </div>
          <div>
            <div style={{ fontFamily: fp.body, fontSize: 12, fontWeight: 700, color: t.fg }}>{d.author || "Anónimo"}</div>
            {d.subtitle && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: t.fg, opacity: 0.45 }}>{d.subtitle}</div>}
          </div>
        </div>

        {/* Washi tape decoration */}
        <WashiTape color={t.accent} width={36} rotate={-45} style={{ bottom: 20, right: 20 }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: CONSEJO / TIP
══════════════════════════════════════════════ */
function TplTip({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.card }}>
      <PaperGrain />
      {/* Accent corner */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 80, height: 80, background: t.accent, opacity: 0.12, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
      <WcBlob color={t.accent} style={{ width: 160, height: 140, top: -40, right: -40 }} />

      <div className="relative flex-1 flex flex-col justify-between px-6 py-7" style={{ zIndex: 1 }}>
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div style={{ width: 28, height: 28, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: "#FCF8F2" }}>01</span>
            </div>
            {d.label && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: t.accent }}>{d.label}</span>}
          </div>

          {/* Big decorative number */}
          <div style={{ fontFamily: fp.display, fontSize: 80, fontWeight: 900, lineHeight: 0.9, color: t.fg, opacity: 0.07, userSelect: "none", marginBottom: -10 }}>01</div>

          <h2 className="leading-tight mb-3" style={{ fontFamily: fp.display, fontSize: 24, fontWeight: 700, color: t.fg }}>
            {d.title}
          </h2>
          <Underline color={t.accent} width={90} />

          {d.body && (
            <p className="mt-3 leading-relaxed" style={{ fontFamily: fp.body, fontSize: 13, color: t.fg, opacity: 0.65 }}>
              {d.body}
            </p>
          )}
        </div>

        {d.subtitle && (
          <div className="flex flex-wrap gap-2 mt-4">
            {d.subtitle.split(",").map((tag, i) => (
              <span key={i} style={{ border: `1px solid ${t.accent}50`, borderRadius: 2, padding: "2px 8px", fontFamily: "'DM Mono', monospace", fontSize: 8, color: t.accent }}>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: ESTADÍSTICA
══════════════════════════════════════════════ */
function TplStats({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      <PaperGrain />
      {/* Large watercolor wash behind the stat */}
      <WcBlob color={t.accent} style={{ width: 240, height: 220, top: "50%", left: "50%", transform: "translate(-50%,-55%)" }} />

      <div className="relative flex-1 flex flex-col justify-center items-center text-center px-8" style={{ zIndex: 1 }}>
        {d.label && (
          <div className="mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: t.accent }}>
            {d.label}
          </div>
        )}

        {/* Stat number */}
        <div style={{ fontFamily: fp.display, fontSize: 88, fontWeight: 900, lineHeight: 0.9, color: t.fg }}>
          {d.stat || "73%"}
        </div>

        <div className="my-4 flex items-center justify-center gap-3">
          <div style={{ height: 1, width: 32, background: t.accent, opacity: 0.4 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.accent, opacity: 0.6 }} />
          <div style={{ height: 1, width: 32, background: t.accent, opacity: 0.4 }} />
        </div>

        <p className="mb-2" style={{ fontFamily: fp.display, fontSize: 19, fontWeight: 700, fontStyle: "italic", lineHeight: 1.4, color: t.fg }}>
          {d.title}
        </p>

        {d.statLabel && (
          <p style={{ fontFamily: fp.body, fontSize: 11, color: t.fg, opacity: 0.50 }}>{d.statLabel}</p>
        )}

        {/* Decorative washi */}
        <WashiTape color={t.accent} width={40} rotate={-6} style={{ bottom: 40, right: 24 }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: CHECKLIST
══════════════════════════════════════════════ */
function TplChecklist({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  const items = d.body.split("\n").filter(Boolean);
  const list = items.length > 0 ? items : ["Define la paleta de colores", "Elige las tipografías", "Crea componentes base", "Diseña 12 templates"];
  const doneCount = Math.ceil(list.length / 2);
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.card }}>
      <PaperGrain />
      <WcBlob color={t.accent} style={{ width: 150, height: 130, top: -20, right: -30 }} />

      {/* Washi tape header strip */}
      <div className="flex-shrink-0 px-5 pt-6 pb-3 relative" style={{ zIndex: 1 }}>
        <WashiTape color={t.accent} width="100%" rotate={0} style={{ top: 0, left: 0, width: "100%", height: 8, borderRadius: 0 } as React.CSSProperties} />
        {d.label && <div className="mt-4" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: t.accent }}>{d.label}</div>}
        <h2 className="mt-1 leading-tight" style={{ fontFamily: fp.display, fontSize: 20, fontWeight: 700, color: t.fg }}>{d.title}</h2>
        <div className="mt-1"><Underline color={t.accent} width={80} /></div>
      </div>

      <div className="flex-1 px-5 py-2 space-y-3 overflow-hidden relative" style={{ zIndex: 1 }}>
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-shrink-0" style={{ width: 18, height: 18, border: `1.5px solid ${i < doneCount ? t.accent : t.fg + "30"}`, background: i < doneCount ? t.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < doneCount && <Check size={9} color="#FCF8F2" strokeWidth={3} />}
            </div>
            <span style={{ fontFamily: fp.body, fontSize: 12, color: t.fg, opacity: i < doneCount ? 0.35 : 0.85, textDecoration: i < doneCount ? "line-through" : undefined }}>
              {item}
            </span>
          </div>
        ))}
        {/* Progress */}
        <div className="pt-3">
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: t.fg, opacity: 0.4 }}>Progreso</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: t.accent }}>{doneCount}/{list.length}</span>
          </div>
          <div style={{ height: 3, background: `${t.fg}15`, borderRadius: 2 }}>
            <div style={{ height: 3, background: t.accent, borderRadius: 2, width: `${(doneCount / list.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: CTA
══════════════════════════════════════════════ */
function TplCTA({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      <PaperGrain />
      {/* Large accent brushstroke block */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", background: t.accent, opacity: 0.92, clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)" }}>
        <PaperGrain opacity={0.22} />
      </div>

      {/* Washi tape crossing */}
      <WashiTape color={t.accent} width={80} rotate={-12} style={{ top: "38%", right: 20, zIndex: 2 }} />

      <div className="relative flex-1 flex flex-col justify-between px-6 py-8" style={{ zIndex: 2 }}>
        <div>
          {d.label && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: "#FCF8F2", opacity: 0.8 }}>{d.label}</div>}
          <h2 className="mt-2 leading-tight" style={{ fontFamily: fp.display, fontSize: 30, fontWeight: 900, lineHeight: 1.1, color: "#FCF8F2" }}>
            {d.title}
          </h2>
        </div>

        <div>
          {d.body && (
            <p className="mb-6 leading-relaxed" style={{ fontFamily: fp.body, fontSize: 13, color: t.fg, opacity: 0.72 }}>
              {d.body}
            </p>
          )}

          <div className="flex items-center gap-2" style={{ background: t.fg, padding: "10px 16px", display: "inline-flex", alignSelf: "flex-start" }}>
            <span style={{ fontFamily: fp.body, fontSize: 12, fontWeight: 700, color: t.bg }}>
              {d.subtitle || "Ver más"}
            </span>
            <ArrowRight size={13} color={t.bg} />
          </div>

          {d.author && (
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle2 size={11} color={t.accent} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.fg, opacity: 0.50 }}>{d.author}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE: FOTO + TÍTULO (Paste-style split)
══════════════════════════════════════════════ */
function TplPhotoTitle({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      {/* Photo with ragged bottom edge feel */}
      <div className="relative flex-shrink-0" style={{ height: "54%" }}>
        {d.photo
          ? <img src={d.photo} alt="hero" className="w-full h-full object-cover" />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, #2A2420 0%, #1A1310 100%)` }} />
        }
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 60%, ${t.bg}80)` }} />
        {/* Washi tape on photo */}
        <WashiTape color={t.accent} width={56} rotate={-3} style={{ bottom: -6, left: "20%", zIndex: 2 }} />
        <WashiTape color={t.accent} width={44} rotate={4} style={{ bottom: -6, right: "25%", zIndex: 2 }} />
      </div>

      {/* Color-blocked lower section (Paste-style) */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden" style={{ background: t.accent }}>
          <PaperGrain opacity={0.2} />
          <h2 className="leading-tight relative" style={{ fontFamily: fp.display, fontSize: 22, fontWeight: 900, color: "#FCF8F2" }}>
            {d.title}
          </h2>
          {d.subtitle && (
            <p className="mt-1 relative" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#FCF8F2", opacity: 0.65 }}>
              {d.subtitle}
            </p>
          )}
        </div>
        {d.body && (
          <div className="flex-1 p-4 flex flex-col justify-center" style={{ background: t.card, borderLeft: `3px solid ${t.bg}` }}>
            <PaperGrain opacity={0.15} />
            <p className="relative" style={{ fontFamily: fp.display, fontSize: 12, fontStyle: "italic", lineHeight: 1.5, color: t.fg }}>
              {d.body}
            </p>
            {d.author && <div className="mt-2 relative" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: t.fg, opacity: 0.45 }}>By {d.author}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TIMELINE
══════════════════════════════════════════════ */
function TplTimeline({ d }: { d: PostData }) {
  const t = THEMES[d.theme];
  const items = d.body.split("\n").filter(Boolean);
  const steps = items.length > 0 ? items : ["Escucha activa y referencia", "Práctica obsesiva sin audiencia", "El momento clave que llegó solo"];
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: t.bg }}>
      <PaperGrain />
      <WcBlob color={t.accent} style={{ width: 140, height: 120, top: -20, right: -20 }} />
      <div className="relative flex-1 flex flex-col px-5 py-6" style={{ zIndex: 1 }}>
        {d.label && <div className="mb-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: t.accent }}>{d.label}</div>}
        <h2 className="leading-tight mb-4" style={{ fontFamily: fp.display, fontSize: 21, fontWeight: 700, color: t.fg }}>{d.title}</h2>
        <Underline color={t.accent} width={70} />
        <div className="mt-5 space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0" style={{ width: 26, height: 26, background: i === 0 ? t.accent : "transparent", border: `2px solid ${t.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 9, color: i === 0 ? "#FCF8F2" : t.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i < steps.length - 1 && <div style={{ width: 1, flex: 1, background: `${t.accent}30`, marginTop: 4 }} />}
              </div>
              <div className="pb-3">
                <p style={{ fontFamily: fp.body, fontSize: 12, lineHeight: 1.6, color: t.fg, opacity: 0.75 }}>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE REGISTRY
══════════════════════════════════════════════ */
const TEMPLATE_LIST = [
  { id: "cover",      label: "Portada",      tag: "Cover",   fields: ["photo","photo2","title","subtitle","body","label","author"] },
  { id: "editorial",  label: "Artículo",     tag: "Article", fields: ["photo","title","body","label","author"] },
  { id: "quote",      label: "Cita",         tag: "Quote",   fields: ["title","body","subtitle","author","label"] },
  { id: "tip",        label: "Consejo",      tag: "Tip",     fields: ["title","body","subtitle","label"] },
  { id: "stats",      label: "Estadística",  tag: "Stats",   fields: ["stat","statLabel","title","label"] },
  { id: "checklist",  label: "Checklist",    tag: "List",    fields: ["title","body","label"] },
  { id: "cta",        label: "CTA",          tag: "CTA",     fields: ["title","body","subtitle","label","author"] },
  { id: "phototitle", label: "Foto + Título",tag: "Photo",   fields: ["photo","title","subtitle","body","author"] },
  { id: "timeline",   label: "Timeline",     tag: "Story",   fields: ["title","body","label"] },
];

function renderTemplate(d: PostData) {
  switch (d.templateId) {
    case "cover":      return <TplCover d={d} />;
    case "editorial":  return <TplEditorial d={d} />;
    case "quote":      return <TplQuote d={d} />;
    case "tip":        return <TplTip d={d} />;
    case "stats":      return <TplStats d={d} />;
    case "checklist":  return <TplChecklist d={d} />;
    case "cta":        return <TplCTA d={d} />;
    case "phototitle": return <TplPhotoTitle d={d} />;
    case "timeline":   return <TplTimeline d={d} />;
    default:           return <TplCover d={d} />;
  }
}

/* ══════════════════════════════════════════════
   PHOTO UPLOADER
══════════════════════════════════════════════ */
function PhotoUploader({ value, onChange }: { value: string | null; onChange: (u: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    onChange(URL.createObjectURL(file));
  }, [onChange]);

  return (
    <div>
      <label style={{ display: "block", marginBottom: 6, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: P.coffeeMid }}>FOTO</label>
      {value ? (
        <div style={{ position: "relative", height: 96, overflow: "hidden", borderRadius: 2 }}>
          <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button onClick={() => onChange(null)} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, background: P.terra, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={10} color="#FCF8F2" />
          </button>
          <button onClick={() => ref.current?.click()} style={{ position: "absolute", bottom: 6, right: 6, padding: "3px 8px", background: "rgba(67,56,47,0.7)", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#F6F0E6", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 4 }}>
            <RotateCcw size={8} /> CAMBIAR
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          style={{
            height: 96, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            border: `2px dashed ${dragging ? P.terra : "rgba(67,56,47,0.20)"}`,
            background: dragging ? "rgba(181,101,74,0.06)" : "rgba(67,56,47,0.02)",
            cursor: "pointer", borderRadius: 2,
          }}
        >
          <Upload size={18} color={dragging ? P.terra : "rgba(67,56,47,0.30)"} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "rgba(67,56,47,0.40)" }}>SUBIR FOTO · DRAG & DROP</span>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   FIELD
══════════════════════════════════════════════ */
function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  const shared = {
    value, placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    style: {
      width: "100%", padding: "8px 10px",
      background: "rgba(67,56,47,0.04)", border: `1px solid rgba(67,56,47,0.12)`,
      borderRadius: 2, outline: "none",
      color: P.soft, fontFamily: "'Lato', sans-serif", fontSize: 13,
      resize: "none" as const,
    },
  };
  return (
    <div>
      <label style={{ display: "block", marginBottom: 6, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: P.coffeeMid }}>{label}</label>
      {multiline ? <textarea {...shared} rows={3} /> : <input {...shared} type="text" />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   GENERATOR PANEL (stateless — state lifted up)
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   IG POST PREVIEW
   Display: 300×375px (4:5). Export: html2canvas scale=3.6 → 1080×1350px
══════════════════════════════════════════════ */
const DISPLAY_W = 300;
const DISPLAY_H = 375;
const EXPORT_SCALE = 1080 / DISPLAY_W; // 3.6

function IgPostPreview({ post, previewRef }: { post: PostData; previewRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={previewRef}
      style={{
        width: DISPLAY_W,
        height: DISPLAY_H,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 4,
        boxShadow: "0 6px 48px rgba(67,56,47,0.24), 0 1px 0 rgba(67,56,47,0.06)",
      }}
    >
      {renderTemplate(post)}
    </div>
  );
}

function GeneratorPanel({ post, setPost }: { post: PostData; setPost: (p: PostData) => void }) {
  const set = (key: keyof PostData, val: string | null) => setPost({ ...post, [key]: val });
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: EXPORT_SCALE, // 300×375 × 3.6 = 1080×1350px
        backgroundColor: null,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      const slug = post.title.slice(0, 30).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      a.download = `${post.templateId}-${slug || "post"}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  }, [post.title, post.templateId]);
  const tpl = TEMPLATE_LIST.find(t => t.id === post.templateId) || TEMPLATE_LIST[0];
  const has = (f: string) => tpl.fields.includes(f);

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", display: "flex", flexDirection: "row" }} className="flex-col lg:flex-row">
      {/* ── Controls ── */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: "100%", maxWidth: 340, borderRight: `1px solid rgba(67,56,47,0.10)`, background: P.ivory }}
      >
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Heading */}
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: P.terra }}>GENERADOR DE POSTS</div>
            <p style={{ marginTop: 4, fontFamily: "'Lato', sans-serif", fontSize: 12, color: P.coffeeMid, lineHeight: 1.5 }}>
              Sube tu foto, escribe el texto y previsualiza en tiempo real.
            </p>
          </div>

          {/* Template type */}
          <div>
            <div style={{ marginBottom: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: P.coffeeMid }}>TIPO DE POST</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {TEMPLATE_LIST.map(t => (
                <button key={t.id} onClick={() => set("templateId", t.id)}
                  style={{
                    padding: "8px 10px", textAlign: "left", cursor: "pointer", borderRadius: 2,
                    background: post.templateId === t.id ? P.coffee : "rgba(67,56,47,0.04)",
                    border: `1px solid ${post.templateId === t.id ? P.coffee : "rgba(67,56,47,0.10)"}`,
                  }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.12em", color: post.templateId === t.id ? P.sand : P.muted, marginBottom: 2 }}>{t.tag}</div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color: post.templateId === t.id ? P.paper : P.soft }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <div style={{ marginBottom: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: P.coffeeMid }}>TEMA DE COLOR</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {(Object.entries(THEMES) as [keyof typeof THEMES, (typeof THEMES)["paper"]][]).map(([key, val]) => (
                <button key={key} onClick={() => set("theme", key)}
                  style={{
                    padding: "8px 4px", cursor: "pointer", position: "relative", borderRadius: 2,
                    background: val.bg,
                    border: `2px solid ${post.theme === key ? P.terra : "rgba(67,56,47,0.12)"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: val.accent }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.06em", color: val.fg, opacity: 0.7 }}>
                    {val.label}
                  </span>
                  {post.theme === key && (
                    <div style={{ position: "absolute", top: 3, right: 3, width: 8, height: 8, borderRadius: "50%", background: P.terra }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font pair selector */}
          <div>
            <div style={{ marginBottom: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: P.coffeeMid }}>TIPOGRAFÍA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(Object.entries(FONT_PAIRS) as [FontPairKey, typeof FONT_PAIRS[FontPairKey]][]).map(([key, fp]) => (
                <button key={key} onClick={() => set("fontPair", key)}
                  style={{
                    padding: "8px 12px", textAlign: "left", cursor: "pointer", borderRadius: 2,
                    background: post.fontPair === key ? P.coffee : "rgba(67,56,47,0.04)",
                    border: `1px solid ${post.fontPair === key ? P.coffee : "rgba(67,56,47,0.10)"}`,
                    display: "flex", alignItems: "baseline", gap: 8,
                  }}>
                  <span style={{ fontFamily: fp.display, fontSize: 15, fontWeight: 700, color: post.fontPair === key ? P.paper : P.soft, lineHeight: 1 }}>{fp.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: post.fontPair === key ? P.sand : P.muted, letterSpacing: "0.06em" }}>{fp.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Foto de fondo */}
          {has("photo") && (
            <div>
              {has("photo2") && (
                <div style={{ marginBottom: 4, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.15em", color: P.terra }}>
                  FOTO DE FONDO
                </div>
              )}
              <PhotoUploader value={post.photo} onChange={url => set("photo", url)} />
            </div>
          )}

          {/* Foto central (solo portada) */}
          {has("photo2") && (
            <div>
              <div style={{ marginBottom: 4, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.15em", color: P.terra }}>
                IMAGEN CENTRAL (PORTADA / ÁLBUM)
              </div>
              <PhotoUploader value={post.photo2} onChange={url => set("photo2", url)} />
            </div>
          )}

          {/* Text fields */}
          {has("title") && <Field label="TÍTULO" value={post.title} onChange={v => set("title", v)} placeholder="El álbum que lo cambió todo" />}
          {has("subtitle") && (
            <Field
              label={tpl.id === "tip" ? "TAGS (separar con comas)" : "SUBTÍTULO"}
              value={post.subtitle} onChange={v => set("subtitle", v)}
              placeholder={tpl.id === "tip" ? "#música, #diseño" : "Descripción breve"}
            />
          )}
          {has("body") && (
            <Field
              label={tpl.id === "checklist" || tpl.id === "timeline" ? "ITEMS (una línea por ítem)" : "TEXTO PRINCIPAL"}
              value={post.body} onChange={v => set("body", v)} multiline
              placeholder={tpl.id === "checklist" || tpl.id === "timeline" ? "Línea uno\nLínea dos\nLínea tres" : "Escribe el texto del post..."}
            />
          )}
          {has("stat") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="DATO / NÚMERO" value={post.stat} onChange={v => set("stat", v)} placeholder="73%" />
              <Field label="CONTEXTO" value={post.statLabel} onChange={v => set("statLabel", v)} placeholder="más engagement" />
            </div>
          )}
          {has("label") && <Field label="ETIQUETA / BADGE" value={post.label} onChange={v => set("label", v)} placeholder="ÁLBUM ESENCIAL" />}
          {has("author") && <Field label="AUTOR / MARCA" value={post.author} onChange={v => set("author", v)} placeholder="Sound + Vision" />}

          {/* Reset */}
          <button
            onClick={() => setPost({ ...DEFAULT_POST, templateId: post.templateId, theme: post.theme })}
            style={{
              width: "100%", padding: "10px", cursor: "pointer", border: `1px solid rgba(67,56,47,0.15)`,
              background: "transparent", borderRadius: 2,
              fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.12em", color: P.muted,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <RotateCcw size={10} /> RESETEAR CAMPOS
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: P.sand, gap: 20 }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.terra }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: P.coffeeMid }}>
            PREVIEW EN VIVO · 1080 × 1350 · INSTAGRAM
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.terra }} />
        </div>

        {/* Post card — 1080×1350 DOM, scaled down for display */}
        <IgPostPreview post={post} previewRef={previewRef} />

        {/* Attribution bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: P.ivory, borderRadius: 2, border: `1px solid rgba(67,56,47,0.10)` }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: P.coffee, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Music2 size={11} color={P.paper} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: P.soft }}>{post.author || "Discosaurio"}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.muted }}>·</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.muted, letterSpacing: "0.06em" }}>
            {TEMPLATE_LIST.find(t => t.id === post.templateId)?.label}
          </span>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={exporting}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 28px", cursor: exporting ? "wait" : "pointer",
            background: exporting ? P.sandMid : P.coffee,
            border: "none", borderRadius: 2,
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em",
            color: exporting ? P.muted : P.paper,
            transition: "background 0.15s",
          }}
        >
          {exporting
            ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />EXPORTANDO...</>
            : <><Download size={13} />DESCARGAR PNG</>
          }
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GALLERY TAB
══════════════════════════════════════════════ */
const DEMO_POSTS: PostData[] = [
  { ...DEFAULT_POST, templateId: "cover",      theme: "paper"  },
  { ...DEFAULT_POST, templateId: "editorial",  theme: "noche",  photo: null, title: "Pet Sounds Project", body: "For a Moment, I Thought I Killed Brian Wilson", author: "Alana Markel", label: "PASTE MAGAZINE" },
  { ...DEFAULT_POST, templateId: "quote",      theme: "sage",   title: "La música no te pregunta si estás listo. Simplemente llega.", author: "Liam Gallagher", subtitle: "Oasis, 1994", label: "— CITA" },
  { ...DEFAULT_POST, templateId: "tip",        theme: "arena",  title: "Estudia tus referencias antes de publicar", body: "Analiza los mejores posts de tu nicho. Observa el ritmo y la jerarquía visual.", label: "CONSEJO #03", subtitle: "#contenido, #estrategia, #diseño" },
  { ...DEFAULT_POST, templateId: "stats",      theme: "tinta",  stat: "73%", title: "de usuarios decide seguir por la calidad visual", statLabel: "Hootsuite Social Trends 2024", label: "ESTADÍSTICA" },
  { ...DEFAULT_POST, templateId: "checklist",  theme: "ivory",  title: "Pasos para lanzar tu Design System", body: "Definir paleta de colores\nElegir tipografías\nCrear componentes base\nDiseñar 12 templates\nExportar assets\nPublicar el primer post", label: "CHECKLIST" },
  { ...DEFAULT_POST, templateId: "cta",        theme: "carbon", title: "Descarga el kit gratuito", body: "Más de 40 templates listos para Figma.", subtitle: "Descargar gratis", label: "ÚNETE", author: "+2,400 diseñadores" },
  { ...DEFAULT_POST, templateId: "phototitle", theme: "coffee", photo: null, title: "Pet Sounds", subtitle: "The Beach Boys · 1966", body: "El álbum que redefinió la música pop para siempre.", author: "Sound + Vision" },
  { ...DEFAULT_POST, templateId: "timeline",   theme: "paper",  title: "La historia detrás del éxito", body: "Escucha activa constante\nPráctica obsesiva sin audiencia\nEl demo que llegó al productor correcto\nLanzamiento que cambió todo", label: "TIMELINE" },
];

function GalleryTab({ onSelect }: { onSelect: (p: PostData) => void }) {
  return (
    <div style={{ padding: "32px 24px", background: P.paper, minHeight: "calc(100vh - 52px)" }}>
      <PaperGrain opacity={0.12} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: P.terra }}>GALERÍA · {DEMO_POSTS.length} TEMPLATES</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: P.soft, marginTop: 4, marginBottom: 4 }}>Explorar templates</h2>
        <Underline color={P.terra} width={120} />
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: P.muted, marginTop: 10, marginBottom: 28, lineHeight: 1.6 }}>
          Haz click en cualquier template para editarlo con tu propia foto y texto.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {DEMO_POSTS.map((post, i) => (
            <div key={i} onClick={() => onSelect(post)} style={{ cursor: "pointer" }} className="group">
              <div className="relative overflow-hidden transition-transform group-hover:scale-[0.97]"
                style={{ width: "100%", aspectRatio: "4/5", borderRadius: 3, boxShadow: "0 4px 20px rgba(67,56,47,0.14)", overflow: "hidden" }}>
                {renderTemplate(post)}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(67,56,47,0.35)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: P.paper, padding: "8px 14px" }}>
                    <Sparkles size={11} color={P.terra} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.12em", color: P.terra }}>USAR TEMPLATE</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: P.coffeeMid }}>
                  {TEMPLATE_LIST.find(t => t.id === post.templateId)?.label}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: P.terra, background: `${P.terra}15`, padding: "2px 6px", borderRadius: 2 }}>
                  {TEMPLATE_LIST.find(t => t.id === post.templateId)?.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COLORS TAB
══════════════════════════════════════════════ */
function ColorsTab() {
  const swatches = [
    { name: "Beige Papel",  value: P.paper,    role: "Fondo principal" },
    { name: "Marfil",       value: P.ivory,    role: "Superficies card" },
    { name: "Arena",        value: P.sand,     role: "Fondo secundario" },
    { name: "Café Oscuro",  value: P.coffee,   role: "Texto y UI principal" },
    { name: "Negro Suave",  value: P.soft,     role: "Texto display" },
    { name: "Terracota",    value: P.terra,    role: "Acento principal" },
    { name: "Verde Salvia", value: P.sage,     role: "Acento natural" },
    { name: "Azul Petróleo",value: P.teal,     role: "Acento editorial" },
    { name: "Mostaza",      value: P.mustard,  role: "Acento cálido" },
    { name: "Rosa Empolvado", value: P.rose,   role: "Acento suave" },
  ];
  return (
    <div style={{ padding: "32px 24px", background: P.paper, minHeight: "calc(100vh - 52px)", position: "relative" }}>
      <PaperGrain opacity={0.14} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: P.terra }}>SISTEMA DE COLOR</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: P.soft, marginTop: 4, marginBottom: 4 }}>Paleta de papel</h2>
        <Underline color={P.terra} width={100} />
        <p style={{ fontFamily: "'Lato', sans-serif", fontStyle: "italic", fontSize: 13, color: P.muted, margin: "12px 0 32px" }}>
          Beige cálido, tierra, naturales — con acentos de terracota, salvia y petróleo.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {swatches.map(s => (
            <div key={s.name} className="group" style={{ cursor: "pointer" }}>
              <div className="group-hover:scale-95 transition-transform"
                style={{ width: "100%", aspectRatio: "1", background: s.value, borderRadius: 2, boxShadow: "0 2px 12px rgba(67,56,47,0.12)", border: "1px solid rgba(67,56,47,0.06)", position: "relative", overflow: "hidden" }}>
                <PaperGrain opacity={0.2} />
              </div>
              <div style={{ marginTop: 8, fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color: P.soft }}>{s.name}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.muted }}>{s.value}</div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: P.muted, marginTop: 2 }}>{s.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TYPOGRAPHY TAB
══════════════════════════════════════════════ */
function TypographyTab() {
  const scale = [
    { name: "Hero XL",  font: "'Fraunces', serif",  size: 64, weight: 900, sample: "Música.", italic: false },
    { name: "Hero",     font: "'Fraunces', serif",  size: 44, weight: 700, sample: "El álbum que lo cambió todo.", italic: false },
    { name: "Display",  font: "'Fraunces', serif",  size: 28, weight: 700, sample: "Dirección de arte editorial japonesa", italic: true },
    { name: "H2",       font: "'Lato', sans-serif", size: 20, weight: 700, sample: "Sección de contenido principal" },
    { name: "Body",     font: "'Lato', sans-serif", size: 14, weight: 400, sample: "Texto editorial con ritmo medido y líneas bien proporcionadas para lectura cómoda en formato mobile.", italic: true },
    { name: "Caption",  font: "'Lato', sans-serif", size: 11, weight: 300, sample: "Crédito de fotografía, nota al pie de página", muted: true },
    { name: "Label",    font: "'DM Mono', monospace",size: 9, weight: 500, sample: "ETIQUETA · ESTADÍSTICA · 73%", upper: true },
  ];
  return (
    <div style={{ padding: "32px 24px", background: P.paper, minHeight: "calc(100vh - 52px)", position: "relative" }}>
      <PaperGrain opacity={0.14} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: P.terra }}>TIPOGRAFÍA</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: P.soft, marginTop: 4, marginBottom: 4 }}>Type Scale</h2>
        <Underline color={P.terra} width={90} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, marginBottom: 32 }}>
          {["Fraunces", "Lato", "DM Mono"].map(f => (
            <span key={f} style={{ border: `1px solid rgba(67,56,47,0.20)`, padding: "3px 10px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: P.coffeeMid }}>
              {f}
            </span>
          ))}
        </div>
        <div>
          {scale.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 24, paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid rgba(67,56,47,0.08)` }}>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500, color: P.terra }}>{t.name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: P.muted, marginTop: 2 }}>{t.size}px · {t.weight}</div>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{
                  fontFamily: t.font, fontSize: Math.min(t.size, 48), fontWeight: t.weight, lineHeight: 1.15,
                  color: (t as {muted?: boolean}).muted ? P.muted : P.soft,
                  fontStyle: (t as {italic?: boolean}).italic ? "italic" : undefined,
                  textTransform: (t as {upper?: boolean}).upper ? "uppercase" : undefined,
                  letterSpacing: (t as {upper?: boolean}).upper ? "0.2em" : undefined,
                }}>
                  {t.sample}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
type Tab = "create" | "gallery" | "colors" | "typography";

export default function App() {
  const [tab, setTab] = useState<Tab>("create");
  const [post, setPost] = useState<PostData>({ ...DEFAULT_POST });

  const handleSelectFromGallery = (p: PostData) => {
    setPost({ ...p });
    setTab("create");
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "create",     label: "Crear",      icon: <Sparkles size={12} /> },
    { id: "gallery",    label: "Templates",  icon: <LayoutGrid size={12} /> },
    { id: "colors",     label: "Colores",    icon: <Palette size={12} /> },
    { id: "typography", label: "Tipografía", icon: <Type size={12} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: P.paper }}>
      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, height: 52,
        background: `${P.ivory}F2`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(67,56,47,0.10)`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: P.coffee, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2 }}>
            <Music2 size={13} color={P.paper} />
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: P.soft, lineHeight: 1 }}>
              Sound + Vision
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.15em", color: P.muted }}>
              INSTAGRAM DESIGN SYSTEM
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", cursor: "pointer",
                background: tab === item.id ? P.coffee : "transparent",
                border: `1px solid ${tab === item.id ? P.coffee : "transparent"}`,
                borderRadius: 2,
                fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.1em",
                color: tab === item.id ? P.paper : P.coffeeMid,
              }}>
              {item.icon}
              <span className="hidden sm:inline">{item.label.toUpperCase()}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* ── Content ── */}
      <main>
        {tab === "create" && <GeneratorPanel post={post} setPost={setPost} />}
        {tab === "gallery" && <GalleryTab onSelect={handleSelectFromGallery} />}
        {tab === "colors" && <ColorsTab />}
        {tab === "typography" && <TypographyTab />}
      </main>
    </div>
  );
}
