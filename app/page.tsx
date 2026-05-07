import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HeroVisual } from "@/components/hero-visual";
import { SetupTabs } from "@/components/setup-tabs";
import { Faq } from "@/components/faq";
import {
  SearchIcon,
  GraphIcon,
  ShieldIcon,
  CloudIcon,
  BoltIcon,
  LayersIcon,
} from "@/components/icons";
import { CopyCommand } from "./copy-command";

const benefits = {
  title: "Built for infra agents",
  icon: BoltIcon,
  items: [
    "AI Terraform reviewers",
    "Drift watchers",
    "Policy gates in CI",
    "Module recommenders",
  ],
};

const capabilities = {
  title: "Capabilities",
  icon: LayersIcon,
  items: [
    "Resource graph",
    "Live AWS describe",
    "HCL impact simulation",
    "Org policy engine",
    "Module discovery",
    "Multi-repo loading",
  ],
};

const workflows = {
  title: "Example workflows",
  icon: GraphIcon,
  items: [
    "Plan a new resource using team conventions",
    "Detect drift between state and live AWS",
    "Block destroys on prod databases",
    "Audit policy violations across a fleet",
  ],
};

const features = [
  { Icon: SearchIcon, title: "Find resources", body: "Search by name, type, tag, or attribute across .tf and .tfstate." },
  { Icon: BoltIcon, title: "Simulate changes", body: "Parse proposed HCL — get blast radius, broken refs, policy hits before apply." },
  { Icon: CloudIcon, title: "Detect drift", body: "Compare Terraform state vs live AWS via read-only Describe APIs." },
  { Icon: ShieldIcon, title: "Enforce policies", body: "Define org rules in .casper/policies.yaml. Violations surface inline." },
  { Icon: LayersIcon, title: "Load any repo", body: "Point at a GitHub URL and swap the graph on the fly — no restart." },
  { Icon: GraphIcon, title: "Read-only by design", body: "Casper never writes to AWS or your repo. It reads, indexes, answers." },
];

export default function Page() {
  return (
    <div className="relative">
      <div className="relative mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <Nav />

        <section className="mt-20 sm:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 backdrop-blur px-3 py-1 text-xs text-neutral-700">
              <span className="size-1.5 rounded-full bg-[var(--accent)]" />
              MCP server · Terraform · AWS
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-neutral-900">
              Casper MCP Server
            </h1>
            <p className="mt-6 text-neutral-600 leading-relaxed max-w-xl">
              A live, queryable view of your Terraform infrastructure for AI
              agents. Casper indexes your <code className="font-mono text-neutral-900">.tf</code> and{" "}
              <code className="font-mono text-neutral-900">.tfstate</code> into a graph,
              checks AWS for drift, and runs your org policies — so your agent
              answers infra questions in structured JSON, not by grepping files.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyCommand command="npx casper-mcp serve --dir ." />
              <Link
                href="/docs"
                className="inline-flex h-10 items-center rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-700 hover:border-[var(--accent)] hover:text-neutral-900 transition"
              >
                See docs →
              </Link>
            </div>
          </div>

          <div className="lg:pl-4">
            <HeroVisual />
          </div>
        </section>

        <section className="mt-28 sm:mt-36">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              What it does
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              The infra layer your agent has been missing
            </p>
            <p className="mt-4 text-neutral-600">
              Three lenses on the same graph: who it&rsquo;s for, what it
              exposes, and how teams actually use it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[benefits, capabilities, workflows].map((card) => (
              <div
                key={card.title}
                className="group rounded-xl border border-neutral-200 bg-white p-6 hover:border-[var(--accent)] hover:shadow-md transition"
              >
                <div className="flex items-center justify-center size-10 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]">
                  <card.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-medium text-neutral-900">
                  {card.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-neutral-600"
                    >
                      <span className="mt-1.5 size-1 rounded-full bg-[var(--accent)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Core features
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white p-6 hover:bg-neutral-50 transition group"
              >
                <f.Icon className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform origin-left" />
                <h3 className="mt-4 text-sm font-medium text-neutral-900">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-neutral-500">
                Setup
              </h2>
              <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
                How to wire up Casper
              </p>
              <p className="mt-4 text-neutral-600">
                Run <code className="font-mono text-neutral-900">casper-mcp init</code>{" "}
                in your repo to write <code className="font-mono text-neutral-900">.mcp.json</code>{" "}
                and a <code className="font-mono text-neutral-900">/casper</code>{" "}
                slash command. Or drop the config below into your client&rsquo;s MCP file.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-neutral-500 w-6">01</span>
                  <span className="text-neutral-700">Install via npm, brew, go, or npx.</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-neutral-500 w-6">02</span>
                  <span className="text-neutral-700">Add the JSON config to your client.</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-neutral-500 w-6">03</span>
                  <span className="text-neutral-700">Restart and call any tool.</span>
                </div>
              </div>
            </div>
            <SetupTabs />
          </div>
        </section>

        <section className="mt-28">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              FAQ
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              Common questions
            </p>
          </div>
          <div className="mt-10 max-w-2xl mx-auto">
            <Faq />
          </div>
        </section>

        <section className="mt-28 relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-[var(--accent)]/8 via-white to-white p-10 sm:p-14">
          <div className="absolute -top-32 -right-32 size-80 rounded-full bg-[var(--accent)]/15 blur-3xl pointer-events-none" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              Give your agent the infra it deserves.
            </h2>
            <p className="mt-4 text-neutral-600">
              One command. Read-only. Works with Claude Code, Claude Desktop,
              and Cursor today.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-medium text-white hover:bg-[var(--accent-soft)] transition shadow-sm"
              >
                Read the docs
              </Link>
              <a
                href="https://github.com/ASHUTOSH-SWAIN-GIT/casper-mcp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-700 hover:border-[var(--accent)] hover:text-neutral-900 transition"
              >
                Star on GitHub
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
