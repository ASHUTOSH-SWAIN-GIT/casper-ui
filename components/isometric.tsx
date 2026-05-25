import type { ReactElement } from "react";

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

type Vec3 = [number, number, number];

function project([x, y, z]: Vec3, s: number): [number, number] {
  return [(x - y) * COS30 * s, -((x + y) * SIN30 * s) - z * s];
}

function p(points: [number, number][]): string {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

const SUBTLE_FILL = "var(--iso-fill)";
const STRONG_FILL = "var(--iso-fill-strong)";
const STROKE = "var(--iso-stroke)";
const STROKE_BRIGHT = "var(--iso-stroke-bright)";
const ACCENT = "var(--accent)";
const MUTED_TEXT = "var(--iso-text-muted)";
const BRIGHT_TEXT = "var(--iso-text)";

/* ---------- Floor grid ---------- */

function FloorGrid({
  x0,
  y0,
  cols,
  rows,
  s,
  opacity = 0.5,
}: {
  x0: number;
  y0: number;
  cols: number;
  rows: number;
  s: number;
  opacity?: number;
}) {
  const lines: ReactElement[] = [];
  // y-constant lines (x varies)
  for (let i = 0; i <= rows; i++) {
    const a = project([x0, y0 + i, 0], s);
    const b = project([x0 + cols, y0 + i, 0], s);
    lines.push(
      <line
        key={`r${i}`}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={STROKE}
        strokeWidth={0.5}
      />,
    );
  }
  // x-constant lines (y varies)
  for (let i = 0; i <= cols; i++) {
    const a = project([x0 + i, y0, 0], s);
    const b = project([x0 + i, y0 + rows, 0], s);
    lines.push(
      <line
        key={`c${i}`}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={STROKE}
        strokeWidth={0.5}
      />,
    );
  }
  return <g opacity={opacity}>{lines}</g>;
}

/* ---------- Iso panel (thin plate) ---------- */

type PanelProps = {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h?: number;
  s: number;
  fill?: string;
  stroke?: string;
  accent?: boolean;
  children?: React.ReactNode;
};

function Panel({
  x,
  y,
  z,
  w,
  d,
  h = 0.18,
  s,
  fill = SUBTLE_FILL,
  stroke = STROKE_BRIGHT,
  accent = false,
  children,
}: PanelProps) {
  const v = (vx: number, vy: number, vz: number) => project([vx, vy, vz], s);
  // top corners
  const A = v(x, y, z + h);
  const B = v(x + w, y, z + h);
  const C = v(x + w, y + d, z + h);
  const D = v(x, y + d, z + h);
  // bottom (only front-right edges show)
  const E = v(x + w, y + d, z);
  const F = v(x + w, y, z);
  const G = v(x, y + d, z);

  const accentStroke = accent ? ACCENT : stroke;

  return (
    <g>
      {/* Left thin face */}
      <polygon points={p([D, C, E, G])} fill={fill} stroke={accentStroke} strokeWidth={0.7} />
      {/* Right thin face */}
      <polygon points={p([B, C, E, F])} fill={fill} stroke={accentStroke} strokeWidth={0.7} />
      {/* Top */}
      <polygon points={p([A, B, C, D])} fill={fill} stroke={accentStroke} strokeWidth={0.8} />
      {children}
    </g>
  );
}

/* ---------- Surface helpers: things drawn on a panel's top face ---------- */

function SurfaceGrid({
  x,
  y,
  z,
  w,
  d,
  s,
  divisions = 4,
  opacity = 0.45,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  s: number;
  divisions?: number;
  opacity?: number;
}) {
  const lines: ReactElement[] = [];
  for (let i = 1; i < divisions; i++) {
    const t = (i / divisions) * w;
    const a = project([x + t, y, z], s);
    const b = project([x + t, y + d, z], s);
    lines.push(
      <line
        key={`gx${i}`}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={STROKE}
        strokeWidth={0.4}
      />,
    );
  }
  for (let i = 1; i < divisions; i++) {
    const t = (i / divisions) * d;
    const a = project([x, y + t, z], s);
    const b = project([x + w, y + t, z], s);
    lines.push(
      <line
        key={`gy${i}`}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={STROKE}
        strokeWidth={0.4}
      />,
    );
  }
  return <g opacity={opacity}>{lines}</g>;
}

/** Small iso block (like a 'chip' / resource) sitting on top of a panel. */
function Chip({
  x,
  y,
  z,
  size = 0.55,
  height = 0.35,
  s,
  label,
  accent = false,
}: {
  x: number;
  y: number;
  z: number;
  size?: number;
  height?: number;
  s: number;
  label?: string;
  accent?: boolean;
}) {
  const v = (vx: number, vy: number, vz: number) => project([vx, vy, vz], s);
  const A = v(x, y, z + height);
  const B = v(x + size, y, z + height);
  const C = v(x + size, y + size, z + height);
  const D = v(x, y + size, z + height);
  const E = v(x + size, y + size, z);
  const F = v(x + size, y, z);
  const G = v(x, y + size, z);
  const stroke = accent ? ACCENT : STROKE_BRIGHT;
  const fill = accent ? "var(--iso-accent-fill)" : "var(--iso-chip-fill)";
  // Center of top face for label
  const center = v(x + size / 2, y + size / 2, z + height);
  return (
    <g>
      <polygon points={p([D, C, E, G])} fill="var(--iso-chip-side)" stroke={stroke} strokeWidth={0.5} />
      <polygon points={p([B, C, E, F])} fill="var(--iso-chip-side)" stroke={stroke} strokeWidth={0.5} />
      <polygon points={p([A, B, C, D])} fill={fill} stroke={stroke} strokeWidth={0.6} />
      {label ? (
        <text
          x={center[0]}
          y={center[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={5}
          fontFamily="var(--font-mono), monospace"
          fill={accent ? "var(--iso-accent-text)" : MUTED_TEXT}
          style={{ letterSpacing: "0.05em" }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Node dot (graph node) on a surface, plus optional label. */
function Node({
  x,
  y,
  z,
  s,
  accent = false,
  r = 1.6,
}: {
  x: number;
  y: number;
  z: number;
  s: number;
  accent?: boolean;
  r?: number;
}) {
  const [cx, cy] = project([x, y, z], s);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.2} fill="var(--bg)" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={accent ? ACCENT : "var(--iso-node-fill)"}
        stroke={accent ? ACCENT : STROKE_BRIGHT}
        strokeWidth={0.6}
      />
    </g>
  );
}

/** Surface edge between two iso points on the same z. */
function Edge({
  a,
  b,
  s,
  accent = false,
  dash = false,
}: {
  a: Vec3;
  b: Vec3;
  s: number;
  accent?: boolean;
  dash?: boolean;
}) {
  const [ax, ay] = project(a, s);
  const [bx, by] = project(b, s);
  return (
    <line
      x1={ax}
      y1={ay}
      x2={bx}
      y2={by}
      stroke={accent ? ACCENT : STROKE_BRIGHT}
      strokeWidth={accent ? 1 : 0.7}
      strokeDasharray={dash ? "3 3" : undefined}
      opacity={accent ? 0.9 : 0.7}
      className={dash ? "dash-flow" : undefined}
    />
  );
}

/** Vertical flow line (between layers), with arrow head. */
function FlowLine({
  from,
  to,
  s,
  accent = true,
}: {
  from: Vec3;
  to: Vec3;
  s: number;
  accent?: boolean;
}) {
  const [ax, ay] = project(from, s);
  const [bx, by] = project(to, s);
  return (
    <g>
      <line
        x1={ax}
        y1={ay}
        x2={bx}
        y2={by}
        stroke={accent ? ACCENT : STROKE_BRIGHT}
        strokeWidth={1}
        strokeDasharray="3 4"
        className="dash-flow"
        opacity={0.85}
      />
      <circle cx={bx} cy={by} r={1.8} fill={accent ? ACCENT : STROKE_BRIGHT} />
      <circle cx={ax} cy={ay} r={1.8} fill={accent ? ACCENT : STROKE_BRIGHT} />
    </g>
  );
}

/** Label rendered along the iso x-axis (front-right). */
function EdgeLabel({
  at,
  text,
  axis = "x",
  s,
}: {
  at: Vec3;
  text: string;
  axis?: "x" | "y";
  s: number;
}) {
  const [tx, ty] = project(at, s);
  // x-axis goes down-right (+cos30, +sin30), y-axis goes down-left (-cos30, +sin30)
  const rotate = axis === "x" ? 30 : -30;
  return (
    <text
      x={tx}
      y={ty}
      transform={`rotate(${rotate} ${tx} ${ty})`}
      fontSize={5.2}
      fontFamily="var(--font-mono), monospace"
      fill={MUTED_TEXT}
      style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
    >
      {text}
    </text>
  );
}

/* ============================================================== */
/*                       Composed scenes                          */
/* ============================================================== */

/**
 * Hero scene: three stacked isometric panels showing Casper's data flow
 *   z=0:   AWS · live  (with resource chips)
 *   z=2.2: Terraform · state graph (with node graph)
 *   z=4.4: MCP · agent (single highlighted accent node)
 * Vertical dashed flow lines connect them (read-only context flowing up).
 */
export function IsoArchHero({ className = "" }: { className?: string }) {
  const s = 22;

  // Panel dimensions: bottom larger than top to create a "stack of platforms" feel
  const P1 = { x: 0, y: 0, z: 0, w: 5, d: 5 }; // AWS
  const P2 = { x: 0.7, y: 0.7, z: 2.4, w: 3.6, d: 3.6 }; // Terraform
  const P3 = { x: 1.6, y: 1.6, z: 4.8, w: 1.8, d: 1.8 }; // MCP

  // Resource chips (AWS layer) — 6 small chips at varied positions
  const awsChips: Array<{ x: number; y: number; label: string; accent?: boolean }> = [
    { x: 0.4, y: 0.4, label: "S3" },
    { x: 1.6, y: 0.5, label: "EC2", accent: true },
    { x: 3.0, y: 0.4, label: "λ" },
    { x: 0.5, y: 1.8, label: "RDS" },
    { x: 2.4, y: 2.0, label: "IAM" },
    { x: 3.8, y: 1.7, label: "VPC", accent: true },
    { x: 1.2, y: 3.4, label: "SG" },
    { x: 3.2, y: 3.4, label: "ALB" },
  ];

  // Terraform graph nodes on P2's top
  const tfNodes: Array<{ x: number; y: number; accent?: boolean }> = [
    { x: 1.1, y: 1.1 },
    { x: 2.1, y: 1.1, accent: true },
    { x: 3.1, y: 1.1 },
    { x: 1.5, y: 2.2, accent: true },
    { x: 2.7, y: 2.2 },
    { x: 1.2, y: 3.3 },
    { x: 3.0, y: 3.3, accent: true },
    { x: 2.1, y: 3.6 },
  ];
  const tfEdges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 7],
  ];

  // Center points (top surface) of each panel for flow lines
  const c1Top: Vec3 = [P1.x + P1.w / 2, P1.y + P1.d / 2, P1.z + 0.18];
  const c2Bottom: Vec3 = [P2.x + P2.w / 2, P2.y + P2.d / 2, P2.z];
  const c2Top: Vec3 = [P2.x + P2.w / 2, P2.y + P2.d / 2, P2.z + 0.18];
  const c3Bottom: Vec3 = [P3.x + P3.w / 2, P3.y + P3.d / 2, P3.z];

  // ViewBox — compute generous bounds
  const projAll = [
    project([P1.x, P1.y + P1.d, 0], s),
    project([P1.x + P1.w, P1.y, 0], s),
    project([P3.x, P3.y, P3.z + 1.2], s),
    project([P3.x + P3.w, P3.y, P3.z + 1.2], s),
    project([P1.x, P1.y, 0], s),
    project([P1.x + P1.w, P1.y + P1.d, 0], s),
  ];
  const xs = projAll.map((p) => p[0]);
  const ys = projAll.map((p) => p[1]);
  const minX = Math.min(...xs) - 22;
  const maxX = Math.max(...xs) + 60; // extra room for edge labels
  const minY = Math.min(...ys) - 28;
  const maxY = Math.max(...ys) + 22;

  return (
    <svg
      className={className}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-floor-glow" cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor glow */}
      <ellipse
        cx={project([P1.x + P1.w / 2, P1.y + P1.d / 2, 0], s)[0]}
        cy={project([P1.x + P1.w / 2, P1.y + P1.d / 2, 0], s)[1] + 20}
        rx={(P1.w + 2) * COS30 * s}
        ry={(P1.d + 1) * SIN30 * s}
        fill="url(#hero-floor-glow)"
        opacity={0.9}
      />

      {/* Ground grid (extends beyond panels) */}
      <FloorGrid x0={-1.5} y0={-1.5} cols={8} rows={8} s={s} opacity={0.35} />

      {/* ----- Layer 1: AWS panel ----- */}
      <Panel {...P1} s={s}>
        <SurfaceGrid x={P1.x} y={P1.y} z={P1.z + 0.18} w={P1.w} d={P1.d} s={s} divisions={5} />
        {awsChips.map((c, i) => (
          <Chip
            key={i}
            x={P1.x + c.x}
            y={P1.y + c.y}
            z={P1.z + 0.18}
            s={s}
            label={c.label}
            accent={c.accent}
          />
        ))}
      </Panel>
      <EdgeLabel
        at={[P1.x + P1.w + 0.1, P1.y - 0.05, P1.z]}
        text="AWS · LIVE"
        axis="x"
        s={s}
      />

      {/* Flow line: AWS → Terraform */}
      <FlowLine from={c1Top} to={c2Bottom} s={s} />

      {/* ----- Layer 2: Terraform panel ----- */}
      <Panel {...P2} s={s}>
        {/* Edges between nodes (drawn before nodes so dots sit on top) */}
        <g>
          {tfEdges.map(([a, b], i) => {
            const na = tfNodes[a];
            const nb = tfNodes[b];
            const accent = na.accent && nb.accent;
            return (
              <Edge
                key={i}
                a={[P2.x + na.x, P2.y + na.y, P2.z + 0.18] as Vec3}
                b={[P2.x + nb.x, P2.y + nb.y, P2.z + 0.18] as Vec3}
                s={s}
                accent={accent}
                dash={accent}
              />
            );
          })}
        </g>
        {tfNodes.map((n, i) => (
          <Node
            key={i}
            x={P2.x + n.x}
            y={P2.y + n.y}
            z={P2.z + 0.18}
            s={s}
            accent={n.accent}
          />
        ))}
      </Panel>
      <EdgeLabel
        at={[P2.x + P2.w + 0.1, P2.y - 0.05, P2.z]}
        text="TERRAFORM · STATE"
        axis="x"
        s={s}
      />

      {/* Flow line: Terraform → MCP */}
      <FlowLine from={c2Top} to={c3Bottom} s={s} />

      {/* ----- Layer 3: MCP agent panel ----- */}
      <Panel {...P3} s={s} accent>
        {/* Subtle inner outline */}
        <SurfaceGrid x={P3.x} y={P3.y} z={P3.z + 0.18} w={P3.w} d={P3.d} s={s} divisions={2} opacity={0.35} />
        {/* Central accent node — the agent */}
        <Node
          x={P3.x + P3.w / 2}
          y={P3.y + P3.d / 2}
          z={P3.z + 0.18}
          s={s}
          accent
          r={3}
        />
        {/* Small connector ticks */}
        {[
          [0.2, P3.d / 2],
          [P3.w - 0.2, P3.d / 2],
          [P3.w / 2, 0.2],
          [P3.w / 2, P3.d - 0.2],
        ].map(([dx, dy], i) => (
          <Edge
            key={i}
            a={[P3.x + P3.w / 2, P3.y + P3.d / 2, P3.z + 0.18] as Vec3}
            b={[P3.x + dx, P3.y + dy, P3.z + 0.18] as Vec3}
            s={s}
            accent
          />
        ))}
      </Panel>
      <EdgeLabel
        at={[P3.x + P3.w + 0.1, P3.y - 0.05, P3.z]}
        text="MCP · AGENT"
        axis="x"
        s={s}
      />
    </svg>
  );
}

/* ---------- Section illustrations ---------- */

/** Plate with a magnifier ring on one accent chip (find_resource). */
export function IsoSearchPanel({ className = "" }: { className?: string }) {
  const s = 26;
  const P = { x: 0, y: 0, z: 0, w: 3, d: 3 };
  const chips = [
    { x: 0.3, y: 0.3, label: "S3" },
    { x: 1.3, y: 0.3, label: "EC2", accent: true },
    { x: 2.3, y: 0.3, label: "λ" },
    { x: 0.3, y: 1.3, label: "SG" },
    { x: 1.3, y: 1.3, label: "VPC" },
    { x: 2.3, y: 1.3, label: "RDS" },
    { x: 0.3, y: 2.3, label: "IAM" },
    { x: 1.3, y: 2.3, label: "ALB" },
    { x: 2.3, y: 2.3, label: "KMS" },
  ];
  const target = chips[1];
  const [tx, ty] = project([P.x + target.x + 0.28, P.y + target.y + 0.28, P.z + 0.55] as Vec3, s);

  return (
    <Frame s={s} P={P} className={className} extraRight={20} extraTop={28}>
      <SurfaceGrid x={P.x} y={P.y} z={P.z + 0.18} w={P.w} d={P.d} s={s} divisions={3} />
      <Panel {...P} s={s}>
        {chips.map((c, i) => (
          <Chip
            key={i}
            x={P.x + c.x}
            y={P.y + c.y}
            z={P.z + 0.18}
            s={s}
            label={c.label}
            accent={c.accent}
          />
        ))}
      </Panel>
      {/* Magnifier ring on the accent chip */}
      <g>
        <circle cx={tx} cy={ty - 8} r={9} fill="none" stroke={ACCENT} strokeWidth={1.4} />
        <line
          x1={tx + 7}
          y1={ty - 2}
          x2={tx + 14}
          y2={ty + 6}
          stroke={ACCENT}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </g>
    </Frame>
  );
}

/** Two stacked plates with a dashed flow arrow between them (simulate_impact). */
export function IsoSimulatePanel({ className = "" }: { className?: string }) {
  const s = 26;
  const P1 = { x: 0, y: 0, z: 0, w: 3, d: 3 }; // current
  const P2 = { x: 0, y: 0, z: 2.2, w: 3, d: 3 }; // proposed

  return (
    <Frame s={s} P={P1} className={className} extraTop={64} extraRight={10}>
      <Panel {...P1} s={s}>
        <SurfaceGrid x={P1.x} y={P1.y} z={P1.z + 0.18} w={P1.w} d={P1.d} s={s} divisions={3} />
        <Chip x={0.3} y={0.3} z={0.18} s={s} label="A" />
        <Chip x={1.3} y={0.3} z={0.18} s={s} label="B" />
        <Chip x={2.3} y={0.3} z={0.18} s={s} label="C" />
        <Chip x={0.3} y={1.3} z={0.18} s={s} label="D" />
        <Chip x={1.3} y={1.3} z={0.18} s={s} label="E" />
        <Chip x={2.3} y={1.3} z={0.18} s={s} label="F" />
      </Panel>
      <Panel {...P2} s={s} accent>
        <SurfaceGrid x={P2.x} y={P2.y} z={P2.z + 0.18} w={P2.w} d={P2.d} s={s} divisions={3} />
        <Chip x={0.3} y={0.3} z={2.2 + 0.18} s={s} label="A" />
        <Chip x={1.3} y={0.3} z={2.2 + 0.18} s={s} label="B+" accent />
        <Chip x={2.3} y={0.3} z={2.2 + 0.18} s={s} label="C" />
        <Chip x={0.3} y={1.3} z={2.2 + 0.18} s={s} label="D" />
        <Chip x={1.3} y={1.3} z={2.2 + 0.18} s={s} label="E*" accent />
        <Chip x={2.3} y={1.3} z={2.2 + 0.18} s={s} label="F" />
      </Panel>
      <FlowLine
        from={[P1.x + P1.w / 2, P1.y + P1.d / 2, P1.z + 0.18]}
        to={[P2.x + P2.w / 2, P2.y + P2.d / 2, P2.z]}
        s={s}
      />
    </Frame>
  );
}

/** Two side-by-side plates, one taller (drift). */
export function IsoDriftPanel({ className = "" }: { className?: string }) {
  const s = 26;
  const left = { x: 0, y: 0, z: 0, w: 1.6, d: 1.6 };
  const right = { x: 2.6, y: 0, z: 0, w: 1.6, d: 1.6 };

  return (
    <Frame s={s} P={{ x: 0, y: 0, z: 0, w: 4.2, d: 1.6 }} className={className} extraTop={64} extraRight={20}>
      {/* Left tower: tf state (3 layers) */}
      {[0, 1, 2].map((i) => (
        <Panel
          key={`l${i}`}
          {...left}
          z={i * 0.6}
          s={s}
        />
      ))}
      <EdgeLabel at={[left.x + left.w + 0.1, left.y - 0.05, 0]} text="TF" axis="x" s={s} />

      {/* Right tower: aws live (4 layers, top is accent — drift!) */}
      {[0, 1, 2, 3].map((i) => (
        <Panel
          key={`r${i}`}
          {...right}
          z={i * 0.6}
          s={s}
          accent={i === 3}
        />
      ))}
      <EdgeLabel at={[right.x + right.w + 0.1, right.y - 0.05, 0]} text="AWS" axis="x" s={s} />

      {/* Arrow indicating drift */}
      {(() => {
        const a = project([left.x + left.w + 0.1, left.y + left.d / 2, 1.9] as Vec3, s);
        const b = project([right.x - 0.1, right.y + right.d / 2, 1.9] as Vec3, s);
        return (
          <g>
            <line
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={ACCENT}
              strokeWidth={1.2}
              strokeDasharray="3 3"
              className="dash-flow"
            />
            <polygon
              points={`${b[0]},${b[1]} ${b[0] - 5},${b[1] - 3} ${b[0] - 5},${b[1] + 3}`}
              fill={ACCENT}
            />
          </g>
        );
      })()}
    </Frame>
  );
}

/** Plate with a shield-checkmark hovering above (policy). */
export function IsoPolicyPanel({ className = "" }: { className?: string }) {
  const s = 26;
  const P = { x: 0, y: 0, z: 0, w: 2.6, d: 2.6 };
  return (
    <Frame s={s} P={P} className={className} extraTop={70} extraRight={20}>
      <Panel {...P} s={s}>
        <SurfaceGrid x={P.x} y={P.y} z={P.z + 0.18} w={P.w} d={P.d} s={s} divisions={3} />
        <Chip x={0.3} y={0.3} z={0.18} s={s} label="EC2" />
        <Chip x={1.3} y={0.3} z={0.18} s={s} label="S3" accent />
        <Chip x={0.3} y={1.3} z={0.18} s={s} label="RDS" />
        <Chip x={1.3} y={1.3} z={0.18} s={s} label="IAM" />
      </Panel>
      {/* Floating shield */}
      {(() => {
        const [cx, cy] = project([P.x + P.w / 2, P.y + P.d / 2, P.z + 1.6] as Vec3, s);
        const sx = 12;
        return (
          <g>
            <path
              d={`M${cx},${cy - sx} L${cx + sx * 0.8},${cy - sx * 0.4} L${cx + sx * 0.8},${cy + sx * 0.3} Q${cx + sx * 0.8},${cy + sx} ${cx},${cy + sx * 1.2} Q${cx - sx * 0.8},${cy + sx} ${cx - sx * 0.8},${cy + sx * 0.3} L${cx - sx * 0.8},${cy - sx * 0.4} Z`}
              fill="var(--iso-accent-fill)"
              stroke={ACCENT}
              strokeWidth={1}
            />
            <path
              d={`M${cx - 4},${cy + 1} L${cx - 1},${cy + 4} L${cx + 5},${cy - 3}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* dashed link from shield to panel */}
            <line
              x1={cx}
              y1={cy + sx * 1.3}
              x2={project([P.x + P.w / 2, P.y + P.d / 2, P.z + 0.18] as Vec3, s)[0]}
              y2={project([P.x + P.w / 2, P.y + P.d / 2, P.z + 0.18] as Vec3, s)[1]}
              stroke={ACCENT}
              strokeWidth={0.8}
              strokeDasharray="2 3"
              opacity={0.6}
            />
          </g>
        );
      })()}
    </Frame>
  );
}

/** Single plate with read-only "eye" overlay. */
export function IsoReadonlyPanel({ className = "" }: { className?: string }) {
  const s = 26;
  const P = { x: 0, y: 0, z: 0, w: 2.6, d: 2.6 };
  return (
    <Frame s={s} P={P} className={className} extraTop={20} extraRight={20}>
      <Panel {...P} s={s}>
        <SurfaceGrid x={P.x} y={P.y} z={P.z + 0.18} w={P.w} d={P.d} s={s} divisions={3} />
        <Node x={0.6} y={0.6} z={0.18} s={s} />
        <Node x={1.7} y={0.6} z={0.18} s={s} accent />
        <Node x={2.0} y={1.7} z={0.18} s={s} />
        <Node x={0.7} y={1.9} z={0.18} s={s} />
        <Edge a={[0.6, 0.6, 0.18]} b={[1.7, 0.6, 0.18]} s={s} accent />
        <Edge a={[1.7, 0.6, 0.18]} b={[2.0, 1.7, 0.18]} s={s} />
        <Edge a={[0.6, 0.6, 0.18]} b={[0.7, 1.9, 0.18]} s={s} />
      </Panel>
      {/* Eye glyph at top-right */}
      {(() => {
        const [cx, cy] = project([P.x + P.w - 0.3, P.y + 0.2, P.z + 1.0] as Vec3, s);
        return (
          <g stroke={ACCENT} strokeWidth={1.1} fill="none">
            <path d={`M${cx - 9},${cy} Q${cx},${cy - 6} ${cx + 9},${cy} Q${cx},${cy + 6} ${cx - 9},${cy} Z`} />
            <circle cx={cx} cy={cy} r={2.4} fill={ACCENT} />
          </g>
        );
      })()}
    </Frame>
  );
}

/** Small tile suitable for "what it does" cards: stack of layers with rising flow. */
export function IsoFlowTile({ className = "" }: { className?: string }) {
  const s = 24;
  const P1 = { x: 0, y: 0, z: 0, w: 2.4, d: 2.4 };
  const P2 = { x: 0.4, y: 0.4, z: 1.4, w: 1.6, d: 1.6 };
  const P3 = { x: 0.7, y: 0.7, z: 2.7, w: 1.0, d: 1.0 };
  return (
    <Frame s={s} P={P1} className={className} extraTop={36} extraRight={12}>
      <Panel {...P1} s={s} />
      <FlowLine
        from={[P1.x + P1.w / 2, P1.y + P1.d / 2, 0.18]}
        to={[P2.x + P2.w / 2, P2.y + P2.d / 2, P2.z]}
        s={s}
      />
      <Panel {...P2} s={s} />
      <FlowLine
        from={[P2.x + P2.w / 2, P2.y + P2.d / 2, P2.z + 0.18]}
        to={[P3.x + P3.w / 2, P3.y + P3.d / 2, P3.z]}
        s={s}
      />
      <Panel {...P3} s={s} accent />
    </Frame>
  );
}

/** Small tile: graph of resources. */
export function IsoGraphTile({ className = "" }: { className?: string }) {
  const s = 24;
  const P = { x: 0, y: 0, z: 0, w: 3, d: 3 };
  const nodes = [
    { x: 0.5, y: 0.5 },
    { x: 1.5, y: 0.6, accent: true },
    { x: 2.5, y: 0.7 },
    { x: 0.7, y: 1.8 },
    { x: 2.2, y: 1.7, accent: true },
    { x: 1.4, y: 2.6 },
  ];
  const edges: Array<[number, number, boolean?]> = [
    [0, 1, false],
    [1, 2, false],
    [0, 3, false],
    [1, 4, true],
    [3, 5, false],
    [4, 5, false],
  ];
  return (
    <Frame s={s} P={P} className={className} extraTop={20} extraRight={14}>
      <Panel {...P} s={s}>
        <SurfaceGrid x={P.x} y={P.y} z={0.18} w={P.w} d={P.d} s={s} divisions={3} />
        {edges.map(([a, b, accent], i) => (
          <Edge
            key={i}
            a={[nodes[a].x, nodes[a].y, 0.18]}
            b={[nodes[b].x, nodes[b].y, 0.18]}
            s={s}
            accent={accent}
            dash={accent}
          />
        ))}
        {nodes.map((n, i) => (
          <Node key={i} x={n.x} y={n.y} z={0.18} s={s} accent={n.accent} />
        ))}
      </Panel>
    </Frame>
  );
}

/** Small tile: stack of resource chips like a circuit board. */
export function IsoBoardTile({ className = "" }: { className?: string }) {
  const s = 24;
  const P = { x: 0, y: 0, z: 0, w: 3, d: 3 };
  return (
    <Frame s={s} P={P} className={className} extraTop={20} extraRight={14}>
      <Panel {...P} s={s}>
        <SurfaceGrid x={P.x} y={P.y} z={0.18} w={P.w} d={P.d} s={s} divisions={3} />
        <Chip x={0.3} y={0.3} z={0.18} s={s} label="S3" />
        <Chip x={1.3} y={0.3} z={0.18} s={s} label="λ" accent />
        <Chip x={2.3} y={0.3} z={0.18} s={s} label="EC2" />
        <Chip x={0.3} y={1.3} z={0.18} s={s} label="SG" />
        <Chip x={1.3} y={1.3} z={0.18} s={s} label="VPC" accent />
        <Chip x={2.3} y={1.3} z={0.18} s={s} label="RDS" />
        <Chip x={0.3} y={2.3} z={0.18} s={s} label="IAM" />
        <Chip x={1.3} y={2.3} z={0.18} s={s} label="ALB" />
        <Chip x={2.3} y={2.3} z={0.18} s={s} label="KMS" />
      </Panel>
    </Frame>
  );
}

/* ---------- Frame: shared SVG envelope with sensible bounds ---------- */

function Frame({
  s,
  P,
  className = "",
  extraTop = 8,
  extraRight = 8,
  children,
}: {
  s: number;
  P: { x: number; y: number; z: number; w: number; d: number };
  className?: string;
  extraTop?: number;
  extraRight?: number;
  children: React.ReactNode;
}) {
  const corners = [
    project([P.x, P.y, P.z], s),
    project([P.x + P.w, P.y, P.z], s),
    project([P.x + P.w, P.y + P.d, P.z], s),
    project([P.x, P.y + P.d, P.z], s),
    project([P.x, P.y, P.z + 1], s),
    project([P.x + P.w, P.y + P.d, P.z + 3.5], s), // generous top
  ];
  const xs = corners.map((p) => p[0]);
  const ys = corners.map((p) => p[1]);
  const minX = Math.min(...xs) - 6;
  const maxX = Math.max(...xs) + extraRight;
  const minY = Math.min(...ys) - extraTop;
  const maxY = Math.max(...ys) + 6;

  return (
    <svg
      className={className}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
