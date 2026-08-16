import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useThemeState } from '../../lib/theme-state';
import { Reveal } from '../ui/reveal';
import { submitContact, type ContactSubmission } from '../../lib/submit-contact';

const EMPTY_FORM: ContactSubmission = {
  name: '',
  email: '',
  company: '',
  preferredTime: '',
  message: '',
  website: '',
};

const CONTACT_EMAIL = 'contact@torkq.com';

/** Split across lines so each word can carry its own rule, as in the reference. */
const HEADING_WORDS = ['Get', 'in', 'touch'];

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#6DBE30] text-sm font-sans transition-colors';
const LABEL_CLASS =
  'block text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2';

export const ContactSection: React.FC = () => {
  const { accent } = useThemeState();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<ContactSubmission>(EMPTY_FORM);

  const setField =
    (field: keyof ContactSubmission) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);
    try {
      await submitContact(values);
      setValues(EMPTY_FORM);
      setSubmitted(true);
    } catch (err) {
      // Never fall through to the thank-you screen on failure — that would tell
      // the visitor we have their enquiry when the row was never written.
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="w-full max-w-[1100px] mx-auto px-4 py-20 scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* ── Left: the address block, which is now an inbox rather than a door ── */}
        <Reveal className="space-y-10">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-white">
            {HEADING_WORDS.map((word) => (
              <span key={word} className="block">
                <span
                  className="inline-block border-b-[6px] pb-1"
                  style={{ borderColor: accent }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 w-10 h-10 shrink-0 rounded-full border border-white/15 bg-white/5 flex items-center justify-center"
            >
              <Mail className="h-4 w-4" style={{ color: accent }} />
            </span>
            <div className="space-y-1 font-sans">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                Email us
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-base text-white underline decoration-dotted underline-offset-4 hover:text-[#6DBE30] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-sm text-neutral-400 leading-body">
                Or use the form — we reply within one business day.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Right: the form ─────────────────────────────────────────────────── */}
        <motion.div
          data-material="panel"
          whileHover={{ y: -4 }}
          className="rounded-3xl p-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl transition-[background-color,border-color] duration-300"
        >
          <h3 className="pb-4 mb-6 border-b border-white/15 text-xl font-sans font-bold text-white tracking-heading">
            Book a Demo
          </h3>

          {submitted ? (
            <div data-reveal className="text-center py-8 space-y-4 font-sans animate-fade-in">
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-black"
                style={{ backgroundColor: accent }}
              >
                ✓
              </div>
              <h4 className="text-xl font-bold text-white">Thank You</h4>
              <p className="text-sm text-neutral-400">
                Your request has been received. Our gateway engineering team will confirm your demo
                slot by email within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-5 font-sans">
              <div>
                <label htmlFor="name" className={LABEL_CLASS}>
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={setField('name')}
                  disabled={sending}
                  placeholder="Jane Doe"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="email" className={LABEL_CLASS}>
                  Work Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={setField('email')}
                  disabled={sending}
                  placeholder="jane@company.com"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="company" className={LABEL_CLASS}>
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  value={values.company}
                  onChange={setField('company')}
                  disabled={sending}
                  placeholder="Acme Enterprise"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className={LABEL_CLASS}>
                  Preferred Meeting Time
                </label>
                {/* `color-scheme: dark` so the browser paints its own calendar
                    widget dark — the default light picker is unreadable here. */}
                <input
                  id="preferredTime"
                  type="datetime-local"
                  name="preferredTime"
                  value={values.preferredTime}
                  onChange={setField('preferredTime')}
                  disabled={sending}
                  className={`${FIELD_CLASS} [color-scheme:dark]`}
                />
                <p className="mt-2 text-xs text-neutral-500 leading-body">
                  Optional. Sent in your local time zone — we confirm the slot by email.
                </p>
              </div>

              <div>
                <label htmlFor="message" className={LABEL_CLASS}>
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  name="message"
                  value={values.message}
                  onChange={setField('message')}
                  disabled={sending}
                  placeholder="Tell us about your infrastructure or AI model traffic..."
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              {/* Honeypot. Off-screen rather than display:none, which some bots
                  detect and skip. Real users never see or tab into it. */}
              <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={setField('website')}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-sans leading-relaxed"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider text-black transition-[filter,transform] duration-150 ease-out hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#6DBE30] shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{ backgroundColor: accent }}
              >
                {sending ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
