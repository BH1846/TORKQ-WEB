import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '../ui/reveal';
import { SectionBackdrop } from '../ui/section-backdrop';

export const GetDemoSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const handleBookDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      setTimeout(() => {
        document.getElementById('name')?.focus({ preventScroll: true });
      }, 500);
    }
  };

  return (
    <section
      id="get-torkq"
      className="relative w-full overflow-hidden py-24 sm:py-32 scroll-mt-24"
    >
      <SectionBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        <Reveal className="w-full flex flex-col items-center">
          <div data-material="panel" className="w-full max-w-3xl mx-auto rounded-3xl p-8 sm:p-14 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center space-y-6 text-center">
            <div>
              <span className="inline-block text-xs font-mono font-bold tracking-widest uppercase text-[#6DBE30]">
                SEE IT ON YOUR OWN DATA
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-heading">
              Get a live demo.
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg font-sans leading-body">
              We'll walk through TorkQ running against your own traffic patterns —
              on-premise deployment, what gets masked, and what the evidence chain looks
              like when an auditor asks.
            </p>

            <div className="pt-2">
              <motion.a
                href="#contact"
                onClick={handleBookDemo}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="inline-block bg-[#6DBE30] hover:bg-[#8BE14A] text-black font-bold rounded-full px-8 py-4 text-base shadow-lg shadow-[#6DBE30]/20 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer select-none"
              >
                Book demo
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
