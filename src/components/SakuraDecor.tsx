/** Hand-set decorative sakura motifs. Pure visual garnish — never
 * carries page content, so it stays free of text. */

export function SakuraBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M232 12c-30 36-46 70-52 108-7 44 2 92 26 150"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M180 120c-18-8-34-8-48 2M196 168c-20-4-36 0-48 14M210 216c-22-2-38 6-48 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {[
        { x: 150, y: 108, r: 15, rot: -8 },
        { x: 118, y: 116, r: 12, rot: 20 },
        { x: 158, y: 156, r: 17, rot: 4 },
        { x: 122, y: 172, r: 11, rot: -14 },
        { x: 172, y: 206, r: 14, rot: 12 },
        { x: 138, y: 226, r: 10, rot: -6 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx={0}
              cy={-b.r}
              rx={b.r * 0.62}
              ry={b.r}
              fill="currentColor"
              opacity="0.9"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r={b.r * 0.32} fill="currentColor" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

export function PetalDrift({ className = "" }: { className?: string }) {
  const petals = [
    { top: "8%", left: "12%", size: 16, delay: "0s", dur: "14s" },
    { top: "22%", left: "82%", size: 10, delay: "2s", dur: "11s" },
    { top: "55%", left: "6%", size: 12, delay: "4s", dur: "16s" },
    { top: "70%", left: "88%", size: 14, delay: "1s", dur: "13s" },
    { top: "38%", left: "48%", size: 9, delay: "3s", dur: "18s" },
  ];
  return (
    <div className={`petal-drift ${className}`} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

export function CornerBlossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <g transform="translate(60 60)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx={0}
            cy={-34}
            rx={20}
            ry={34}
            fill="currentColor"
            opacity="0.85"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r={12} fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  );
}

function MiniBlossom() {
  return (
    <svg viewBox="0 0 60 60" fill="none" width="100%" height="100%">
      <g transform="translate(30 30)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx={0}
            cy={-17}
            rx={10}
            ry={17}
            fill="currentColor"
            opacity="0.85"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r={6} fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  );
}

/** A scattering of small blossoms that gently bob and turn in place —
 * an ambient accent distinct from the falling PetalDrift. */
export function FloatingBlossoms({ className = "" }: { className?: string }) {
  const blossoms = [
    { top: "10%", left: "5%", size: 24, tone: "sakura", delay: "0s", dur: "7s" },
    { top: "72%", left: "9%", size: 18, tone: "lavender", delay: "1.4s", dur: "9s" },
    { top: "16%", left: "92%", size: 20, tone: "lavender", delay: "0.7s", dur: "8s" },
    { top: "82%", left: "90%", size: 26, tone: "sakura", delay: "2.1s", dur: "10s" },
    { top: "46%", left: "50%", size: 15, tone: "sakura", delay: "2.8s", dur: "6.5s" },
  ];
  return (
    <div className={`floating-blossoms ${className}`} aria-hidden="true">
      {blossoms.map((b, i) => (
        <span
          key={i}
          className={`floating-blossom floating-blossom--${b.tone}`}
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        >
          <MiniBlossom />
        </span>
      ))}
    </div>
  );
}
