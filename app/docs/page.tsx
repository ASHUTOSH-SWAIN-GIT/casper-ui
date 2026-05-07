import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

type Tool = {
  name: string;
  tagline: string;
  description: string;
  params: { name: string; type: string; desc: string }[];
  returns: string;
};

const tools: Tool[] = [
  {
    name: "get_context",
    tagline: "One-shot infra context",
    description:
      "Combined lookup. Returns existing resources, similar examples, matching modules, and conventions in a single call. Start here for any infrastructure task.",
    params: [
      { name: "intent", type: "string", desc: "What the agent is trying to do (free text)." },
      { name: "resource_type", type: "string?", desc: "Optional Terraform type filter, e.g. aws_db_instance." },
    ],
    returns: "{ resources, examples, modules, conventions }",
  },
  {
    name: "find_resource",
    tagline: "Targeted search",
    description:
      "Search resources by name, type, tag, or attribute across all .tf and .tfstate files in the loaded graph.",
    params: [
      { name: "query", type: "string", desc: "Substring or attribute match." },
      { name: "type", type: "string?", desc: "Restrict to a Terraform resource type." },
    ],
    returns: "Resource[] — type, name, address, attrs, source file:line",
  },
  {
    name: "get_dependencies",
    tagline: "Dependency graph",
    description:
      "Upstream + downstream dependency walk for a resource. Useful before destroy or modify operations.",
    params: [
      { name: "address", type: "string", desc: "Resource address, e.g. aws_db_instance.prod." },
      { name: "depth", type: "number?", desc: "Hop limit (default 2)." },
    ],
    returns: "{ upstream: Edge[], downstream: Edge[] }",
  },
  {
    name: "find_similar",
    tagline: "Pattern lookup",
    description:
      "Find similar resources already in the codebase as HCL examples. Great for matching team conventions when authoring new resources.",
    params: [
      { name: "type", type: "string", desc: "Resource type." },
      { name: "match", type: "object?", desc: "Attribute filters." },
    ],
    returns: "Example[] — full HCL block + source location",
  },
  {
    name: "get_module_for",
    tagline: "Reuse what exists",
    description:
      "Find reusable modules matching an intent. Returns the module path, inputs, and a usage snippet.",
    params: [{ name: "intent", type: "string", desc: "What you're building." }],
    returns: "Module[] — path, inputs, outputs, example call",
  },
  {
    name: "get_conventions",
    tagline: "How this codebase configures X",
    description:
      "Aggregates how a resource type is configured across the codebase — common args, recurring tags, modal values.",
    params: [{ name: "type", type: "string", desc: "Resource type." }],
    returns: "{ common_args, common_tags, modal_values }",
  },
  {
    name: "simulate_impact",
    tagline: "Plan before you apply",
    description:
      "Parse proposed HCL and return blast radius, broken references, similar real examples, reversibility context, and policy violations. Call this before presenting code.",
    params: [
      { name: "hcl", type: "string", desc: "Proposed Terraform code." },
      { name: "operation", type: "enum", desc: "create | modify | destroy" },
    ],
    returns: "{ created, modified, destroyed, broken_refs, policy_violations, reversibility }",
  },
  {
    name: "describe_live_state",
    tagline: "AWS drift detection",
    description:
      "Compare Terraform state against live AWS via read-only Describe APIs. Surfaces drift between what is declared and what actually exists.",
    params: [{ name: "address", type: "string", desc: "Resource address." }],
    returns: "{ in_sync: boolean, diffs: AttrDiff[] }",
  },
  {
    name: "load_repo",
    tagline: "Swap the graph",
    description:
      "Clone a GitHub repo and reload the graph in place. No server restart. Useful for multi-repo agents or onboarding flows.",
    params: [{ name: "url", type: "string", desc: "GitHub repository URL." }],
    returns: "{ resources_loaded, modules_loaded, took_ms }",
  },
  {
    name: "dump_graph",
    tagline: "Full snapshot",
    description:
      "Returns a complete snapshot — all resources, edges, and policy violations. For debugging, audit, or building external visualizations.",
    params: [],
    returns: "{ nodes, edges, policy_violations }",
  },
];

export default function DocsPage() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[400px] grid-bg pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-3xl px-6 py-8 sm:py-12">
        <Nav />

        <section className="mt-16">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
            Tool reference
          </h1>
          <p className="mt-4 text-neutral-600 max-w-xl">
            Casper exposes 10 MCP tools. Each one is read-only and returns
            structured JSON. Most agent flows start with{" "}
            <code className="font-mono text-neutral-900">get_context</code>{" "}
            and end with{" "}
            <code className="font-mono text-neutral-900">simulate_impact</code>.
          </p>
        </section>

        <aside className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tools.map((t) => (
            <a
              key={t.name}
              href={`#${t.name}`}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-700 hover:border-[var(--accent)] hover:text-neutral-900 transition"
            >
              {t.name}
            </a>
          ))}
        </aside>

        <div className="mt-16 space-y-16">
          {tools.map((t) => (
            <article key={t.name} id={t.name} className="scroll-mt-20">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-mono text-xl text-neutral-900">{t.name}</h2>
                <span className="text-xs uppercase tracking-widest text-neutral-500">
                  {t.tagline}
                </span>
              </div>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-2xl">
                {t.description}
              </p>

              {t.params.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Parameters
                  </div>
                  <div className="rounded-lg border border-neutral-200 overflow-hidden bg-white">
                    {t.params.map((p, i) => (
                      <div
                        key={p.name}
                        className={`grid grid-cols-[140px_100px_1fr] gap-4 px-4 py-3 text-sm ${
                          i > 0 ? "border-t border-neutral-200" : ""
                        }`}
                      >
                        <code className="font-mono text-neutral-900">{p.name}</code>
                        <code className="font-mono text-neutral-600">{p.type}</code>
                        <span className="text-neutral-600">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Returns
                </div>
                <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-sm text-neutral-800 overflow-x-auto">
                  {t.returns}
                </div>
              </div>
            </article>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
