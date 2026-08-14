import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const glowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative pt-24 sm:pt-28 pb-4 px-4 text-center max-w-[900px] mx-auto z-10">
      {/* Hero Accent Glow Backdrop */}
      <motion.div
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#6DBE30]/15 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center space-y-4 sm:space-y-5"
      >
        {/* 1. Pill Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-block text-[11px] font-mono font-bold tracking-widest uppercase text-[#6DBE30]">
            AI GOVERNANCE GATEWAY
          </span>
        </motion.div>

        {/* 2. Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-sans font-bold tracking-display text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 leading-display text-center"
          style={{ fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)' }}
        >
          Your team is pasting company data into someone else&apos;s model.
        </motion.h1>

        {/* 3. Subtitle / Prompt instructions */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-sans font-normal leading-body"
        >
          Paste in a prompt and see exactly what you&apos;d have sent.
        </motion.p>
      </motion.div>
    </section>
  );
};

