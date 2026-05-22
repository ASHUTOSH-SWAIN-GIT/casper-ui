import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HeroVisual } from "@/components/hero-visual";
import { Faq } from "@/components/faq";
import {
  SearchIcon,
  GraphIcon,
  ShieldIcon,
  CloudIcon,
  BoltIcon,
  LayersIcon,
} from "@/components/icons";
import {
  IsoFlowTile,
  IsoBoardTile,
  IsoGraphTile,
  IsoSearchPanel,
  IsoSimulatePanel,
  IsoDriftPanel,
  IsoPolicyPanel,
  IsoReadonlyPanel,
} from "@/components/isometric";
import { CopyCommand } from "./copy-command";

const benefits = {
  title: "Agent-ready context",
  Visual: () => <IsoFlowTile className="h-32 w-auto" />,
  items: [
    "Terraform-aware assistant workflows",
    "Structured JSON responses",
    "Session-level repo loading",
    "Read-only cloud inspection",
  ],
};

const capabilities = {
  title: "Infrastructure graph",
  Visual: () => <IsoGraphTile className="h-32 w-auto" />,
  items: [
    "Resources, modules, tags, and refs",
    "HCL impact simulation",
    "AWS state comparison",
    "Policy violations surfaced inline",
  ],
};

const workflows = {
  title: "Team workflows",
  Visual: () => <IsoBoardTile className="h-32 w-auto" />,
  items: [
    "Review pull requests before apply",
    "Find drift in production resources",
    "Recommend existing modules",
    "Block risky changes in CI",
  ],
};

const features = [
  {
    Icon: SearchIcon,
    Visual: () => <IsoSearchPanel className="h-32 w-auto" />,
    title: "Find resources",
    body: "Search by name, type, tag, or attribute across .tf and .tfstate.",
  },
  {
    Icon: BoltIcon,
    Visual: () => <IsoSimulatePanel className="h-32 w-auto" />,
    title: "Simulate changes",
    body: "Parse proposed HCL, then get blast radius, broken refs, and policy hits before apply.",
  },
  {
    Icon: CloudIcon,
    Visual: () => <IsoDriftPanel className="h-32 w-auto" />,
    title: "Detect drift",
    body: "Compare Terraform state vs live AWS via read-only Describe APIs.",
  },
  {
    Icon: ShieldIcon,
    Visual: () => <IsoPolicyPanel className="h-32 w-auto" />,
    title: "Enforce policies",
    body: "Define org rules in .casper/policies.yaml. Violations surface inline.",
  },
  {
    Icon: GraphIcon,
    Visual: () => <IsoReadonlyPanel className="h-32 w-auto" />,
    title: "Read-only by design",
    body: "Casper never writes Terraform or AWS resources. render_graph writes one local HTML file; that's the only thing on disk.",
  },
];

export default function Page() {
  return (
    <div className="relative bg-white text-black">
      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <Nav />

        <section className="grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              <span className="size-1.5 rounded-full bg-[var(--accent)]" />
              MCP server for Terraform and AWS
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-tight text-black sm:text-7xl lg:text-8xl">
              Casper MCP Server
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-black/70 sm:text-xl">
              A live, queryable view of your Terraform infrastructure for AI
              agents. Casper turns repos, state, drift, and policies into
              structured context your assistant can actually use.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CopyCommand command="npm install -g casper-mcp" />
              <Link
                href="/docs"
                className="inline-flex min-h-11 items-center rounded-md border border-black/15 bg-white px-4 text-sm font-medium text-black transition hover:border-black hover:bg-[var(--surface-2)]"
              >
                Read docs
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-black/10 py-5">
              {[
                ["MCP", "typed tools"],
                ["0", "write actions"],
                ["1", "live graph"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-black/10 last:border-r-0">
                  <div className="font-mono text-2xl text-black">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-black/60">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fadeUp-delay lg:pl-4">
            <HeroVisual />
          </div>
        </section>

        <section className="border-t border-black/10 py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-black/60">
                What it does
              </h2>
              <p className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-black sm:text-5xl">
                Infra context without giving agents write access.
              </p>
            </div>
            <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
              {[benefits, capabilities, workflows].map((card) => (
                <div key={card.title} className="group relative overflow-hidden bg-white p-6 transition hover:bg-[var(--surface-2)]">
                  <div className="flex h-24 items-end justify-center">
                    <card.Visual />
                  </div>
                  <h3 className="mt-6 text-base font-semibold text-black">
                    {card.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-black/70">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-black/60">
                Core features
              </h2>
              <p className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                The tools an AI reviewer needs before it can reason about infra.
              </p>
            </div>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {features.map((f) => (
                <div key={f.title} className="grid items-center gap-5 py-6 sm:grid-cols-[180px_180px_1fr] sm:py-7">
                  <div className="flex h-32 items-center justify-center sm:justify-start">
                    <f.Visual />
                  </div>
                  <div className="flex items-center gap-3">
                    <f.Icon className="size-4 text-black/60" />
                    <h3 className="text-sm font-semibold text-black">{f.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-black/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-black/60">
                FAQ
              </h2>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Common questions
              </p>
            </div>
            <Faq />
          </div>
        </section>

        <section className="border-t border-black/10 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-black/60">
                Early access
              </h2>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Built in the open, rough edges included.
              </p>
            </div>
            <div className="border border-black/10 bg-white p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 border border-black/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-black/60">
                <span className="size-1.5 rounded-full bg-[var(--accent)] dot-pulse" />
                v0 · early
              </div>
              <p className="mt-5 text-base leading-7 text-black/70">
                Casper is in its early days. Expect discrepancies, missing
                provider coverage, and rough edges as the graph, drift, and
                policy layers mature. Feedback shapes what ships next.
              </p>
              <p className="mt-4 text-base leading-7 text-black/70">
                If you want Casper as part of your real workflow, reach out and
                we&apos;ll build it together — issues you hit, providers you
                need, and conventions your team actually uses.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="https://x.com/LowKeyDevs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-black bg-white px-4 text-sm font-medium text-black transition hover:bg-[var(--surface-2)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                  </svg>
                  Reach out on X
                </a>
                <a
                  href="https://github.com/ASHUTOSH-SWAIN-GIT/casper-mcp/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-md border border-black/15 bg-white px-4 text-sm font-medium text-black transition hover:border-black hover:bg-[var(--surface-2)]"
                >
                  Open a GitHub issue
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-black/10 py-20">
          <div className="pointer-events-none absolute right-0 top-10 hidden h-48 w-72 opacity-90 lg:block">
            <IsoGraphTile className="h-full w-full" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-black sm:text-6xl">
                Put your infra graph in the agent loop.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-black/70">
                Start with a read-only MCP server that works with Claude Code,
                Claude Desktop, Cursor, and any client that can call MCP tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex min-h-11 items-center rounded-md border border-black bg-white px-4 text-sm font-medium text-black transition hover:bg-[var(--surface-2)]"
              >
                Read the docs
              </Link>
              <a
                href="https://github.com/ASHUTOSH-SWAIN-GIT/casper-mcp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-md border border-black/15 bg-white px-4 text-sm font-medium text-black transition hover:border-black hover:bg-[var(--surface-2)]"
              >
                View GitHub
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
