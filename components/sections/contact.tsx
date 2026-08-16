import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeState } from '../../lib/theme-state';
import { Reveal } from '../ui/reveal';
import { submitContact, type ContactSubmission } from '../../lib/submit-contact';

const EMPTY_FORM: ContactSubmission = {
  name: '',
  email: '',
  company: '',
  message: '',
  website: '',
};

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
    <section id="contact" className="w-full max-w-[1100px] mx-auto px-4 py-20 scroll-mt-24 space-y-10">
      <Reveal className="text-center space-y-3">
        <span
          className="text-xs font-mono font-bold tracking-widest uppercase"
          style={{ color: accent }}
        >
          GET IN TOUCH
        </span>
        <h2 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-heading leading-heading">
          Request a Deployment Demo
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto font-sans leading-body">
          Speak with our gateway team about on-premise installation and regional PII capabilities.
        </p>
      </Reveal>

      <motion.div
        data-material="panel"
        whileHover={{ y: -4 }}
        className="max-w-xl mx-auto rounded-3xl p-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl transition-[background-color,border-color] duration-300"
      >
        {submitted ? (
          <div data-reveal className="text-center py-8 space-y-4 font-sans animate-fade-in">
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-black"
              style={{ backgroundColor: accent }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Thank You</h3>
            <p className="text-sm text-neutral-400">
              Your inquiry has been received. Our gateway engineering team will follow up within 24 hours.
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
              <label htmlFor="name" className="block text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2">
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
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#6DBE30] text-sm font-sans transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2">
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
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#6DBE30] text-sm font-sans transition-colors"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2">
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
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#6DBE30] text-sm font-sans transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2">
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
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#6DBE30] text-sm font-sans resize-none transition-colors"
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
              {sending ? 'Sending…' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};
