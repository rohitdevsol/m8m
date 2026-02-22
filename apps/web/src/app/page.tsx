"use client";

import React from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Code2, Database, Zap, Bot, Layers, Command, ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// Utility for glowing tracing beams
const AnimatedBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_100%)]" />
      <svg className="absolute w-full h-full opacity-40 mix-blend-screen" preserveAspectRatio="none">
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Animated paths creating a futuristic grid/network feel */}
        <motion.path
          d="M 100,-100 Q 400,300 1200,800"
          stroke="url(#beam1)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        />
        <motion.path
          d="M -200,200 C 300,400 600,100 1400,600"
          stroke="url(#beam2)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        />
        <motion.path
          d="M 200,900 C 500,600 800,900 1100,200"
          stroke="url(#beam1)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        />
      </svg>
      {/* Moving gradient orb */}
      <motion.div 
        animate={{ 
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -150, 50, 0],
          y: [0, 150, -50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"
      />
    </div>
  );
};

// Aceternity style glowing card
const GlowCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden ${className || ''}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          border: '1px solid',
          borderImageSource: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.5),
              transparent 100%
            )
          `,
          borderImageSlice: 1,
        }}
      />
      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/30">
      <AnimatedBeams />

      {/* Modern minimal Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-neutral-800/50 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Link
          href={"/"}
          className="flex items-center justify-center gap-3 self-center font-medium text-lg"
        >
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          m8m
        </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="https://docs.m8m.dev" className="hover:text-foreground transition-colors">Documentation</Link>
            <Link href="https://github.com/rohitdevsol/m8m" className="hover:text-foreground transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> Source
            </Link>
            {/* <ModeToggle/> */}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="hidden md:flex relative group overflow-hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-background/20 to-transparent group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 md:pt-52 md:pb-40 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            style={{ y, opacity }}
            className="flex flex-col items-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-foreground/80 text-xs font-mono mb-8 backdrop-blur-sm shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              M8M ENGINE v1.0 ONLINE
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.05] max-w-5xl"
            >
              Your workflows aren't linear.
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground">
                Your engine shouldn't be either.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl font-light leading-relaxed"
            >
              A completely open-source, ultra-minimal workflow automation platform. 
              Built with precision to process data routing seamlessly without a single line of code.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex items-center gap-6"
            >
              <Link href="/register" className="relative group overflow-hidden rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg">
                <span className="relative z-10 flex items-center gap-2">
                  Launch App
                </span>
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </Link>
              <div className="h-10 w-px bg-border" />
              <Link href="#preview" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
                <Command className="w-4 h-4" /> View Architecture
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Visual Abstract Asset Hero Display */}
        <section id="preview" className="relative py-12 px-6 max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
            <Image 
              src="/abstract-flow.png" 
              alt="M8M Abstract Node Flow" 
              fill 
              className="object-cover opacity-80 mix-blend-multiply dark:mix-blend-screen scale-105 hover:scale-100 transition-transform duration-[20s] ease-linear"
            />
            
            {/* Floating UI Elements over image */}
            <div className="absolute top-8 left-8 z-20 hidden md:block">
               <div className="bg-card/70 backdrop-blur-md border border-border p-4 rounded-xl shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-2 mb-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                   <span className="text-xs font-mono text-muted-foreground font-semibold">ROUTER_NODE_ACTIVE</span>
                 </div>
                 <div className="space-y-2">
                   <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
                     <motion.div className="h-full bg-cyan-500" initial={{ width: "0%" }} whileInView={{ width: "80%" }} transition={{ duration: 1.5, delay: 0.5 }} />
                   </div>
                   <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                     <motion.div className="h-full bg-purple-500" initial={{ width: "0%" }} whileInView={{ width: "65%" }} transition={{ duration: 1.5, delay: 0.7 }} />
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
          </motion.div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter mb-4">Precision engineered.</h2>
            <p className="text-muted-foreground text-lg max-w-xl">Every component in m8m is designed directly for speed, visual clarity, and raw execution power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <GlowCard className="md:col-span-2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <Layers className="w-8 h-8 text-cyan-500 md:mb-6" />
                  <h3 className="text-2xl font-display font-bold mb-3 tracking-tight">Visual canvas paradigm</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    Connect complex services visually without degrading to spaghetti code. The canvas snaps, aligns, and routes edges naturally as you build.
                  </p>
                </div>
                <div className="mt-12 group-hover:translate-x-2 transition-transform duration-300 flex items-center text-sm font-medium text-cyan-500">
                  Explore Builder <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="col-span-1">
              <div className="relative h-full flex flex-col justify-between">
                <Database className="w-8 h-8 text-purple-500 mb-6" />
                <div>
                  <h3 className="text-xl font-display font-bold mb-3 tracking-tight">Kafka backed engine</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Zero lost events. High throughput parallelism backed by enterprise queue streaming.
                  </p>
                </div>
              </div>
            </GlowCard>

            <div className="md:col-span-3 grid md:grid-cols-2 gap-6 h-full mt-6">
              <GlowCard className="flex flex-col min-h-[400px]">
                <Bot className="w-8 h-8 text-muted-foreground mb-6" />
                <h3 className="text-2xl font-display font-bold mb-3 tracking-tight">Symbiotic AI integration</h3>
                <p className="text-muted-foreground">
                  Embed LLMs natively into the flow. Parse unstructed payloads automatically and branch dynamically based on semantic value.
                </p>
                
                {/* SVG Route Animation Illustration */}
                <div className="mt-auto relative w-full h-40 border border-border rounded-xl bg-muted/20 overflow-hidden flex items-center justify-center">
                   <svg className="w-full h-full" viewBox="0 0 400 200">
                     <motion.path 
                       d="M 50 100 L 150 100 L 250 50 L 350 50" 
                       stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" fill="none"
                     />
                     <motion.path 
                       d="M 150 100 L 250 150 L 350 150" 
                       stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" fill="none"
                     />
                     
                     <motion.path 
                       d="M 50 100 L 150 100 L 250 50 L 350 50" 
                       stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="5 5"
                       initial={{ strokeDashoffset: 100 }}
                       animate={{ strokeDashoffset: 0 }}
                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     />
                     <motion.path 
                       d="M 150 100 L 250 150 L 350 150" 
                       stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="5 5"
                       initial={{ strokeDashoffset: 100 }}
                       animate={{ strokeDashoffset: 0 }}
                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     />
                     <circle cx="50" cy="100" r="4" fill="currentColor" opacity="0.5" />
                     <circle cx="150" cy="100" r="6" fill="currentColor" opacity="0.5" className="animate-pulse" />
                     <circle cx="250" cy="50" r="4" fill="#0ea5e9" />
                     <circle cx="250" cy="150" r="4" fill="#a855f7" />
                   </svg>
                </div>
              </GlowCard>

              <div className="relative group rounded-2xl border border-border overflow-hidden min-h-[400px]">
                {/* Image background for Core */}
                <Image 
                  src="/abstract-core.png" 
                  alt="Abstract Engine Core" 
                  fill 
                  className="object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000 mix-blend-multiply dark:mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <Zap className="w-8 h-8 text-primary mb-6" />
                  <h3 className="text-2xl font-display font-bold mb-3 tracking-tight text-foreground">Universal Connectivity</h3>
                  <p className="text-muted-foreground">
                    If it has an API, it can be connected. Dispatch webhooks, query databases, or post into slack instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-32 px-6 relative border-t border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-8">Stop writing boilerplate.</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
              m8m is free, open-source, and ready to deploy. Take control of your background jobs and data pipelines today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="https://github.com/rohitdevsol/m8m" className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full text-base font-semibold hover:bg-muted-foreground transition-colors shadow-lg">
                <Code2 className="w-5 h-5" />
                Initialize Project
              </Link>
            </div>
            <div className="mt-12 flex justify-center divide-x divide-border text-sm text-muted-foreground font-mono">
              <div className="px-6">MIT LINKED</div>
              <div className="px-6">TS NATIVE</div>
              <div className="px-6">NODE RUNTIME</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-foreground text-lg">m8m</span>  © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <Link href="https://github.com" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="https://twitter.com" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="https://discord.com" className="hover:text-foreground transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
