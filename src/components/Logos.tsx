import React, { useState } from 'react';

// Safely discover images in assets/images using Vite's glob import
// This prevents Vite internal server errors (500) if an image is renamed or relocated in VS Code
const assetImages = import.meta.glob<{ default: string }>(
  '../assets/images/*',
  { eager: true }
);

function resolveLogoAsset(candidates: string[], fallbackPublicUrl: string): string {
  for (const name of candidates) {
    const key = `../assets/images/${name}`;
    if (assetImages[key]?.default) {
      return assetImages[key].default;
    }
  }
  return fallbackPublicUrl;
}

const defaultHcdcSealUrl = resolveLogoAsset(
  ['hcdc_school_seal.jpg', 'hcdc_school_seal.png', 'hcdc_logo.png', 'hcdc_school_seal_1788939162977.jpg'],
  '/assets/images/hcdc_school_seal.jpg'
);

const defaultComeLogoUrl = resolveLogoAsset(
  ['come_program_logo.jpg', 'come_program_logo.png', 'come_logo.png', 'come_program_logo_1788939220536.jpg'],
  '/assets/images/come_program_logo.jpg'
);

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  alt?: string;
}

/**
 * Official Holy Cross of Davao College, Inc. School Seal
 * Reads primary image directly from assets/images/hcdc_school_seal.jpg
 * with fallback to public path or vector rendering if modified in VS Code.
 */
export const HcdcSchoolLogo: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  size,
  alt = 'Holy Cross of Davao College, Inc. School Seal',
}) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(defaultHcdcSealUrl);

  const dimensionProps = size ? { width: size, height: size } : {};

  const handleError = () => {
    // Attempt fallback to public directory paths
    if (currentSrc !== '/assets/images/hcdc_school_seal.jpg') {
      setCurrentSrc('/assets/images/hcdc_school_seal.jpg');
    } else if (currentSrc !== '/assets/images/hcdc_logo.png') {
      setCurrentSrc('/assets/images/hcdc_logo.png');
    } else {
      // Final fallback to vector SVG
      setImgError(true);
    }
  };

  if (imgError) {
    return <HcdcSchoolSealSvg className={className} size={size} />;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      crossOrigin="anonymous"
      className={`object-contain shrink-0 rounded-full bg-white p-0.5 drop-shadow-xs ${className}`}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="eager"
      {...dimensionProps}
    />
  );
};

/**
 * Official College of Maritime Education (COME) Program Logo
 * Reads primary image directly from assets/images/come_program_logo.jpg
 * with fallback to public path or vector rendering if modified in VS Code.
 */
export const ComeProgramLogo: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  size,
  alt = 'College of Maritime Education (COME) Program Logo',
}) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(defaultComeLogoUrl);

  const dimensionProps = size ? { width: size, height: size } : {};

  const handleError = () => {
    // Attempt fallback to public directory paths
    if (currentSrc !== '/assets/images/come_program_logo.jpg') {
      setCurrentSrc('/assets/images/come_program_logo.jpg');
    } else if (currentSrc !== '/assets/images/come_logo.png') {
      setCurrentSrc('/assets/images/come_logo.png');
    } else {
      // Final fallback to vector SVG
      setImgError(true);
    }
  };

  if (imgError) {
    return <ComeProgramLogoSvg className={className} size={size} />;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      crossOrigin="anonymous"
      className={`object-contain shrink-0 rounded-full bg-white p-0.5 drop-shadow-xs ${className}`}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="eager"
      {...dimensionProps}
    />
  );
};

/**
 * Fallback Vector SVG: Holy Cross of Davao College, Inc. School Seal
 */
export const HcdcSchoolSealSvg: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  size,
}) => {
  const dimensionProps = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 300 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-xs ${className}`}
      {...dimensionProps}
      aria-label="Holy Cross of Davao College, Inc. School Seal"
    >
      <defs>
        {/* Arc path for top text: HOLY CROSS OF DAVAO COLLEGE, INC. */}
        <path
          id="hcdc-top-arc"
          d="M 38,150 A 112,112 0 1,1 262,150"
          fill="none"
        />
        {/* Arc path for bottom text: DAVAO CITY */}
        <path
          id="hcdc-bot-arc"
          d="M 60,185 A 112,112 0 0,0 240,185"
          fill="none"
        />
        {/* Subtle 3D gradient for inner blue circle */}
        <radialGradient id="hcdc-blue-grad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
      </defs>

      {/* Main Outer Seal Group */}
      <g id="hcdc-seal">
        {/* Outer Circular Ring Background */}
        <circle cx="150" cy="150" r="144" fill="#ffffff" stroke="#881337" strokeWidth="5" />
        <circle cx="150" cy="150" r="137" fill="#ffffff" stroke="#9f1239" strokeWidth="1.5" />

        {/* Circular Ring Text Track */}
        <circle cx="150" cy="150" r="102" fill="none" stroke="#9f1239" strokeWidth="2" />

        {/* Top Text: HOLY CROSS OF DAVAO COLLEGE, INC. */}
        <text fill="#881337" fontSize="15.5" fontWeight="900" fontFamily="serif" letterSpacing="2.8">
          <textPath href="#hcdc-top-arc" startOffset="50%" textAnchor="middle">
            HOLY CROSS OF DAVAO COLLEGE, INC.
          </textPath>
        </text>

        {/* Dividing Stars */}
        <text x="32" y="165" fill="#881337" fontSize="16" fontWeight="bold" textAnchor="middle">★</text>
        <text x="268" y="165" fill="#881337" fontSize="16" fontWeight="bold" textAnchor="middle">★</text>

        {/* Bottom Text: DAVAO CITY */}
        <text fill="#881337" fontSize="16" fontWeight="900" fontFamily="serif" letterSpacing="4.5">
          <textPath href="#hcdc-bot-arc" startOffset="50%" textAnchor="middle">
            DAVAO CITY
          </textPath>
        </text>

        {/* Central Azure Blue Disc */}
        <circle cx="150" cy="150" r="100" fill="url(#hcdc-blue-grad)" stroke="#ffffff" strokeWidth="2.5" />

        {/* Foundation Year 1951 */}
        <text x="150" y="234" fill="#ffffff" fontSize="20" fontWeight="900" fontFamily="serif" textAnchor="middle" letterSpacing="2">
          1951
        </text>

        {/* Open Book in Center */}
        <g id="open-book" transform="translate(150, 140)">
          {/* Shadow behind book */}
          <path
            d="M -75,35 Q -38,45 0,38 Q 38,45 75,35 L 75,-32 Q 38,-22 0,-30 Q -38,-22 -75,-32 Z"
            fill="#0f172a"
            opacity="0.25"
          />

          {/* Book Base / Page White */}
          <path
            d="M -73,32 Q -37,42 0,35 Q 37,42 73,32 L 73,-35 Q 37,-25 0,-33 Q -37,-25 -73,-35 Z"
            fill="#ffffff"
            stroke="#881337"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Book Spine / Center Dividing Fold */}
          <path d="M 0,-33 L 0,35" stroke="#881337" strokeWidth="3" />
          <path d="M 0,35 L 0,44" stroke="#881337" strokeWidth="2.5" />

          {/* LEFT PAGE: Sunburst Rays & Latin Cross */}
          {/* Radiant Beams */}
          <g stroke="#9f1239" strokeWidth="1.2" opacity="0.8">
            <line x1="-36" y1="-2" x2="-56" y2="-22" />
            <line x1="-36" y1="-2" x2="-16" y2="-22" />
            <line x1="-36" y1="-2" x2="-56" y2="18" />
            <line x1="-36" y1="-2" x2="-16" y2="18" />
            <line x1="-36" y1="-2" x2="-60" y2="-2" />
            <line x1="-36" y1="-2" x2="-12" y2="-2" />
            <line x1="-36" y1="-2" x2="-36" y2="-24" />
            <line x1="-36" y1="-2" x2="-36" y2="20" />
          </g>

          {/* Bold Latin Cross on Left Page */}
          <path
            d="M -39,-25 L -33,-25 L -33,-8 L -18,-8 L -18,-2 L -33,-2 L -33,22 L -39,22 L -39,-2 L -54,-2 L -54,-8 L -39,-8 Z"
            fill="#881337"
          />

          {/* RIGHT PAGE: Divided into Top (Stars & Palm Tree) and Bottom (Alpha Omega) */}
          {/* Horizontal page divider on right side */}
          <line x1="4" y1="-2" x2="70" y2="-2" stroke="#881337" strokeWidth="2" />
          {/* Vertical divider between stars and palm tree */}
          <line x1="33" y1="-30" x2="33" y2="-2" stroke="#881337" strokeWidth="1.5" />

          {/* Three Stars on Right Top Page */}
          <g fill="#881337" transform="translate(18, -25)">
            <text x="0" y="5" fontSize="9" fontWeight="bold" textAnchor="middle">★</text>
            <text x="0" y="14" fontSize="9" fontWeight="bold" textAnchor="middle">★</text>
            <text x="0" y="23" fontSize="9" fontWeight="bold" textAnchor="middle">★</text>
          </g>

          {/* Palm Tree on Right Top Page */}
          <g transform="translate(52, -15)">
            {/* Trunk */}
            <path d="M -1,13 Q -4,5 0,-4" stroke="#881337" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Fronds */}
            <path d="M 0,-4 Q -10,-12 -12,-6" stroke="#881337" strokeWidth="1.5" fill="none" />
            <path d="M 0,-4 Q 10,-12 12,-6" stroke="#881337" strokeWidth="1.5" fill="none" />
            <path d="M 0,-4 Q 0,-15 3,-14" stroke="#881337" strokeWidth="1.5" fill="none" />
            <path d="M 0,-4 Q -8,-8 -6,2" stroke="#881337" strokeWidth="1.5" fill="none" />
            <path d="M 0,-4 Q 8,-8 6,2" stroke="#881337" strokeWidth="1.5" fill="none" />
          </g>

          {/* Bottom Right: Greek Letters Alpha and Omega ΑΩ */}
          <text x="37" y="22" fill="#881337" fontSize="23" fontWeight="bold" fontFamily="serif" textAnchor="middle" letterSpacing="2">
            ΑΩ
          </text>
        </g>
      </g>

      {/* Bottom Scroll / Banner: EX FIDE AD VERITATEM */}
      <g id="motto-banner" transform="translate(150, 310)">
        {/* Banner Shadow */}
        <rect x="-106" y="-14" width="212" height="30" rx="3" fill="#0f172a" opacity="0.2" />
        {/* Banner White Box */}
        <rect x="-108" y="-16" width="216" height="30" rx="3" fill="#ffffff" stroke="#881337" strokeWidth="3" />
        {/* Inner Trim Frame */}
        <rect x="-104" y="-12" width="208" height="22" rx="1.5" fill="#ffffff" stroke="#9f1239" strokeWidth="1.2" />
        {/* Motto Text */}
        <text
          x="0"
          y="4"
          fill="#881337"
          fontSize="14.5"
          fontWeight="900"
          fontFamily="serif"
          letterSpacing="2.2"
          textAnchor="middle"
        >
          EX FIDE AD VERITATEM
        </text>
      </g>
    </svg>
  );
};

/**
 * Fallback Vector SVG: College of Maritime Education (COME) Program Logo
 */
export const ComeProgramLogoSvg: React.FC<LogoProps> = ({
  className = 'w-12 h-12',
  size,
}) => {
  const dimensionProps = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-xs ${className}`}
      {...dimensionProps}
      aria-label="College of Maritime Education (COME) Program Logo"
    >
      <defs>
        {/* Arc path for inside circular text */}
        <path
          id="come-inner-top-arc"
          d="M 125,182 A 75,75 0 1,1 275,182"
          fill="none"
        />
        <path
          id="come-inner-bot-arc"
          d="M 135,200 A 75,75 0 0,0 265,200"
          fill="none"
        />
        {/* Ribbon arc for COLLEGE OF MARITIME EDUCATION */}
        <path
          id="come-ribbon-arc"
          d="M 68,336 Q 200,366 332,336"
          fill="none"
        />
        {/* Helm metallic gradient */}
        <linearGradient id="helm-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        {/* Anchor metal gradient */}
        <linearGradient id="anchor-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* 1. Laurel Wreath (Flanking Left & Right) */}
      <g id="laurel-wreath" fill="#15803d" stroke="#166534" strokeWidth="1">
        {/* Left Branch */}
        <path d="M 85,280 C 45,230 40,160 85,110 C 65,130 55,170 70,220 C 75,245 80,265 85,280 Z" opacity="0.4" />
        {/* Left Leaves */}
        <path d="M 68,125 Q 40,120 50,140 Q 65,145 68,125 Z" />
        <path d="M 55,150 Q 25,150 40,170 Q 55,170 55,150 Z" />
        <path d="M 48,180 Q 20,185 35,205 Q 52,200 48,180 Z" />
        <path d="M 48,215 Q 22,225 40,245 Q 55,235 48,215 Z" />
        <path d="M 58,250 Q 35,265 55,280 Q 70,268 58,250 Z" />
        <path d="M 75,278 Q 58,298 80,305 Q 90,290 75,278 Z" />

        {/* Right Branch */}
        <path d="M 315,280 C 355,230 360,160 315,110 C 335,130 345,170 330,220 C 325,245 320,265 315,280 Z" opacity="0.4" />
        {/* Right Leaves */}
        <path d="M 332,125 Q 360,120 350,140 Q 335,145 332,125 Z" />
        <path d="M 345,150 Q 375,150 360,170 Q 345,170 345,150 Z" />
        <path d="M 352,180 Q 380,185 365,205 Q 348,200 352,180 Z" />
        <path d="M 352,215 Q 378,225 360,245 Q 345,235 352,215 Z" />
        <path d="M 342,250 Q 365,265 345,280 Q 330,268 342,250 Z" />
        <path d="M 325,278 Q 342,298 320,305 Q 310,290 325,278 Z" />
      </g>

      {/* 2. Maritime Anchor (Behind Helm) */}
      <g id="anchor">
        {/* Top Shackle / Ring */}
        <circle cx="200" cy="45" r="22" stroke="url(#anchor-metal)" strokeWidth="10" fill="none" />
        {/* Anchor Cross Stock */}
        <rect x="160" y="48" width="80" height="14" rx="4" fill="url(#anchor-metal)" stroke="#1e293b" strokeWidth="2" />
        {/* Anchor Vertical Shank */}
        <rect x="190" y="55" width="20" height="240" fill="url(#anchor-metal)" stroke="#1e293b" strokeWidth="2" />
        {/* Dual Flukes and Curved Arms */}
        <path
          d="M 65,245 C 95,315 155,335 200,335 C 245,335 305,315 335,245 L 350,260 C 315,345 245,360 200,360 C 155,360 85,345 50,260 Z"
          fill="url(#anchor-metal)"
          stroke="#1e293b"
          strokeWidth="2.5"
        />
        {/* Left Fluke Point */}
        <polygon points="45,255 75,235 65,270" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />
        {/* Right Fluke Point */}
        <polygon points="355,255 325,235 335,270" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />

        {/* Coiled Anchor Rope */}
        <path
          d="M 188,70 Q 170,95 200,110 Q 230,125 185,155 Q 165,180 205,210 Q 235,235 185,270 Q 155,295 190,325"
          stroke="#f1f5f9"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 2"
          opacity="0.9"
        />
        <path
          d="M 188,70 Q 170,95 200,110 Q 230,125 185,155 Q 165,180 205,210 Q 235,235 185,270 Q 155,295 190,325"
          stroke="#94a3b8"
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* 3. Ship's Steering Wheel / Helm */}
      <g id="helm" transform="translate(200, 185)">
        {/* 8 Handles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            {/* Spoke bar */}
            <rect x="-6" y="-128" width="12" height="128" fill="url(#helm-wood)" stroke="#334155" strokeWidth="1.5" />
            {/* Turned Wood Handle Grip */}
            <path
              d="M -9,-128 C -9,-145 -14,-152 0,-156 C 14,-152 9,-145 9,-128 Z"
              fill="#94a3b8"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <circle cx="0" cy="-156" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        ))}

        {/* Outer Wheel Rim */}
        <circle cx="0" cy="0" r="102" fill="none" stroke="url(#helm-wood)" strokeWidth="18" />
        <circle cx="0" cy="0" r="111" fill="none" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="93" fill="none" stroke="#1e293b" strokeWidth="2.5" />

        {/* Inner Rim Studs */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle
            key={i}
            cx={102 * Math.cos((angle * Math.PI) / 180)}
            cy={102 * Math.sin((angle * Math.PI) / 180)}
            r="4"
            fill="#f8fafc"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        ))}
      </g>

      {/* 4. Central Circular Seal on Helm Hub */}
      <g id="center-seal" transform="translate(200, 185)">
        {/* White Inner Ring Background */}
        <circle cx="0" cy="0" r="88" fill="#ffffff" stroke="#881337" strokeWidth="4" />
        <circle cx="0" cy="0" r="83" fill="#ffffff" stroke="#9f1239" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="62" fill="none" stroke="#881337" strokeWidth="1.5" />

        {/* Inner Arc Text: HOLY CROSS OF DAVAO COLLEGE, INC. */}
        <text fill="#881337" fontSize="9.5" fontWeight="900" fontFamily="serif" letterSpacing="1.2">
          <textPath href="#come-inner-top-arc" startOffset="50%" textAnchor="middle">
            HOLY CROSS OF DAVAO COLLEGE, INC.
          </textPath>
        </text>

        {/* Stars */}
        <text x="-69" y="8" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">★</text>
        <text x="69" y="8" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">★</text>

        {/* Bottom Arc Text: DAVAO CITY */}
        <text fill="#881337" fontSize="10" fontWeight="900" fontFamily="serif" letterSpacing="2">
          <textPath href="#come-inner-bot-arc" startOffset="50%" textAnchor="middle">
            DAVAO CITY
          </textPath>
        </text>

        {/* Central Azure Disc */}
        <circle cx="0" cy="0" r="60" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

        {/* Open Book in Center */}
        <g id="mini-book" transform="translate(0, -3)">
          <path
            d="M -42,20 Q -21,26 0,22 Q 21,26 42,20 L 42,-20 Q 21,-14 0,-18 Q -21,-14 -42,-20 Z"
            fill="#ffffff"
            stroke="#881337"
            strokeWidth="2"
          />
          <line x1="0" y1="-18" x2="0" y2="22" stroke="#881337" strokeWidth="1.8" />

          {/* Left: Cross with radiant rays */}
          <path
            d="M -23,-13 L -19,-13 L -19,-3 L -10,-3 L -10,1 L -19,1 L -19,14 L -23,14 L -23,1 L -32,1 L -32,-3 L -23,-3 Z"
            fill="#881337"
          />

          {/* Right: Stars, Palm/Angel and Alpha Omega */}
          <line x1="3" y1="0" x2="40" y2="0" stroke="#881337" strokeWidth="1.2" />
          <line x1="18" y1="-16" x2="18" y2="0" stroke="#881337" strokeWidth="1" />

          {/* Stars */}
          <g fill="#881337" transform="translate(10, -12)">
            <text x="0" y="3" fontSize="5" fontWeight="bold" textAnchor="middle">★</text>
            <text x="0" y="8" fontSize="5" fontWeight="bold" textAnchor="middle">★</text>
            <text x="0" y="13" fontSize="5" fontWeight="bold" textAnchor="middle">★</text>
          </g>

          {/* Herald Angel / Palm Tree */}
          <g transform="translate(30, -7)">
            <path d="M -1,7 L -1,-2 Q 5,-4 3,-7 Q 0,-3 -4,-1" stroke="#881337" strokeWidth="1.2" fill="none" />
          </g>

          {/* Alpha Omega */}
          <text x="21" y="15" fill="#881337" fontSize="14" fontWeight="bold" fontFamily="serif" textAnchor="middle">
            ΑΩ
          </text>
        </g>
      </g>

      {/* 5. Flowing Ribbon Banner: COLLEGE OF MARITIME EDUCATION */}
      <g id="bottom-ribbon">
        {/* Ribbon Fold Ends (Back Tails) */}
        <path d="M 30,345 L 60,335 L 60,370 L 25,378 L 35,360 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
        <path d="M 370,345 L 340,335 L 340,370 L 375,378 L 365,360 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />

        {/* Main Ribbon Center Arc */}
        <path
          d="M 45,340 C 130,375 270,375 355,340 L 355,372 C 270,405 130,405 45,372 Z"
          fill="#ffffff"
          stroke="#1d4ed8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Bold Blue Lettering: COLLEGE OF MARITIME EDUCATION */}
        <text
          fill="#1e40af"
          fontSize="16.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.2"
        >
          <textPath href="#come-ribbon-arc" startOffset="50%" textAnchor="middle">
            COLLEGE OF MARITIME EDUCATION
          </textPath>
        </text>
      </g>
    </svg>
  );
};

/**
 * Composite Dual Institutional Header Badge
 * Renders both School Logo and Program Logo side-by-side with official institutional branding
 */
export const DualInstitutionalHeader: React.FC<{
  variant?: 'compact' | 'full' | 'print';
  className?: string;
}> = ({ variant = 'full', className = '' }) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center -space-x-2">
          <HcdcSchoolLogo className="w-9 h-9" />
          <ComeProgramLogo className="w-10 h-10 drop-shadow-sm" />
        </div>
        <div className="text-left leading-tight">
          <div className="text-xs font-bold text-white tracking-wide uppercase font-serif">
            Holy Cross of Davao College
          </div>
          <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
            <span>College of Maritime Education (COME)</span>
            <span className="text-[10px] bg-sky-950 text-sky-300 font-bold px-1.5 py-0.2 rounded border border-sky-700/60">
              BSMT
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'print') {
    return (
      <div className={`flex items-center justify-between border-b-2 border-slate-900 pb-4 ${className}`}>
        {/* Left: Official HCDC School Seal */}
        <div className="flex items-center gap-3">
          <HcdcSchoolLogo className="w-20 h-20" />
        </div>

        {/* Center: Institutional Letterhead */}
        <div className="text-center px-4 flex-1">
          <div className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase font-serif">
            HOLY CROSS OF DAVAO COLLEGE, INC.
          </div>
          <div className="text-sm font-extrabold text-sky-900 tracking-wide uppercase">
            COLLEGE OF MARITIME EDUCATION (COME)
          </div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-0.5">
            Bachelor of Science in Marine Transportation (BSMT)
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Sta. Ana Avenue, Davao City, Philippines 8000
          </div>
        </div>

        {/* Right: Official COME Program Logo */}
        <div className="flex items-center gap-3">
          <ComeProgramLogo className="w-22 h-22" />
        </div>
      </div>
    );
  }

  // Default 'full' variant
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 text-white shadow-lg ${className}`}>
      <HcdcSchoolLogo className="w-16 h-16 sm:w-20 sm:h-20" />
      <div className="text-center sm:text-left space-y-1">
        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-900/60 px-2.5 py-0.5 rounded-full border border-sky-700/50">
          Official Institutional Examination Portal
        </span>
        <h2 className="text-lg sm:text-xl font-black tracking-wide uppercase font-serif text-white">
          Holy Cross of Davao College, Inc.
        </h2>
        <div className="text-sm font-bold text-sky-300">
          College of Maritime Education (COME)
        </div>
        <div className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2">
          <span className="font-semibold text-emerald-400">Program:</span>
          <span>Bachelor of Science in Marine Transportation (BSMT)</span>
        </div>
      </div>
      <ComeProgramLogo className="w-16 h-16 sm:w-20 sm:h-20" />
    </div>
  );
};
