export function HeroVisual() {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-6 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_70%_30%,var(--accent-glow),transparent_70%)]" />

      <div className="relative grid gap-3">
        <Card className="ml-auto w-[92%] sm:w-[88%]">
          <CardHeader
            kicker="graph · live"
            title="Infrastructure index"
            accent
          />
          <div className="grid grid-cols-3 gap-px bg-black/10">
            {[
              ["247", "resources"],
              ["18", "modules"],
              ["4", "providers"],
            ].map(([v, l]) => (
              <div key={l} className="bg-white p-3 sm:p-4">
                <div className="font-mono text-2xl text-black sm:text-3xl">
                  {v}
                </div>
                <div className="mt-1 text-[10.5px] uppercase tracking-[0.18em] text-black/55">
                  {l}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 p-3 sm:p-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-black/55">
              <span>aws · github · datadog · cloudflare</span>
              <span className="flex items-center gap-1.5 text-black/70">
                <span className="size-1.5 rounded-full bg-[var(--accent)] dot-pulse" />
                indexed 2m ago
              </span>
            </div>
          </div>
        </Card>

        <Card className="mr-auto w-[92%] sm:w-[88%]">
          <CardHeader
            kicker="simulate_impact"
            title="Pull request #482"
          />
          <div className="space-y-2 p-3 sm:p-4">
            <Row
              label="blast radius"
              value="3 resources"
              accent
            />
            <Row label="broken refs" value="none" muted />
            <Row label="reversible" value="yes" muted />
            <div className="border-t border-black/10 pt-2">
              <Row
                label="policy"
                value="s3-encryption-required"
                warn
              />
            </div>
          </div>
        </Card>

        <Card className="ml-auto w-[92%] sm:w-[88%]">
          <CardHeader
            kicker="describe_live_state"
            title="Drift detected"
          />
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-[11.5px]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                  terraform
                </div>
                <div className="mt-1 truncate text-black/70">
                  t3.medium
                </div>
              </div>
              <div className="text-black/30">→</div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                  aws (live)
                </div>
                <div className="mt-1 truncate text-black">t3.large</div>
              </div>
            </div>
            <div className="mt-3 truncate font-mono text-[11px] text-black/55">
              aws_instance.api · us-east-1
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_36px_-24px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  kicker,
  title,
  accent = false,
}: {
  kicker: string;
  title: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-3 py-2.5 sm:px-4">
      <div className="flex items-center gap-2">
        <span
          className={`size-1.5 rounded-full ${
            accent ? "bg-[var(--accent)] dot-pulse" : "bg-black/30"
          }`}
        />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-black/55">
          {kicker}
        </span>
      </div>
      <span className="text-[12px] font-medium text-black">{title}</span>
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
    <div className="flex items-center justify-between font-mono text-[12px]">
      <span className="text-[11px] uppercase tracking-[0.16em] text-black/55">
        {label}
      </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
