export function GraphSvg() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-auto"
      role="img"
      aria-label="Terraform resource graph"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edge" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#ff8a3d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <g stroke="url(#edge)" strokeWidth="1.25" fill="none">
        <line x1="120" y1="80" x2="300" y2="160" />
        <line x1="120" y1="240" x2="300" y2="160" />
        <line x1="300" y1="160" x2="480" y2="80" />
        <line x1="300" y1="160" x2="480" y2="240" />
        <line x1="120" y1="80" x2="120" y2="240" />
        <line x1="480" y1="80" x2="480" y2="240" />
      </g>

      <g stroke="#ff8a3d" strokeWidth="1.5" fill="none" className="dash-flow" opacity="0.7">
        <line x1="300" y1="160" x2="480" y2="80" />
        <line x1="120" y1="240" x2="300" y2="160" />
      </g>

      {[
        { x: 120, y: 80, label: "vpc" },
        { x: 120, y: 240, label: "subnet" },
        { x: 300, y: 160, label: "rds" },
        { x: 480, y: 80, label: "iam_role" },
        { x: 480, y: 240, label: "s3" },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="28" fill="url(#nodeGlow)" />
          <circle
            cx={n.x}
            cy={n.y}
            r="10"
            fill="#000"
            stroke="#ff8a3d"
            strokeWidth="1.5"
          />
          <circle cx={n.x} cy={n.y} r="3" fill="#ff8a3d" />
          <text
            x={n.x}
            y={n.y + 30}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="11"
            fill="#a3a3a3"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
