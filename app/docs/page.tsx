import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { tools } from "./tools";

const sidebarGroups = [
  {
    title: "Getting started",
    sections: [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quick start" },
      { id: "context-graph", label: "Context graph" },
    ],
  },
  {
    title: "Tools",
    sections: tools.map((t) => ({ id: t.id, label: t.name })),
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
      <Nav />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        <aside className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto pb-8">
          <DocsSidebar groups={sidebarGroups} />
        </aside>

        <main className="min-w-0 max-w-3xl">
          <article id="overview" className="scroll-mt-20">
            <div className="text-xs uppercase tracking-widest text-neutral-500">
              Documentation
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
              Tool reference
            </h1>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Casper exposes 10 MCP tools. Each one is read-only, returns
              structured JSON, and operates on the in-memory graph built from
              your Terraform repo at startup. The graph hot-reloads on every{" "}
              <code className="font-mono text-neutral-900">.tf</code> /{" "}
              <code className="font-mono text-neutral-900">.tfstate</code>{" "}
              change via <code className="font-mono text-neutral-900">fsnotify</code>,
              so the answers your agent gets are always up to date with the
              current files on disk.
            </p>
          </article>

          <article id="quickstart" className="mt-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Quick start
            </h2>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Three steps. Install, init in your Terraform repo, then run{" "}
              <code className="font-mono text-neutral-900">/casper</code> in
              Claude Code to build the graph.
            </p>

            <ol className="mt-6 space-y-4">
              <QuickStep
                index={1}
                title="Install"
                desc="Install the Casper MCP CLI."
                code="npm install -g casper-mcp"
              />
              <QuickStep
                index={2}
                title="Init in your repo"
                desc="Wires up .mcp.json and the /casper slash command."
                code="casper-mcp init"
              />
              <QuickStep
                index={3}
                title="Start the graph"
                desc="Open Claude Code in the same project and run:"
                code="/casper"
              />
            </ol>
          </article>

          <article id="context-graph" className="mt-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Context graph
            </h2>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Everything Casper exposes — every tool, every answer — is backed
              by a single in-memory data structure called the{" "}
              <span className="text-neutral-900 font-medium">context graph</span>.
              It&rsquo;s a typed view of your Terraform infrastructure that
              the agent queries instead of reading raw files.
            </p>

            <h3 className="mt-10 text-lg font-semibold text-neutral-900">
              What it is
            </h3>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              The graph is a directed, attributed graph held in memory by the
              MCP server for the duration of the session. Every Terraform
              concept becomes a typed entity:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {[
                ["Nodes", "Resources, data sources, module calls, and module definitions. Each carries its full attribute set, tags, and source file:line."],
                ["Edges", "References, depends_on relationships, and module input/output wiring. Edges are typed and traversable in both directions."],
                ["Conventions", "An aggregated view of how resource types are configured across the repo — common args, modal values, recurring tag keys."],
                ["Policies", "Rules from .casper/policies.yaml evaluated against the graph; violations attach to affected resources."],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3">
                  <span className="mt-2 size-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>
                    <span className="font-medium text-neutral-900">{k}.</span>{" "}
                    {v}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-lg font-semibold text-neutral-900">
              How it&rsquo;s made
            </h3>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              On startup Casper runs a four-stage pipeline against the
              directory you point it at:
            </p>
            <ol className="mt-5 space-y-3">
              {[
                ["Scan", "Walk the tree, collect every .tf and .tfstate file (skipping vendored modules and .terraform caches)."],
                ["Parse", "Use HashiCorp's HCL parser to extract resource blocks, attributes, references, and module calls into typed records."],
                ["Link", "Resolve cross-file references and depends_on into directed edges. Module calls are wired to their definitions."],
                ["Index", "Compute conventions, evaluate policies, and build the lookup tables that power the 10 MCP tools."],
              ].map(([step, desc], i) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3"
                >
                  <span className="font-mono text-xs text-[var(--accent)] mt-0.5 w-6">
                    0{i + 1}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-neutral-900">
                      {step}
                    </span>
                    <p className="mt-1 text-sm text-neutral-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-lg border-l-2 border-[var(--accent)] bg-neutral-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                Stays in sync
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                An{" "}
                <code className="font-mono text-neutral-900">fsnotify</code>{" "}
                watcher runs alongside the server. Any save, edit, or delete
                of a <code className="font-mono text-neutral-900">.tf</code>{" "}
                or <code className="font-mono text-neutral-900">.tfstate</code>{" "}
                file triggers a debounced rescan and atomic graph swap. The
                next tool call always sees the current state of your repo —
                no restart, no manual reload.
              </p>
            </div>

            <h3 className="mt-10 text-lg font-semibold text-neutral-900">
              Why a graph
            </h3>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Agents that read raw <code className="font-mono text-neutral-900">.tf</code>{" "}
              files hit three walls almost immediately. Files don&rsquo;t fit
              into context on real-world repos. Cross-module references
              require following <code className="font-mono text-neutral-900">module.foo.bar</code>{" "}
              indirection that&rsquo;s easy to miss. And questions like
              &quot;what depends on this RDS instance?&quot; force a full
              repo grep with no guarantee of completeness.
            </p>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              The graph turns those problems into typed lookups. Token cost
              stays flat regardless of repo size, every reference is resolved
              once at parse time, and dependency walks are O(1) per hop.
              Equally important, the graph is the surface that policies,
              drift detection, and impact simulation can be evaluated
              against — none of which is possible by reading files alone.
            </p>
          </article>

          <div className="mt-20 mb-6">
            <div className="text-xs uppercase tracking-widest text-neutral-500">
              Tools
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              All 10 tools, in detail
            </h2>
          </div>

          <div className="space-y-20">
            {tools.map((t) => (
              <article
                key={t.id}
                id={t.id}
                className="scroll-mt-20 border-t border-neutral-200 pt-10"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-mono text-2xl text-neutral-900">{t.name}</h3>
                  <span className="text-xs uppercase tracking-widest text-neutral-500">
                    {t.tagline}
                  </span>
                </div>
                <p className="mt-4 text-neutral-700 leading-relaxed">
                  {t.description}
                </p>

                <div className="mt-5 rounded-lg border-l-2 border-[var(--accent)] bg-neutral-50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                    Why it exists
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {t.whyItExists}
                  </p>
                </div>

                {t.params.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                      Parameters
                    </h4>
                    <div className="rounded-lg border border-neutral-200 overflow-hidden bg-white">
                      <div className="grid grid-cols-[160px_120px_60px_1fr] gap-4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-200 bg-neutral-50">
                        <span>Name</span>
                        <span>Type</span>
                        <span>Req.</span>
                        <span>Description</span>
                      </div>
                      {t.params.map((p, i) => (
                        <div
                          key={p.name}
                          className={`grid grid-cols-[160px_120px_60px_1fr] gap-4 px-4 py-3 text-sm ${
                            i > 0 ? "border-t border-neutral-200" : ""
                          }`}
                        >
                          <code className="font-mono text-neutral-900">{p.name}</code>
                          <code className="font-mono text-neutral-600">{p.type}</code>
                          <span
                            className={
                              p.required
                                ? "text-[var(--accent)] font-medium"
                                : "text-neutral-400"
                            }
                          >
                            {p.required ? "yes" : "no"}
                          </span>
                          <span className="text-neutral-600">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                    Returns
                  </h4>
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-sm text-neutral-800 overflow-x-auto">
                    {t.returns}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CodePane label="Example call" code={t.exampleCall} />
                  <CodePane label="Example response" code={t.exampleResponse} />
                </div>
              </article>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function QuickStep({
  index,
  title,
  desc,
  code,
}: {
  index: number;
  title: string;
  desc: string;
  code: string;
}) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-7 items-center justify-center rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-mono text-xs text-[var(--accent)]">
          0{index}
        </span>
        <h3 className="text-base font-medium text-neutral-900">{title}</h3>
      </div>
      <p className="mt-2 ml-10 text-sm text-neutral-600">{desc}</p>
      <div className="mt-3 ml-10 rounded-md border border-neutral-200 bg-neutral-950 px-4 py-2.5 font-mono text-sm text-neutral-200 overflow-x-auto">
        <span className="text-neutral-500">$ </span>
        {code}
      </div>
    </li>
  );
}

function CodePane({ label, code }: { label: string; code: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-950 overflow-hidden">
      <div className="px-4 py-2 border-b border-neutral-800 text-xs font-mono text-neutral-400">
        {label}
      </div>
      <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
