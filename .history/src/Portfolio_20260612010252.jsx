
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import photo from './photo.jpeg';
import emailjs from '@emailjs/browser';
// ── Google Fonts injected via style tag ──────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
  --bg:        #0D1117;
  --surface:   #161B22;
  --border:    #21262D;
  --accent:    #3B82F6;
  --accent2:   #2563EB;
  --text:      #F8FAFC;
  --muted:     #94A3B8;
  --font-disp: 'Bebas Neue', sans-serif;
  --font-mono: 'DM Mono', monospace;
  --font-ser:  'Instrument Serif', serif;
}

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      overflow-x: hidden;
    }

    ::selection { background: var(--accent); color: #000; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); }

    .noise {
      position: fixed; inset: 0; z-index: 999; pointer-events: none;
      opacity: .03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }

    section { padding: 120px 0; }
    section:last-of-type { padding-bottom: 40px; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

    .tag {
      font-family: var(--font-mono);
      font-size: 11px; letter-spacing: .18em;
      color: var(--muted); text-transform: uppercase;
    }

    .divider {
      width: 100%; height: 1px;
      background: var(--border); margin: 0;
    }

    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    .marquee-track {
      overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      padding: 18px 0;
    }
    .marquee-inner {
      display: flex; gap: 60px; white-space: nowrap;
      animation: marquee 22s linear infinite;
    }
    .marquee-item {
      font-family: var(--font-disp);
      font-size: 20px; letter-spacing: .08em; color: var(--muted);
    }
    .marquee-item span { color: var(--accent); margin-right: 60px; }

  

    @media(max-width:768px){
      .container{padding:0 20px;}
      section{padding:80px 0;}
    }
    
    @media(max-width:1024px){
  .container{ padding: 0 32px; }
}

@media(max-width:768px){
  .container{ padding: 0 20px; }
  section{ padding: 64px 0;
  .hamburger-btn{ display: flex !important; } }

  /* Hero */
  .hero-name{ font-size: clamp(36px,10vw,64px) !important; }
  .hero-content{ flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
  .hero-photo{ width: 100px !important; height: 100px !important; align-self: flex-start !important; }
  .hero-buttons{ flex-direction: column !important; gap: 12px !important; }
  .hero-buttons a{ text-align: center !important; }

  /* Work */
  .work-grid{ grid-template-columns: 1fr !important; }

  /* About */
  .about-grid{ grid-template-columns: 1fr !important; gap: 40px !important; }

  /* Stack */
  .stack-grid{ grid-template-columns: 1fr 1fr !important; }

  /* Contact */
  .contact-grid{ grid-template-columns: 1fr !important; gap: 48px !important; }

  /* Nav */
  .nav-links-desktop{ display: none !important; }
  .nav-mobile-open{ display: flex !important; }
}

@media(max-width:480px){
  .stack-grid{ grid-template-columns: 1fr !important; }
  .proj-links{ flex-direction: column !important; }
  .hero-buttons a{ padding: 12px 20px !important; font-size: 11px !important; }
}
  `}</style>
);


// ── Nav ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu on link click
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .7, ease: [.22, 1, .36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(13,17,23,.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "none",
          transition: "all .4s",
          padding: "18px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: "flex", gap: 48, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {["Work", "About", "Tech Stack", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
              onClick={handleLinkClick}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 14, letterSpacing: ".14em",
                color: "var(--muted)", textDecoration: "none", textTransform: "uppercase",
                transition: "color .2s",
              }}
              onMouseEnter={e => e.target.style.color = "var(--accent)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}
            >{l}</a>
          ))}
        </div>

        {/* Hamburger Button — mobile only */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "none",
            background: "transparent", border: "none",
            cursor: "pointer", padding: 4,
            flexDirection: "column", gap: 5,
          }}
          className="hamburger-btn">
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            style={{ display: "block", width: 24, height: 1.5, background: "var(--text)", transformOrigin: "center" }} />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
            style={{ display: "block", width: 24, height: 1.5, background: "var(--text)" }} />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            style={{ display: "block", width: 24, height: 1.5, background: "var(--text)", transformOrigin: "center" }} />
        </button>

      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: .3 }}
            style={{
              position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
              background:"rgba(13,17,23,.98)",
              borderBottom: "1px solid var(--border)",
              display: "flex", flexDirection: "column",
              padding: "24px 40px", gap: 24,
            }}>
            {["Work", "About", "Tech Stack", "Contact"].map(l => (
              <a key={l}
                href={`#${l.toLowerCase().replace(" ", "-")}`}
                onClick={handleLinkClick}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 14, letterSpacing: ".14em",
                  color: "var(--muted)", textDecoration: "none", textTransform: "uppercase",
                  transition: "color .2s", borderBottom: "1px solid var(--border)", paddingBottom: 16,
                }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}
              >{l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, .7], [1, 0]);

  const chars = "Pratibha Swami".split("");

  return (
    <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)", backgroundSize: "80px 80px", opacity: .4 }} />

      <motion.div className="container" style={{ y, opacity, position: "relative", zIndex: 2 }}>
        <motion.p className="tag" style={{ marginBottom: 28 }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3, duration: .7 }}>
          Full-Stack Developer
        </motion.p>

        <div className="hero-content" style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ overflow: "hidden" }}>
            <h1 style={{
              fontFamily: "var(--font-disp)", fontSize: "clamp(42px,7vw,100px)",
              lineHeight: .88, letterSpacing: ".02em",
              display: "flex", flexWrap: "wrap", gap: "0 6px",
            }}>
              {chars.map((c, i) => (
                <motion.span key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ delay: .5 + i * .04, duration: .7, ease: [.22, 1, .36, 1] }}
                  style={{ display: "inline-block", color: c === " " ? "transparent" : "var(--text)" }}>
                  {c === " " ? "\u00A0" : c}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: .8, ease: [.22, 1, .36, 1] }}
            style={{
              width: "clamp(120px,12vw,180px)",
              height: "clamp(120px,12vw,180px)",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}>
            <img src={photo} alt="Pratibha Swami"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: .8 }}
          style={{
            fontFamily: "var(--font-ser)", fontStyle: "italic",
            fontSize: "clamp(18px,2.5vw,28px)", color: "var(--muted)",
            maxWidth: 520, marginTop: 32, lineHeight: 1.6,
          }}>
          Building products people actually want to use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: .7 }}
          className="hero-buttons" style={{ display: "flex", gap: 16, marginTop: 52, alignItems: "center" }}>
          <a href="#work" style={{
            background:"var(--accent)", color:"#fff",
            fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: ".14em",
            padding: "14px 32px", textDecoration: "none", textTransform: "uppercase",
            transition: "transform .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            View Work →
          </a>
          <a href="#contact" style={{
            border: "1px solid var(--border)", color: "var(--muted)",
            fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: ".14em",
            padding: "14px 32px", textDecoration: "none", textTransform: "uppercase",
            transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)" }}>
            Get in Touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── Marquee ──────────────────────────────────────────────────────────────────
const Marquee = () => {
  const items = ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MySQL", "MongoDB", "Firebase", "Docker", "Java", "Python", "C"];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-track">
      <div className="marquee-inner">
        {doubled.map((t, i) => (
          <span key={i} className="marquee-item">{t}<span>✦</span></span>
        ))}
      </div>
    </div>
  );
};

// ── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  {
    id: "01", title: "EasyMessage", type: "SaaS Messaging Platform", desc: "Built a SaaS-based WhatsApp messaging platform enabling users to send personalized messages without saving phone numbers. Developed modular features including contact management, group messaging, reusable templates, advanced search/filter, and secure user profile handling", stack: ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "Tailwind CSS", "Firebase"], accent: "#e8ff00", github: "https://github.com/pratibhaxs/EasyMessage",
    live: "easy-message.vercel.app"
  },
  {
    id: "02", title: "Collaborative-App", type: "Real-Time Multiuser Editor", desc: "Developed a real-time collaborative workspace with live multi-user synchronization. Implemented room-based collaboration architecture enabling simultaneous text editing and shared canvas drawing.", stack: ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "MongoDB", "Socket.IO"], accent: "#ff4d00", github: "https://github.com/pratibhaxs/Collaborative-App",
    live: "https://orbita.vercel.app"
  },

];

const ProjectCard = ({ p, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: .8, delay: index * .12, ease: [.22, 1, .36, 1] }}
      style={{
        border: "1px solid var(--border)", background: "var(--surface)",
        padding: 40, position: "relative", overflow: "hidden",
      }}>
      {/* Number watermark */}
      <span style={{
        position: "absolute", top: -10, right: 20,
        fontFamily: "var(--font-disp)", fontSize: 120,
        color: "rgba(255,255,255,.03)", lineHeight: 1, userSelect: "none",
      }}>{p.id}</span>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span className="tag">{p.type}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.accent }}>{p.id}</span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-disp)", fontSize: 42, letterSpacing: ".04em",
        color: "var(--text)", marginBottom: 16, lineHeight: 1,
      }}>{p.title}</h3>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>{p.desc}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {p.stack.map(s => (
          <span key={s} style={{
            border: `1px solid ${p.accent}33`, color: p.accent,
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
            padding: "4px 12px", textTransform: "uppercase",
          }}>{s}</span>
        ))}
      </div>

      {/* GitHub + Live Links */}
      <div className="proj-links" style={{ display: "flex", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
          color: "var(--muted)", textDecoration: "none", textTransform: "uppercase",
          border: "1px solid var(--border)", padding: "8px 16px",
          transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.accent; e.currentTarget.style.color = p.accent }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
          </svg>
          GitHub
        </a>

        <a href={p.live} target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".1em",
          color: "var(--muted)", textDecoration: "none", textTransform: "uppercase",
          border: "1px solid var(--border)", padding: "8px 16px",
          transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.accent; e.currentTarget.style.color = p.accent; e.currentTarget.style.background = p.accent + "11" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live Demo
        </a>
      </div>
      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ duration: .8, delay: index * .12 + .4 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: p.accent, transformOrigin: "left" }} />
    </motion.div>
  );
};

const Work = () => (
  <section id="work">
    <div className="container">
      <div style={{ textAlign:"center", marginBottom:64 }}>
  <motion.h2 ...
    style={{ fontFamily:"var(--font-disp)", fontSize:"clamp(42px,6vw,80px)", lineHeight:.9 }}>
    THINGS I <span style={{color:"var(--accent)"}}>BUILT</span>
  </motion.h2>
</div>
      <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(480px,1fr))", gap: 2 }}>
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
      </div>
    </div>
  </section>
);

// ── About ────────────────────────────────────────────────────────────────────
const About = () => {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start end", "end start"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <motion.p className="tag" style={{ marginBottom: 16 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>About Me</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
            style={{ fontFamily: "var(--font-disp)", fontSize: "clamp(40px,5vw,72px)", lineHeight: .92, marginBottom: 40 }}>
            CRAFTING<br />MODERN<br /><em style={{ fontFamily: "var(--font-ser)", fontStyle: "italic", color: "var(--accent)" }}>web</em><br />EXPERIENCES.
          </motion.h2>
        </div>

        <div ref={lineRef}>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
            style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--muted)", lineHeight: 1.9, marginBottom: 24 }}>
            Hello! I’m Pratibha — a developer who enjoys building full stack applications with clean design and powerful functionality. From responsive frontends to secure backend systems, I love working across the entire development process.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .35 }}
            style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--muted)", lineHeight: 1.9, marginBottom: 48 }}>
            I’m passionate about learning, experimenting with new technologies, and building projects that solve real-world problems. Currently, I’m exploring modern web technologies, DevOps tools, and AI-powered applications to grow as a versatile software developer.
          </motion.p>

        </div>
      </div>
    </section>
  );
};

// ── Stack ────────────────────────────────────────────────────────────────────
const stackData = [
  { cat: "Languages", items: ["Java", "JavaScript", "Python", "C"] },
  { cat: "Frontend", items: ["React.js", "Framer Motion", "Tailwind CSS", "CSS3", "HTML5"] },
  { cat: "Backend", items: ["Node.js", "Express.js", "REST API", "JWT Authentication"] },
  { cat: "Database", items: ["MySQL", "MongoDB", "Firebase"] },
  { cat: "Developer Tools", items: ["Git", "GitHub", "Docker", "Postman"] },
];

const Stack = () => (
  <section id="stack" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
    <div className="container">

      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
        style={{ fontFamily: "var(--font-disp)", fontSize: "clamp(40px,6vw,80px)", marginBottom: 64, lineHeight: .9 ,  textAlign:"center" }}>
        Tech<span style={{ color: "var(--accent)" }}>Stack</span>
      </motion.h2>

      <div className="stack-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: "var(--border)" }}>
        {stackData.map((s, ci) => (
          <motion.div key={s.cat}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * .1, duration: .7 }}
            style={{ background: "var(--surface)", padding: 40 }}>
            <p className="tag" style={{ marginBottom: 24, color: "var(--accent)" }}>{s.cat}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {s.items.map((item, ii) => (
                <motion.div key={item}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: ci * .1 + ii * .06 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--muted)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text)" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const thanksRef = useRef(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError("Please fill all fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setTimeout(() => {
        thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "transparent",
    border: "none", borderBottom: "1px solid var(--border)",
    padding: "14px 0", color: "var(--text)",
    fontFamily: "var(--font-mono)", fontSize: 14,
    outline: "none", transition: "border-color .2s",
  };

  return (
    <section id="contact" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        {/* Left — Info */}
        <div>
          <motion.p className="tag" style={{ marginBottom: 16 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
            style={{ fontFamily: "var(--font-disp)", fontSize: "clamp(42px,6vw,86px)", lineHeight: .9, marginBottom: 32 }}>
            LET'S<br />BUILD<br />
            <span style={{ color: "var(--accent)" }}>SOMETHING.</span>
          </motion.h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                href: "mailto:contact.pratibha.dev@gmail.com",
                label: "Get In Touch",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                )
              },
              {
                href: "https://linkedin.com/in/pratibhaxs",
                label: "LinkedIn",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                )
              },
              {
                href: "https://github.com/pratibhaxs",
                label: "Github",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                )
              },
            ].map(({ href, label, icon }) => (
              <a key={label}
                href={href}
                target={href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  textDecoration: "none", color: "var(--muted)",
                  transition: "all .2s", padding: "12px 16px",
                  border: "1px solid transparent",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "rgba(232,255,0,.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon Box */}
                <span style={{
                  width: 40, height: 40,
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all .2s",
                }}>
                  {icon}
                </span>

                {/* Label */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  letterSpacing: ".06em",
                }}>
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="thanks"
              ref={thanksRef}
              initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ border: "1px solid var(--accent)", padding: 48, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-disp)", fontSize: 64, color: "var(--accent)", marginBottom: 16 }}>✓</div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text)", marginBottom: 8 }}>
                Message received!
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                I'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: .2 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                <div>
                  <label className="tag" style={{ display: "block", marginBottom: 8 }}>Name</label>
                  <input type="text" placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                <div>
                  <label className="tag" style={{ display: "block", marginBottom: 8 }}>Email</label>
                  <input type="email" placeholder="Your email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                <div>
                  <label className="tag" style={{ display: "block", marginBottom: 8 }}>Message</label>
                  <textarea placeholder="Tell me about your project..."
                    rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ff4d4d" }}>
                    ⚠ {error}
                  </p>
                )}

                {/* Button */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : .97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    background: loading ? "var(--muted)" : "var(--accent)",
                    color: "#fff", border: "none",
                    padding: "16px 40px",
                    fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: ".14em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    alignSelf: "flex-start", transition: "background .3s",
                  }}>
                  {loading ? "Sending..." : "Send Message →"}
                </motion.button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};


// ── App ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      <FontLoader />
      <div className="noise" />
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <About />
      <Stack />
      <Contact />
    </>
  );
}
