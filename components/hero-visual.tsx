export function HeroVisual() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden border border-black/10 bg-white">
      <div className="absolute inset-0 grid-bg opacity-80" />

      <svg
        viewBox="0 0 500 400"
        className="relative w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#0f766e" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#0f766e" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <circle cx="250" cy="200" r="120" fill="url(#hubGlow)" />

        <g
          stroke="#0f766e"
          strokeWidth="1.25"
          fill="none"
          className="dash-flow"
          opacity="0.75"
        >
          <path d="M 90 90 Q 170 140 235 195" />
          <path d="M 90 200 Q 160 200 235 200" />
          <path d="M 90 310 Q 170 260 235 205" />
        </g>

        <g
          stroke="#0f766e"
          strokeWidth="1.25"
          fill="none"
          className="dash-flow"
          opacity="0.75"
          style={{ animationDirection: "reverse" } as React.CSSProperties}
        >
          <path d="M 265 195 Q 340 140 410 100" />
          <path d="M 265 200 Q 340 200 410 200" />
          <path d="M 265 205 Q 340 260 410 300" />
        </g>

        <g stroke="url(#lineGrad)" strokeWidth="1" fill="none" opacity="0.5">
          <path d="M 90 90 Q 170 140 235 195" />
          <path d="M 90 200 Q 160 200 235 200" />
          <path d="M 90 310 Q 170 260 235 205" />
          <path d="M 265 195 Q 340 140 410 100" />
          <path d="M 265 200 Q 340 200 410 200" />
          <path d="M 265 205 Q 340 260 410 300" />
        </g>

        <g>
          <AgentNode x={70} y={90} label="claude" />
          <AgentNode x={70} y={200} label="cursor" />
          <AgentNode x={70} y={310} label="codex" />
        </g>

        <g>
          <circle
            cx="250"
            cy="200"
            r="38"
            fill="white"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          <circle
            cx="250"
            cy="200"
            r="38"
            fill="none"
            stroke="#0f766e"
            strokeWidth="1.5"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="38;58;38"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="250" cy="200" r="6" fill="#0f766e" className="dot-pulse" />
          <text
            x="250"
            y="258"
            textAnchor="middle"
            className="font-mono"
            fontSize="11"
            fill="#0a0a0a"
            fontWeight="500"
          >
            casper · mcp
          </text>
        </g>

        <g>
          <InfraNode x={410} y={100} label=".tf" />
          <InfraNode x={430} y={200} label="aws" />
          <InfraNode x={410} y={300} label="state" />

          <g stroke="#0a0a0a" strokeWidth="0.75" opacity="0.25" fill="none">
            <line x1="410" y1="100" x2="430" y2="200" />
            <line x1="430" y1="200" x2="410" y2="300" />
            <line x1="410" y1="100" x2="410" y2="300" />
          </g>
        </g>
      </svg>

      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between border-t border-black/10 bg-white/90 px-4 py-2 font-mono text-[11px] text-black/55 backdrop-blur">
        <span>agents</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[var(--accent)] dot-pulse" />
          live
        </span>
        <span>infrastructure</span>
      </div>
    </div>
  );
}

function AgentNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 28}
        y={y - 14}
        width="56"
        height="28"
        rx="6"
        fill="white"
        stroke="#d8d8d8"
        strokeWidth="1"
      />
      <circle cx={x - 16} cy={y} r="3" fill="#0f766e" className="dot-pulse" />
      <text
        x={x + 2}
        y={y + 3.5}
        textAnchor="middle"
        className="font-mono"
        fontSize="10"
        fill="#0a0a0a"
      >
        {label}
      </text>
    </g>
  );
}

function InfraNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="18"
        fill="white"
        stroke="#0a0a0a"
        strokeOpacity="0.24"
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        className="font-mono"
        fontSize="10"
        fill="#0a0a0a"
      >
        {label}
      </text>
    </g>
  );
}
