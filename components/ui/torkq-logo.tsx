import React from 'react';

interface TorkqLogoProps {
  className?: string;
  size?: number;
  mono?: boolean;
  accentColor?: string;
  showWordmark?: boolean;
}

export const TorkqLogo: React.FC<TorkqLogoProps> = ({
  className = '',
  size = 32,
  mono = false,
  accentColor = '#6DBE30',
  showWordmark = true,
}) => {
  const primaryColor = mono ? 'currentColor' : accentColor;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Torkq Logo Icon */}
      <img
        src="/logo.svg"
        alt="Torkq logo"
        // Intrinsic size is declared so the square is reserved before the SVG
        // loads — without it the wordmark shifts sideways on first paint.
        width={size}
        height={size}
        decoding="async"
        className="h-8 w-8 shrink-0 object-contain"
        style={size !== 32 ? { width: `${size}px`, height: `${size}px` } : undefined}
      />

      {/* The name, set as a name. It was mono/black/uppercase/wide-tracked,
          which spelled the company TORKQ and read as a terminal prompt rather
          than a wordmark. Space Grotesk at its real capitalisation; the accent
          still lands on the q so the mark keeps its tell. */}
      {showWordmark && (
        <span className="font-display font-bold tracking-tight text-white text-base select-none">
          Tork<span style={{ color: primaryColor }}>q</span>
        </span>
      )}
    </div>
  );
};
