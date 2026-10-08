import React from 'react';

interface SovietStarIconProps {
  className?: string;
  size?: number;
}

/**
 * Authentic Soviet Ruby Kremlin Star Icon
 * High-precision vector illustration with 3D faceted ruby glass,
 * gold facet ribs, and golden rim. Rendered 100% inline for guaranteed
 * zero-network, instant rendering on all browsers and devices.
 */
export const SovietStarIcon: React.FC<SovietStarIconProps> = ({
  className = 'w-full h-full',
  size = 28,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Красная рубиновая кремлёвская звезда"
      role="img"
    >
      <defs>
        {/* Outer Gold Rim Gradient */}
        <linearGradient id="headerStarGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="35%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#8a6308" />
          <stop offset="100%" stopColor="#ffd868" />
        </linearGradient>

        {/* Facet Light / Shadow Gradients */}
        <linearGradient id="hFacetTopL" x1="38" y1="38" x2="50" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c50a16" />
          <stop offset="100%" stopColor="#ff4050" />
        </linearGradient>
        <linearGradient id="hFacetTopR" x1="50" y1="8" x2="62" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#96000a" />
          <stop offset="100%" stopColor="#550004" />
        </linearGradient>

        <linearGradient id="hFacetRightTop" x1="62" y1="38" x2="90" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff3344" />
          <stop offset="100%" stopColor="#c50a16" />
        </linearGradient>
        <linearGradient id="hFacetRightBot" x1="90" y1="38" x2="68" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a0006" />
          <stop offset="100%" stopColor="#4a0003" />
        </linearGradient>

        <linearGradient id="hFacetBtmRTop" x1="68" y1="60" x2="75" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff283a" />
          <stop offset="100%" stopColor="#a0000a" />
        </linearGradient>
        <linearGradient id="hFacetBtmRBot" x1="75" y1="90" x2="50" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#480004" />
          <stop offset="100%" stopColor="#720008" />
        </linearGradient>

        <linearGradient id="hFacetBtmLBot" x1="25" y1="90" x2="50" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#550005" />
          <stop offset="100%" stopColor="#8c000b" />
        </linearGradient>
        <linearGradient id="hFacetBtmLTop" x1="32" y1="60" x2="25" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff3a4b" />
          <stop offset="100%" stopColor="#c00010" />
        </linearGradient>

        <linearGradient id="hFacetLeftBot" x1="10" y1="38" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#550004" />
          <stop offset="100%" stopColor="#96000a" />
        </linearGradient>
        <linearGradient id="hFacetLeftTop" x1="10" y1="38" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff4555" />
          <stop offset="100%" stopColor="#cc0c18" />
        </linearGradient>
      </defs>

      {/* Gold outer rim */}
      <polygon
        points="50,4 63,35 97,38 71,61 79,94 50,76 21,94 29,61 3,38 37,35"
        fill="url(#headerStarGold)"
        stroke="#755208"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner ruby star base */}
      <polygon
        points="50,7 62,36 94,38 69,60 76,91 50,74 24,91 31,60 6,38 38,36"
        fill="#820008"
      />

      {/* 3D Facets radiating from center (50, 54) */}
      {/* Top Ray */}
      <polygon points="50,7 50,54 38,36" fill="url(#hFacetTopL)" />
      <polygon points="50,7 62,36 50,54" fill="url(#hFacetTopR)" />

      {/* Right Ray */}
      <polygon points="62,36 94,38 50,54" fill="url(#hFacetRightTop)" />
      <polygon points="94,38 69,60 50,54" fill="url(#hFacetRightBot)" />

      {/* Bottom-Right Ray */}
      <polygon points="69,60 76,91 50,54" fill="url(#hFacetBtmRTop)" />
      <polygon points="76,91 50,74 50,54" fill="url(#hFacetBtmRBot)" />

      {/* Bottom-Left Ray */}
      <polygon points="50,74 24,91 50,54" fill="url(#hFacetBtmLBot)" />
      <polygon points="24,91 31,60 50,54" fill="url(#hFacetBtmLTop)" />

      {/* Left Ray */}
      <polygon points="31,60 6,38 50,54" fill="url(#hFacetLeftBot)" />
      <polygon points="6,38 38,36 50,54" fill="url(#hFacetLeftTop)" />

      {/* Golden Spine lines from center (50, 54) to each ray tip */}
      <line x1="50" y1="54" x2="50" y2="7" stroke="#ffeaa7" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="54" x2="94" y2="38" stroke="#ffeaa7" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="54" x2="76" y2="91" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="54" x2="24" y2="91" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="54" x2="6" y2="38" stroke="#ffeaa7" strokeWidth="1" strokeLinecap="round" />

      {/* Subtle center point jewel highlight */}
      <circle cx="50" cy="54" r="2.2" fill="#fff7d6" opacity="0.9" />
    </svg>
  );
};
