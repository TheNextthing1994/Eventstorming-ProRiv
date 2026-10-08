import React from 'react';

/**
 * Pixel-precise vector rendering of the user's original handwritten/technical sketch.
 * Rendered at 1200 x 1100 viewBox so it stays crystal clear at any zoom level,
 * perfectly faithful to the original image uploaded by the user.
 */
export const SketchVectorFallback: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 1100"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Original-Projektskizze mit 5 roten Kreisen und 1 grünen Kreis auf Millimeterpapier"
    >
      <defs>
        {/* Subtle graph paper pattern identical to original sketch */}
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dff0df" strokeWidth="0.8" />
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cde2cd" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* Background paper with faint millimeter grid */}
      <rect width="1200" height="1100" fill="#fcfdfc" />
      <rect width="1200" height="1100" fill="url(#grid)" />

      {/* Top dashed alignment guideline from original sketch */}
      <line
        x1="0"
        y1="130"
        x2="1200"
        y2="130"
        stroke="#9fa8a0"
        strokeWidth="1.2"
        strokeDasharray="5,5"
      />

      {/* 1. GREEN CIRCLE (Top center) - MOBILE APP */}
      <g>
        <circle
          cx="572"
          cy="198"
          r="162"
          fill="#d8ead8"
          stroke="#7ca970"
          strokeWidth="2"
        />
        <text
          x="572"
          y="160"
          textAnchor="middle"
          fill="#1c2b1d"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="17"
          letterSpacing="0.5"
        >
          MOBILE APP
        </text>
        <text
          x="572"
          y="184"
          textAnchor="middle"
          fill="#1c2b1d"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="15"
          letterSpacing="0.3"
        >
          REACT NATIVE
        </text>
        <text
          x="572"
          y="222"
          textAnchor="middle"
          fill="#1c2b1d"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="15"
          letterSpacing="0.3"
        >
          AWS COGNITO
        </text>
        <text
          x="572"
          y="244"
          textAnchor="middle"
          fill="#1c2b1d"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="15"
          letterSpacing="0.3"
        >
          AWS STORAGE S3
        </text>
      </g>

      {/* 2. RED CIRCLE (Left Middle) - USERS */}
      <g>
        <circle
          cx="274"
          cy="435"
          r="162"
          fill="#f8cecc"
          stroke="#b85450"
          strokeWidth="2"
        />
        <text
          x="274"
          y="390"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="17"
          letterSpacing="0.5"
        >
          USERS
        </text>
        <text
          x="274"
          y="428"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Skolko typov polzovoteley ?
        </text>
        <text
          x="274"
          y="450"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kto otvechaet za chto?
        </text>
        <text
          x="274"
          y="470"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kakaya u nix vzaimosvyaz'?
        </text>
        <text
          x="274"
          y="506"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kto imeet pravo na chto ?
        </text>
      </g>

      {/* 3. RED CIRCLE (Bottom Left) - KLIENTS */}
      <g>
        <circle
          cx="252"
          cy="812"
          r="162"
          fill="#f8cecc"
          stroke="#b85450"
          strokeWidth="2"
        />
        <text
          x="252"
          y="758"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="17"
          letterSpacing="0.5"
        >
          KLIENTS
        </text>
        <text
          x="252"
          y="795"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="15"
        >
          Kakie info ?
        </text>
        <text
          x="252"
          y="817"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="15"
        >
          Obekti ?
        </text>
        <text
          x="252"
          y="837"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="15"
        >
          Type obektov
        </text>
        <text
          x="252"
          y="876"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="15"
        >
          Statusi obektov ?
        </text>
      </g>

      {/* 4. RED CIRCLE (Center) - RAPORT */}
      <g>
        <circle
          cx="586"
          cy="622"
          r="162"
          fill="#f8cecc"
          stroke="#b85450"
          strokeWidth="2"
        />
        <text
          x="586"
          y="520"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="17"
          letterSpacing="0.5"
        >
          RAPORT
        </text>
        <text
          x="586"
          y="556"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Kak imenno sozdayom ?
        </text>
        <text
          x="586"
          y="576"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Ktom imeet dostup ?
        </text>
        <text
          x="586"
          y="596"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Mojno li izmenit'?
        </text>
        <text
          x="586"
          y="616"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Statusi ?
        </text>
        <text
          x="586"
          y="636"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Type?
        </text>

        <text
          x="586"
          y="672"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Kuda otpravlyaem ?
        </text>
        <text
          x="586"
          y="692"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Kak obnovlyaetsya ?
        </text>
        <text
          x="586"
          y="728"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          FOTO, kakie faili ?
        </text>
      </g>

      {/* 5. RED CIRCLE (Top Right) - VREMYA */}
      <g>
        <circle
          cx="878"
          cy="374"
          r="162"
          fill="#f8cecc"
          stroke="#b85450"
          strokeWidth="2"
        />
        <text
          x="878"
          y="336"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="17"
          letterSpacing="0.5"
        >
          VREMYA
        </text>
        <text
          x="878"
          y="370"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kto zapisivaet vremya ?
        </text>
        <text
          x="878"
          y="392"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kakie uslovie ?
        </text>
        <text
          x="878"
          y="428"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Kak rabotayut drugie programmi ?
        </text>
        <text
          x="878"
          y="450"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Geolokaciya obyazatelna ?
        </text>
      </g>

      {/* 6. RED CIRCLE (Bottom Right) - API */}
      <g>
        <circle
          cx="930"
          cy="742"
          r="162"
          fill="#f8cecc"
          stroke="#b85450"
          strokeWidth="2"
        />
        <text
          x="930"
          y="712"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="15"
          letterSpacing="0.2"
        >
          API, chto kuda otpravlyaem ?
        </text>
        <text
          x="930"
          y="742"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14.5"
        >
          Nujna li synxranizaciya ?
        </text>
        <text
          x="930"
          y="772"
          textAnchor="middle"
          fill="#321616"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="14"
        >
          Chto nujno obnovit kogda vse zakonchilos?
        </text>
      </g>
    </svg>
  );
};
