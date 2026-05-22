import { IsoArchHero } from "./isometric";

export function HeroVisual() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-12 -z-10 opacity-80 [background:radial-gradient(60%_50%_at_60%_55%,var(--accent-glow),transparent_70%)]" />

      <div className="relative">
        <IsoArchHero className="w-full h-auto" />

        {/* Telemetry chips overlaid on the iso scene */}
        <FloatingCard className="absolute left-[1%] top-[10%] hidden md:block animate-fadeUp">
          <CardHeader kicker="graph · live" accent />
          <div className="px-3 py-2.5">
            <div className="flex items-baseline gap-3 font-mono">
              <span className="text-xl text-black">247</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-black/55">
                resources
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-black/55">
              <span className="size-1.5 rounded-full bg-[var(--accent)] dot-pulse" />
              indexed 2m ago
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="absolute right-[1%] top-[42%] hidden md:block animate-fadeUp-delay">
          <CardHeader kicker="describe_live_state" />
          <div className="px-3 py-2.5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 font-mono text-[10.5px]">
              <div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                  terraform
                </div>
                <div className="mt-0.5 text-black/70">t3.medium</div>
              </div>
              <div className="text-black/30">→</div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                  aws · live
                </div>
                <div className="mt-0.5 text-black">t3.large</div>
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="absolute left-[4%] bottom-[4%] animate-fadeUp-delay">
          <CardHeader kicker="simulate_impact" />
          <div className="space-y-1.5 px-3 py-2.5 font-mono text-[11px]">
            <Row label="blast" value="3" accent />
            <Row label="refs" value="ok" muted />
            <Row label="policy" value="warn" warn />
          </div>
        </FloatingCard>
      </div>
    </div>
  );
}

function FloatingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-24px_rgba(0,0,0,0.32)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ kicker, accent = false }: { kicker: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/10 px-3 py-1.5">
      <span
        className={`size-1.5 rounded-full ${
          accent ? "bg-[var(--accent)] dot-pulse" : "bg-black/30"
        }`}
      />
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-black/55">
        {kicker}
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
  muted = false,
  warn = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
  warn?: boolean;
}) {
  const valueClass = warn
    ? "text-amber-700"
    : accent
    ? "text-[var(--accent)]"
    : muted
    ? "text-black/70"
    : "text-black";
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9.5px] uppercase tracking-[0.16em] text-black/55">
        {label}
      </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
