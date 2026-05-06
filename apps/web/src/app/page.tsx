"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import "./landing.css";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, delay },
});

const features = [
  { title: "Visual Canvas", desc: "Build complex DAGs on a drag-and-drop canvas with intelligent edge routing and real-time validation.", icon: "coral",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4M6.5 10v4M17.5 10v4"/></svg> },
  { title: "Kafka Engine", desc: "Enterprise message streaming with zero lost events, parallel execution, and automatic retries.", icon: "sage",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { title: "AI Integration", desc: "Embed Gemini, OpenAI, or Anthropic directly into flows with semantic branching and auto-parsing.", icon: "coral",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83"/></svg> },
  { title: "Secure Vault", desc: "Encrypted credential storage with fine-grained access control. Share keys across workflows safely.", icon: "navy",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> },
  { title: "Live Monitoring", desc: "Real-time execution dashboards. Trace data through nodes, inspect logs, replay failed runs.", icon: "sage",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/><rect x="2" y="2" width="20" height="20" rx="3"/></svg> },
  { title: "Multi-Channel", desc: "Slack, Discord, Telegram, custom webhooks. Trigger workflows from anywhere, deliver everywhere.", icon: "coral",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
];

export default function Home() {
  return (
    <div className="lp">
      <div className="lp-mesh" />

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link href="/" className="lp-brand">
            <Image src="/logo.svg" alt="m8m" width={28} height={28} />
            m8m
          </Link>
          <div className="lp-nav-center">
            <Link href="#features" className="lp-nav-link">Features</Link>
            <Link href="https://github.com/rohitdevsol/m8m" className="lp-nav-link" target="_blank" rel="noopener">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </Link>
          </div>
          <div className="lp-nav-right">
            <Link href="/login" className="lp-btn-ghost" id="nav-login">Log in</Link>
            <Link href="/signup" className="lp-btn-fill" id="nav-signup">
              Get Started
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <motion.div className="lp-hero-pill" {...fadeUp(0)}>
            <span className="lp-hero-pill-dot" />
            Open Source · Free Forever
          </motion.div>

          <motion.h1 className="lp-hero-h1" {...fadeUp(0.12)}>
            Your workflows,
            <br />
            <em>automated.</em>
          </motion.h1>

          <motion.p className="lp-hero-sub" {...fadeUp(0.24)}>
            Connect APIs, AI models, and services into powerful pipelines
            with a visual builder. No code. No limits.
          </motion.p>

          <motion.div className="lp-hero-ctas" {...fadeUp(0.36)}>
            <Link href="/login" className="lp-btn-lg secondary" id="hero-login">Log in</Link>
            <Link href="/signup" className="lp-btn-lg primary" id="hero-signup">
              Start Building
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </motion.div>

          <motion.div className="lp-hero-social" {...fadeUp(0.48)}>
            <div className="lp-hero-avatars">
              <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="avatar" width={28} height={28} />
              <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="avatar" width={28} height={28} />
              <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="avatar" width={28} height={28} />
              <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64" alt="avatar" width={28} height={28} />
            </div>
            Trusted by developers worldwide
          </motion.div>
        </div>

        <motion.div className="lp-hero-visual"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
        >
          <div className="lp-hero-img-glow" />
          <div className="lp-hero-img-wrap">
            <Image
              src="/hero-illustration.png"
              alt="Workflow automation illustration"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* LOGOS */}
      <motion.section className="lp-logos" {...fadeIn(0)}>
        <span className="lp-logos-label">Integrations you already use</span>
        <div className="lp-logos-row">
          <Image src="/telegram.svg" alt="Telegram" width={80} height={22} />
          <Image src="/slack.svg" alt="Slack" width={80} height={22} />
          <Image src="/discord.svg" alt="Discord" width={80} height={22} />
          <Image src="/openai.svg" alt="OpenAI" width={80} height={22} />
          <Image src="/gemini-color.svg" alt="Gemini" width={80} height={22} />
           <Image src="/grok.svg" alt="grok" width={80} height={22} />
          <Image src="/anthropic.svg" alt="Anthropic" width={80} height={22} />
          <Image src="/stripe.svg" alt="Stripe" width={60} height={22} />
           <Image src="/googleform.svg" alt="Google Form" width={80} height={22} />
          {/* <Image src="/github.svg" alt="GitHub" width={80} height={22} /> */}
        </div>
      </motion.section>

      {/* SHOWCASE SECTION */}
      <section className="lp-showcase">
        {/* Showcase Row 1: Data Extraction */}
        <div className="lp-showcase-row">
          <div className="lp-showcase-content">
            <span className="lp-showcase-number">01</span>
            <span className="lp-showcase-label">Data Extraction</span>
            <motion.h2 className="lp-showcase-heading" {...fadeIn(0)}>
              Parse the <br /><em>unparsable.</em>
            </motion.h2>
            <motion.p className="lp-showcase-desc" {...fadeIn(0.1)}>
              Extract structured JSON from any unstructured source. Receipts, emails, or 100-page PDFs—M8M transforms raw data into actionable insights instantly.
            </motion.p>
            <Link href="/signup" className="lp-nav-link" style={{ color: 'var(--coral)', display: 'inline-flex', fontSize: '1rem' }}>Explore Data Nodes <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
          </div>
          <motion.div className="lp-showcase-visual" {...fadeUp(0.2)}>
            <div className="lp-showcase-img-wrap">
              <Image src="/landing/dataextraction.png" alt="Data extraction visualization" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </motion.div>
        </div>

        {/* Showcase Row 2: Chatbots / AI */}
        <div className="lp-showcase-row reverse">
          <div className="lp-showcase-content">
            <span className="lp-showcase-number">02</span>
            <span className="lp-showcase-label">AI Automation</span>
            <motion.h2 className="lp-showcase-heading" {...fadeIn(0)}>
              Intelligent <br /><em>agents.</em>
            </motion.h2>
            <motion.p className="lp-showcase-desc" {...fadeIn(0.1)}>
              Deploy autonomous chatbots and AI workflows that reason. Integrate Gemini, OpenAI, and Anthropic seamlessly to build systems that think and act on your behalf.
            </motion.p>
            <Link href="/signup" className="lp-nav-link" style={{ color: 'var(--sage)', display: 'inline-flex', fontSize: '1rem' }}>Meet AI Nodes <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
          </div>
          <motion.div className="lp-showcase-visual" {...fadeUp(0.2)}>
            <div className="lp-showcase-img-wrap">
              <Image src="/landing/chatbot.png" alt="AI Chatbot visualization" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </motion.div>
        </div>

        {/* Showcase Row 3: Programming / Code */}
        <div className="lp-showcase-row">
          <div className="lp-showcase-content">
            <span className="lp-showcase-number">03</span>
            <span className="lp-showcase-label">Custom Logic</span>
            <motion.h2 className="lp-showcase-heading" {...fadeIn(0)}>
              Code when <br />you <em>need to.</em>
            </motion.h2>
            <motion.p className="lp-showcase-desc" {...fadeIn(0.1)}>
              Never hit a wall. Drop down to pure TypeScript for complex transformations. Bring your own logic while M8M handles the execution environment and retries.
            </motion.p>
            <Link href="/signup" className="lp-nav-link" style={{ color: 'var(--navy)', display: 'inline-flex', fontSize: '1rem' }}>Write Code <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
          </div>
          <motion.div className="lp-showcase-visual" {...fadeUp(0.2)}>
            <div className="lp-showcase-img-wrap">
              <Image src="/landing/programming.png" alt="Custom code environment" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </motion.div>
        </div>

        {/* Showcase Row 4: Server / Infrastructure */}
        <div className="lp-showcase-row reverse">
          <div className="lp-showcase-content">
            <span className="lp-showcase-number">04</span>
            <span className="lp-showcase-label">Execution Engine</span>
            <motion.h2 className="lp-showcase-heading" {...fadeIn(0)}>
              Enterprise <br /><em>scale.</em>
            </motion.h2>
            <motion.p className="lp-showcase-desc" {...fadeIn(0.1)}>
              Powered by a distributed Kafka event-bus. Zero lost events, automatic retries, and limitless horizontal scaling for your most demanding workflows.
            </motion.p>
            <Link href="/signup" className="lp-nav-link" style={{ color: 'var(--coral)', display: 'inline-flex', fontSize: '1rem' }}>View Architecture <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></Link>
          </div>
          <motion.div className="lp-showcase-visual" {...fadeUp(0.2)}>
            <div className="lp-showcase-img-wrap">
              <Image src="/landing/server.png" alt="Server infrastructure" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features" id="features">
        <motion.span className="lp-section-label" {...fadeIn(0)}>CAPABILITIES</motion.span>
        <motion.h2 className="lp-section-heading" {...fadeIn(0.05)}>
          Everything to ship
          <br />
          <em>faster.</em>
        </motion.h2>
        <motion.p className="lp-section-sub" {...fadeIn(0.1)}>
          Every component engineered for speed, reliability, and developer experience.
        </motion.p>

        <div className="lp-feature-grid">
          {features.map((f, i) => (
            <motion.div key={i} className="lp-fcard"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
            >
              <div className={`lp-fcard-icon ${f.icon}`}>{f.svg}</div>
              <h3 className="lp-fcard-title">{f.title}</h3>
              <p className="lp-fcard-desc">{f.desc}</p>
              <div className="lp-fcard-shine" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <motion.div className="lp-cta-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="lp-cta-heading">
            Stop writing
            <br />
            <em>boilerplate.</em>
          </h2>
          <p className="lp-cta-sub">Free, open-source, and built for teams that ship.</p>
          <div className="lp-cta-buttons">
            <Link href="/login" className="lp-btn-lg on-dark secondary" id="cta-login">Log in</Link>
            <Link href="/signup" className="lp-btn-lg primary" id="cta-signup">
              Get Started Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="lp-cta-badges">
            <span>MIT LICENSE</span>
            <span>SELF-HOSTABLE</span>
            <span>TYPESCRIPT NATIVE</span>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-left">
            <Image src="/logo.svg" alt="m8m" width={20} height={20} />
            <span>m8m</span>
            <span className="lp-footer-copy">© {new Date().getFullYear()}</span>
          </div>
          <div className="lp-footer-links">
            <Link href="https://github.com/rohitdevsol/m8m" target="_blank" rel="noopener">GitHub</Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener">Twitter</Link>
            <Link href="https://discord.com" target="_blank" rel="noopener">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
