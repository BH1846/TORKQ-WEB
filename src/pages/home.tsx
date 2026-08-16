/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Seo } from '../components/seo';
import { useThemeState } from '../lib/theme-state';
import { ParticleField } from '../components/ui/particle-field';
import { FlowDiagram, FlowDiagramHandle } from '../components/ui/flow-diagram';
import { Navbar } from '../components/ui/navbar';
import { ExposureInput } from '../components/ui/exposure-input';
import { HeroSection } from '../components/sections/hero';
import { DetailsSection } from '../components/sections/details';
import { KeyFeaturesSection } from '../components/sections/key-features';
import { ComparisonSection } from '../components/sections/comparison';
// import { RiskGraphSection } from '../components/sections/risk-graph';
import { GetDemoSection } from '../components/sections/get-demo';
import { ContactSection } from '../components/sections/contact';
import { FooterSection } from '../components/sections/footer';

/**
 * The homepage, unchanged — it is simply the '/' route now.
 *
 * The providers that used to wrap this (MotionConfig, HelmetProvider,
 * ThemeStateProvider) moved up to the root layout in src/routes.tsx so the
 * blog and FAQ share them. Nothing else about this page moved: same sections,
 * same order, same flow diagram and scan choreography.
 */

/**
 * The page's content guides, in one place so the sections that share them
 * provably share them.
 *
 * COLUMN is the section shell — cap plus gutter — and CONTENT the block inside
 * it that the eye actually reads the page's width off: the chatbox card, and
 * now the flow diagram, whose outermost nodes sit flush against it. The hero
 * runs to the same 900 above them.
 */
const COLUMN = 'w-full max-w-[1100px] mx-auto px-4';
const CONTENT = 'w-full max-w-[900px] mx-auto';

/**
 * Wrapper that recedes while the scan choreography owns the screen.
 * Opacity only — no transform — so it stays compositor-cheap and reads as
 * depth rather than movement.
 */
const Dimmable: React.FC<{ dimmed: boolean; children: React.ReactNode }> = ({
  dimmed,
  children,
}) => (
  <div
    className={`transition-opacity duration-500 ${
      dimmed ? 'opacity-[0.12] pointer-events-none' : 'opacity-100'
    }`}
  >
    {children}
  </div>
);

export default function HomePage() {
  const { state } = useThemeState();
  const flowDiagramRef = useRef<FlowDiagramHandle | null>(null);

  // Scroll-spy now lives inside <Navbar>, which tracks the active section with
  // an IntersectionObserver instead of offsetTop arithmetic.

  const isScanningState = state === 'scanning';

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#6DBE30]/30 selection:text-[#6DBE30]">
      {/* Homepage head tags + site-level JSON-LD. Mirrors index.html so the
          served HTML is correct with or without JavaScript. */}
      <Seo canonical="/" includeStructuredData />

      {/* Full-viewport Particle Field Background (z-index 0) */}
      <ParticleField />

      {/* Dark Variant Aurora Blobs Background */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6DBE30]/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Floating Sticky Navigation Bar */}
      <Dimmable dimmed={isScanningState}>
        <Navbar />
      </Dimmable>

      {/* Main Content Area */}
      <main className="relative z-10 space-y-8 sm:space-y-12">
        {/* HERO SECTION */}
        <Dimmable dimmed={isScanningState}>
          <HeroSection />
        </Dimmable>

        {/* HERO DATA-FLOW DIAGRAM SECTION */}
        <section
          id="flow"
          className={`relative ${COLUMN} min-h-[220px] sm:min-h-[260px] flex items-center justify-center transition-opacity duration-500 ${
            isScanningState ? 'z-[45] opacity-100' : 'z-10'
          }`}
        >
          <FlowDiagram ref={flowDiagramRef} className={CONTENT} />
        </section>

        {/* INTERACTIVE DEMO SECTION */}
        <section
          id="demo"
          className={`${COLUMN} min-h-[380px] my-12 scroll-mt-28`}
        >
          <Dimmable dimmed={isScanningState}>
            <ExposureInput flowDiagramRef={flowDiagramRef} />
          </Dimmable>
        </section>

        {/* DETAILS SECTION */}
        <Dimmable dimmed={isScanningState}>
          <DetailsSection />
        </Dimmable>

        {/* KEY FEATURES SECTION */}
        <Dimmable dimmed={isScanningState}>
          <KeyFeaturesSection />
        </Dimmable>

        {/* COMPARISON SECTION */}
        <Dimmable dimmed={isScanningState}>
          <ComparisonSection />
        </Dimmable>

        {/* RISK GRAPH SECTION — hidden for now */}
        {/* <Dimmable dimmed={isScanningState}>
          <RiskGraphSection />
        </Dimmable> */}

        {/* GET LIVE DEMO SECTION */}
        <Dimmable dimmed={isScanningState}>
          <GetDemoSection />
        </Dimmable>

        {/* CONTACT SECTION */}
        <Dimmable dimmed={isScanningState}>
          <ContactSection />
        </Dimmable>
      </main>

      {/* FOOTER */}
      <Dimmable dimmed={isScanningState}>
        <FooterSection />
      </Dimmable>
    </div>
  );
}
