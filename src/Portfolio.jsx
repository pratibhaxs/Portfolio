
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ── Google Fonts injected via style tag ──────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0a0a0a;
      --surface:   #111111;
      --border:    #1e1e1e;
      --accent:    #e8ff00;
      --accent2:   #ff4d00;
      --text:      #f0ece4;
      --muted:     #555555;
      --font-disp: 'Bebas Neue', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-ser:  'Instrument Serif', serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      cursor: none;
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

    .cursor {
      position: fixed; top: 0; left: 0; z-index: 9999;
      pointer-events: none; mix-blend-mode: difference;
    }
    .cursor-dot {
      width: 8px; height: 8px; background: var(--accent);
      border-radius: 50%; transform: translate(-50%,-50%);
      transition: transform .1s;
    }
    .cursor-ring {
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1px solid var(--accent);
      border-radius: 50%; transform: translate(-50%,-50%);
      transition: transform .18s ease, width .2s, height .2s;
      pointer-events: none; z-index: 9998;
      mix-blend-mode: difference;
    }

    section { padding: 120px 0; }

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

    .tilt-card {
      transition: transform .05s linear;
      transform-style: preserve-3d;
    }

    @media(max-width:768px){
      .container{padding:0 20px;}
      section{padding:80px 0;}
    }
  `}</style>
);

// ── Custom Cursor ────────────────────────────────────────────────────────────
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * .12;
      ring.current.y += (pos.current.y - ring.current.y) * .12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div className="cursor"><div className="cursor-dot" ref={dotRef} style={{ position:"fixed" }} /></div>
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
};

// ── GSAP 3D Tilt Hook ────────────────────────────────────────────────────────
const useTilt = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => el.style.transition = "transform .05s linear";
    const leave = () => {
      el.style.transition = "transform .5s ease";
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 22;
      const y = ((e.clientY - r.top) / r.height - .5) * -22;
      el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousemove", move);
    return () => { el.removeEventListener("mouseenter",enter); el.removeEventListener("mouseleave",leave); el.removeEventListener("mousemove",move); };
  }, []);
  return ref;
};

// ── Nav ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .7, ease: [.22,1,.36,1] }}
      style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"20px 40px",
        background: scrolled ? "rgba(10,10,10,.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all .4s",
      }}>
      
      <div style={{ display:"flex", gap:36,justifyContent: "center" }}>
        {["Work","About","Tech Stack","Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily:"var(--font-mono)", fontSize:12, letterSpacing:".14em",
            color:"var(--muted)", textDecoration:"none", textTransform:"uppercase",
            transition:"color .2s",
          }}
          onMouseEnter={e=>e.target.style.color="var(--accent)"}
          onMouseLeave={e=>e.target.style.color="var(--muted)"}
          >{l}</a>
        ))}
      </div>
    </motion.nav>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["0%","30%"]);
  const opacity = useTransform(scrollYProgress, [0,.7], [1, 0]);

  const chars = "Pratibha Swami".split("");

  return (
    <section ref={heroRef} style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
      {/* Grid lines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)", backgroundSize:"80px 80px", opacity:.4 }} />

      <motion.div className="container" style={{ y, opacity, position:"relative", zIndex:2 }}>
        <motion.p className="tag" style={{ marginBottom:28 }}
          initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.3,duration:.7}}>
          Full-Stack Developer
        </motion.p>

        <div style={{ overflow:"hidden" }}>
          <h1 style={{
            fontFamily:"var(--font-disp)", fontSize:"clamp(72px,12vw,160px)",
            lineHeight:.88, letterSpacing:".02em",
            display:"flex", flexWrap:"wrap", gap:"0 8px",
          }}>
            {chars.map((c,i) => (
              <motion.span key={i}
                initial={{ y:"100%", opacity:0 }}
                animate={{ y:"0%", opacity:1 }}
                transition={{ delay:.5 + i*.04, duration:.7, ease:[.22,1,.36,1] }}
                style={{ display:"inline-block", color: c===" " ? "transparent" : "var(--text)" }}>
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.p
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:.8}}
          style={{
            fontFamily:"var(--font-ser)", fontStyle:"italic",
            fontSize:"clamp(18px,2.5vw,28px)", color:"var(--muted)",
            maxWidth:520, marginTop:32, lineHeight:1.6,
          }}>
          Building products people actually want to use.
        </motion.p>

        <motion.div
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.5,duration:.7}}
          style={{ display:"flex", gap:16, marginTop:52, alignItems:"center" }}>
          <a href="#work" style={{
            background:"var(--accent)", color:"#000",
            fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:".14em",
            padding:"14px 32px", textDecoration:"none", textTransform:"uppercase",
            transition:"transform .2s",
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            View Work →
          </a>
          <a href="#contact" style={{
            border:"1px solid var(--border)", color:"var(--muted)",
            fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:".14em",
            padding:"14px 32px", textDecoration:"none", textTransform:"uppercase",
            transition:"all .2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)"}}>
            Get in Touch
          </a>
        </motion.div>        
      </motion.div>
    </section>
  );
};

// ── Marquee ──────────────────────────────────────────────────────────────────
const Marquee = () => {
  const items = ["HTML5","CSS3","JavaScript", "React", "Node.js", "MySQL", "MongoDB", "Firebase", "Docker" , "Java", "Python", "C"];
  const doubled = [...items,...items];
  return (
    <div className="marquee-track">
      <div className="marquee-inner">
        {doubled.map((t,i)=>(
          <span key={i} className="marquee-item">{t}<span>✦</span></span>
        ))}
      </div>
    </div>
  );
};

// ── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  { id:"01", title:"EasyMessage", type:"SaaS Messaging Platform", desc:"Built a SaaS-based WhatsApp messaging platform enabling users to send personalized messages without saving phone numbers. Developed modular features including contact management, group messaging, reusable templates, advanced search/filter, and secure user profile handling", stack:["HTML5","CSS3","JavaScript","React.js","Node.js","Tailwind CSS","Firebase"], accent:"#e8ff00" },
  { id:"02", title:"Collaborative-App", type:"Real-Time Multiuser Editor", desc:"Developed a real-time collaborative workspace with live multi-user synchronization. Implemented room-based collaboration architecture enabling simultaneous text editing and shared canvas drawing.", stack:["HTML5","CSS3","JavaScript","React.js","Node.js", "MongoDB", "Socket.IO"], accent:"#ff4d00" },
  
];

const ProjectCard = ({ p, index }) => {
  const tiltRef = useTilt();
  return (
    <motion.div
      ref={tiltRef}
      className="tilt-card"
      initial={{ opacity:0, y:60 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-80px" }}
      transition={{ duration:.8, delay:index*.12, ease:[.22,1,.36,1] }}
      style={{
        border:"1px solid var(--border)", background:"var(--surface)",
        padding:40, position:"relative", overflow:"hidden",
      }}>
      {/* Number watermark */}
      <span style={{
        position:"absolute", top:-10, right:20,
        fontFamily:"var(--font-disp)", fontSize:120,
        color:"rgba(255,255,255,.03)", lineHeight:1, userSelect:"none",
      }}>{p.id}</span>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <span className="tag">{p.type}</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:p.accent }}>{p.id}</span>
      </div>

      <h3 style={{
        fontFamily:"var(--font-disp)", fontSize:42, letterSpacing:".04em",
        color:"var(--text)", marginBottom:16, lineHeight:1,
      }}>{p.title}</h3>

      <p style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"var(--muted)", lineHeight:1.7, marginBottom:28 }}>{p.desc}</p>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
        {p.stack.map(s=>(
          <span key={s} style={{
            border:`1px solid ${p.accent}33`, color:p.accent,
            fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:".1em",
            padding:"4px 12px", textTransform:"uppercase",
          }}>{s}</span>
        ))}
      </div>

      

      {/* Bottom accent line */}
      <motion.div
        initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}}
        transition={{duration:.8,delay:index*.12+.4}}
        style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:p.accent, transformOrigin:"left" }} />
    </motion.div>
  );
};

const Work = () => (
  <section id="work">
    <div className="container">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:64 }}>
        <div>
      
          <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,ease:[.22,1,.36,1]}}
            style={{ fontFamily:"var(--font-disp)", fontSize:"clamp(42px,6vw,80px)", lineHeight:.9 }}>
            THINGS<span style={{color:"var(--accent)"}}>I BUILT</span>
          </motion.h2>
        </div>

      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(480px,1fr))", gap:2 }}>
        {projects.map((p,i)=><ProjectCard key={p.id} p={p} index={i}/>)}
      </div>
    </div>
  </section>
);

// ── About ────────────────────────────────────────────────────────────────────
const About = () => {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:lineRef, offset:["start end","end start"] });
  const scaleY = useTransform(scrollYProgress,[0,1],[0,1]);

  return (
    <section id="about" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
        <div>
          <motion.p className="tag" style={{marginBottom:16}} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>About Me</motion.p>
          <motion.h2 initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8,ease:[.22,1,.36,1]}}
            style={{ fontFamily:"var(--font-disp)", fontSize:"clamp(40px,5vw,72px)", lineHeight:.92, marginBottom:40 }}>
            CRAFTING<br />MODERN<br /><em style={{fontFamily:"var(--font-ser)",fontStyle:"italic",color:"var(--accent)"}}>web</em><br />EXPERIENCES.
          </motion.h2>
        </div>

        <div ref={lineRef}>
          <motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}}
            style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--muted)", lineHeight:1.9, marginBottom:24 }}>
     Hello! I’m Pratibha — a developer who enjoys building full stack applications with clean design and powerful functionality. From responsive frontends to secure backend systems, I love working across the entire development process.
          </motion.p>
          <motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.35}}
            style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--muted)", lineHeight:1.9, marginBottom:48 }}>
   I’m passionate about learning, experimenting with new technologies, and building projects that solve real-world problems. Currently, I’m exploring modern web technologies, DevOps tools, and AI-powered applications to grow as a versatile software developer.
          </motion.p>
          
        </div>
      </div>
    </section>
  );
};

// ── Stack ────────────────────────────────────────────────────────────────────
const stackData = [
  { cat:"Languages", items:["Java","JavaScript","Python","C"] },
  { cat:"Frontend", items:["React.js","Framer Motion","Tailwind CSS","CSS3", "HTML5"] },
  { cat:"Backend", items:["Node.js","Express.js","REST API", "JWT Authentication"] },
  { cat:"Database", items:["MySQL","MongoDB","Firebase"] },
  { cat:"Developer Tools", items:["Git", "GitHub", "Docker","Postman"] },
];

const Stack = () => (
  <section id="stack" style={{ borderTop:"1px solid var(--border)", background:"var(--surface)" }}>
    <div className="container">

      <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}
        style={{ fontFamily:"var(--font-disp)", fontSize:"clamp(40px,6vw,80px)", marginBottom:64, lineHeight:.9 }}>
        Tech<span style={{color:"var(--accent)"}}>Stack</span>
      </motion.h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:1, background:"var(--border)" }}>
        {stackData.map((s,ci)=>(
          <motion.div key={s.cat}
            initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:ci*.1,duration:.7}}
            style={{ background:"var(--surface)", padding:40 }}>
            <p className="tag" style={{ marginBottom:24, color:"var(--accent)" }}>{s.cat}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {s.items.map((item,ii)=>(
                <motion.div key={item}
                  initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:ci*.1+ii*.06}}
                  style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:"var(--muted)", flexShrink:0 }}/>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--text)" }}>{item}</span>
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
  const [form, setForm] = useState({ name:"", email:"", message:"" });

  const inputStyle = {
    width:"100%", background:"transparent",
    border:"none", borderBottom:"1px solid var(--border)",
    padding:"14px 0", color:"var(--text)",
    fontFamily:"var(--font-mono)", fontSize:14,
    outline:"none", transition:"border-color .2s",
  };

  return (
    <section id="contact" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
        <div>
          <motion.p className="tag" style={{marginBottom:16}} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>Get In Touch</motion.p>
          <motion.h2 initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8,ease:[.22,1,.36,1]}}
            style={{ fontFamily:"var(--font-disp)", fontSize:"clamp(42px,6vw,86px)", lineHeight:.9, marginBottom:32 }}>
            LET'S<br />BUILD<br /><span style={{color:"var(--accent)"}}>SOMETHING.</span>
          </motion.h2>
      
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[["Email","https://mail.google.com/mail/?view=cm&fs=1&to=pratibhaswami561@gmail.com"],["LinkedIn","https://linkedin.com/in/pratibhaxs"],["GitHub","https://github.com/pratibhaxs"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", gap:20 }}>
                <span className="tag" style={{ width:80, flexShrink:0 }}>{l}</span>
                <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--text)",
          textDecoration: "none",
        }}
      >
    {l === "Email"
  ? "pratibhaswami561@gmail.com"
  : l === "LinkedIn"
  ? "@pratibhaxs"
  : "@pratibhaxs"}
      </a>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="thanks" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              style={{ border:"1px solid var(--accent)", padding:40, textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-disp)", fontSize:52, color:"var(--accent)", marginBottom:12 }}>✓</div>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--muted)" }}>Message received. I'll be in touch soon.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}}>
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {[["Name","text","name"],["Email","email","email"]].map(([pl,tp,key])=>(
                  <div key={key}>
                    <label className="tag" style={{ display:"block", marginBottom:8 }}>{pl}</label>
                    <input type={tp} placeholder={`Your ${pl.toLowerCase()}`} value={form[key]}
                      onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                      style={inputStyle}
                      onFocus={e=>e.target.style.borderColor="var(--accent)"}
                      onBlur={e=>e.target.style.borderColor="var(--border)"}
                    />
                  </div>
                ))}
                <div>
                  <label className="tag" style={{ display:"block", marginBottom:8 }}>Message</label>
                  <textarea placeholder="Tell me about your project..." rows={5} value={form.message}
                    onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                    style={{...inputStyle,resize:"vertical"}}
                    onFocus={e=>e.target.style.borderColor="var(--accent)"}
                    onBlur={e=>e.target.style.borderColor="var(--border)"}
                  />
                </div>
                <motion.button
                  whileHover={{scale:1.03}} whileTap={{scale:.97}}
                  onClick={()=>setSent(true)}
                  style={{
                    background:"var(--accent)", color:"#000",
                    border:"none", padding:"16px 40px",
                    fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:".14em",
                    textTransform:"uppercase", cursor:"none", alignSelf:"flex-start",
                  }}>
                  Send Message →
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
      <Cursor />
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
