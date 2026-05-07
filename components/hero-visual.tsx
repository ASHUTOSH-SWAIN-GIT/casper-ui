export function HeroVisual() {
  return (
    <div className="relative rounded-xl border border-neutral-200 bg-neutral-950 overflow-hidden shadow-xl">
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[var(--accent)]/20 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5 bg-black/60">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-[var(--accent)]/80" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-neutral-500">
          claude-code · session
        </span>
      </div>

      <div className="p-5 font-mono text-[13px] leading-relaxed">
        <div className="text-neutral-500">{"// agent calls casper"}</div>
        <div className="mt-2">
          <span className="text-neutral-500">→</span>{" "}
          <span className="text-white">get_context</span>
          <span className="text-neutral-500">{"({ "}</span>
          <span className="text-neutral-300">intent:</span>{" "}
          <span className="text-emerald-300">&quot;add an RDS replica&quot;</span>
          <span className="text-neutral-500">{" })"}</span>
        </div>

        <div className="mt-4 rounded-md border border-neutral-800 bg-black/60 p-3 text-xs text-neutral-300">
          <div className="text-neutral-500">{"// response"}</div>
          <div className="mt-1">
            <span className="text-sky-300">resources</span>
            <span className="text-neutral-500">{": "}</span>
            <span className="text-white">3 matches</span>
          </div>
          <div>
            <span className="text-sky-300">examples</span>
            <span className="text-neutral-500">{": "}</span>
            <span className="text-white">aws_db_instance.prod</span>
          </div>
          <div>
            <span className="text-sky-300">conventions</span>
            <span className="text-neutral-500">{": "}</span>
            <span className="text-white">backup_retention=14, multi_az</span>
          </div>
          <div>
            <span className="text-sky-300">policy</span>
            <span className="text-neutral-500">{": "}</span>
            <span className="text-white">deletion_protection required</span>
          </div>
        </div>

        <div className="mt-4 text-neutral-500">{"// agent drafts HCL, then:"}</div>
        <div className="mt-1">
          <span className="text-neutral-500">→</span>{" "}
          <span className="text-white">simulate_impact</span>
          <span className="text-neutral-500">{"(...)"}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-neutral-300">0 broken refs · 0 violations</span>
        </div>
      </div>
    </div>
  );
}
