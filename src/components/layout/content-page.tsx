import React from 'react';
import { Navbar } from '../ui/navbar';
import { FooterSection } from '../sections/footer';
import { SectionBackdrop } from '../ui/section-backdrop';

/**
 * The shell every non-homepage route sits in: nav, backdrop, footer.
 *
 * Navbar takes linkBase="/" here so its section links resolve to '/#demo'
 * rather than a bare '#demo' that points at nothing on this page.
 *
 * The homepage does not use this — it has its own ParticleField and its own
 * dimming behaviour tied to the scan sequence, neither of which belongs on a
 * page of prose.
 */
export const ContentPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#6DBE30]/30 selection:text-[#6DBE30]">
    <Navbar linkBase="/" />

    {/* Aurora blobs + grid, same surface treatment as the details and
        key-features sections. Fixed rather than absolute so it stays put on a
        long article instead of scrolling away after the first screen. */}
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      <SectionBackdrop />
    </div>

    {/* pt clears the fixed top row; the nav pill sits bottom-centre on phones
        and top-centre from sm up, so the top padding steps up with it. */}
    <main className="relative z-10 pt-28 sm:pt-36 pb-24">{children}</main>

    <FooterSection />
  </div>
);
