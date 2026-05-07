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
      { id: "tool-flow", label: "Recommended flow" },
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
              Point Casper at any Terraform directory. It scans, builds the
              graph, watches for changes, and exposes 10 tools over stdio.
            </p>
            <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-950 px-4 py-3 font-mono text-sm text-neutral-200 overflow-x-auto">
              <span className="text-neutral-500">$ </span>
              npx casper-mcp serve --dir /path/to/your/terraform
            </div>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Or run <code className="font-mono text-neutral-900">casper-mcp init</code>{" "}
              once in your repo to wire up{" "}
              <code className="font-mono text-neutral-900">.mcp.json</code> and a{" "}
              <code className="font-mono text-neutral-900">/casper</code> slash
              command for Claude Code.
            </p>
          </article>

          <article id="tool-flow" className="mt-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Recommended flow
            </h2>
            <p className="mt-3 text-neutral-600 leading-relaxed">
              Most agent workflows should follow the same shape:
            </p>
            <ol className="mt-5 space-y-3">
              {[
                ["get_context", "Ground the agent in existing resources, examples, modules, and conventions."],
                ["draft HCL", "Author Terraform that mirrors what the codebase already does."],
                ["simulate_impact", "Verify blast radius, broken refs, and policy violations before presenting code."],
                ["describe_live_state", "If touching existing infra, confirm declared state matches reality."],
              ].map(([step, desc], i) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3"
                >
                  <span className="font-mono text-xs text-neutral-500 mt-0.5">
                    0{i + 1}
                  </span>
                  <div>
                    <code className="font-mono text-sm text-neutral-900">
                      {step}
                    </code>
                    <p className="mt-1 text-sm text-neutral-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
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
                    When to use
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {t.whenToUse}
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
