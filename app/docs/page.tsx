import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { GetStarted } from "@/components/get-started";
import { tools } from "./tools";

const sidebarGroups = [
  {
    title: "Getting started",
    sections: [
      { id: "overview", label: "Overview" },
      { id: "get-started", label: "Get started" },
      { id: "context-graph", label: "Context graph" },
    ],
  },
  {
    title: "Policies",
    sections: [
      { id: "policies", label: "Overview" },
      { id: "argument-rules", label: "Argument rules" },
      { id: "workflow-rules", label: "Workflow rules" },
      { id: "policy-violations", label: "How violations surface" },
    ],
  },
  {
    title: "Tools",
    sections: tools.map((t) => ({ id: t.id, label: t.name })),
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl bg-white px-5 py-6 text-black sm:px-8 sm:py-8">
      <Nav />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden pb-8 lg:sticky lg:top-8 lg:block lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto">
          <DocsSidebar groups={sidebarGroups} />
        </aside>

        <main className="min-w-0">
          <article id="overview" className="scroll-mt-20">
            <div className="text-xs uppercase tracking-[0.22em] text-black/60">
              Documentation
            </div>
            <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight text-black sm:text-7xl">
              Tool reference
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-black/70">
              Casper exposes 10 MCP tools. Each one is read-only, returns
              structured JSON, and operates on the in-memory graph built from
              your Terraform repo at startup. The graph hot-reloads on every{" "}
              <code className="font-mono text-black">.tf</code> /{" "}
              <code className="font-mono text-black">.tfstate</code>{" "}
              change via <code className="font-mono text-black">fsnotify</code>,
              so the answers your agent gets are always up to date with the
              current files on disk.
            </p>
          </article>

          <article id="get-started" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Get started
            </h2>
            <p className="mb-6 mt-4 max-w-3xl leading-7 text-black/70">
              Installing the npm package auto-detects every MCP client on your
              machine - Claude Code, Claude Desktop, Cursor, and Codex - and
              wires each one up at user scope. <span className="font-medium text-black">Quick</span>{" "}
              walks through the install + restart flow.{" "}
              <span className="font-medium text-black">Manual</span>{" "}
              gives you the raw config snippet for each client if you&rsquo;d
              rather wire it up by hand.
            </p>
            <GetStarted />
          </article>

          <article id="context-graph" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Context graph
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-black/70">
              Everything Casper exposes - every tool, every answer - is backed
              by a single in-memory data structure called the{" "}
              <span className="font-medium text-black">context graph</span>.
              It&rsquo;s a typed view of your Terraform infrastructure that
              the agent queries instead of reading raw files.
            </p>

            <figure className="mt-8 overflow-hidden border border-black/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/context-graph.png"
                alt="Casper context graph rendered for a real Terraform repo"
                className="block w-full h-auto"
              />
              <figcaption className="border-t border-black/10 bg-white px-4 py-2.5 font-mono text-xs text-black/55">
                casper/graph.html - rendered from a live Terraform repo
              </figcaption>
            </figure>

            <h3 className="mt-10 text-xl font-semibold text-black">
              What it is
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              The graph is a directed, attributed graph held in memory by the
              MCP server for the duration of the session. Every Terraform
              concept becomes a typed entity:
            </p>
            <ul className="mt-5 max-w-3xl space-y-3 text-sm leading-6 text-black/70">
              {[
                ["Nodes", "Resources, data sources, module calls, and module definitions. Each carries its full attribute set, tags, and source file:line."],
                ["Edges", "References, depends_on relationships, and module input/output wiring. Edges are typed and traversable in both directions."],
                ["Conventions", "An aggregated view of how resource types are configured across the repo: common args, modal values, recurring tag keys."],
                ["Policies", "Rules from .casper/policies.yaml evaluated against the graph; violations attach to affected resources."],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3">
                  <span className="mt-2 size-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>
                    <span className="font-medium text-black">{k}.</span>{" "}
                    {v}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-xl font-semibold text-black">
              How it&rsquo;s made
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              On startup Casper runs a four-stage pipeline against the
              directory you point it at:
            </p>
            <ol className="mt-6 grid grid-cols-1 gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Scan", "Walk the tree, collect every .tf and .tfstate file (skipping vendored modules and .terraform caches)."],
                ["Parse", "Use HashiCorp's HCL parser to extract resource blocks, attributes, references, and module calls into typed records."],
                ["Link", "Resolve cross-file references and depends_on into directed edges. Module calls are wired to their definitions."],
                ["Index", "Compute conventions, evaluate policies, and build the lookup tables that power the 10 MCP tools."],
              ].map(([step, desc], i) => (
                <li
                  key={step}
                  className="relative bg-white p-4"
                >
                  <span className="inline-flex size-8 items-center justify-center border border-black/15 font-mono text-xs text-black">
                    0{i + 1}
                  </span>
                  <div className="mt-4 text-sm font-semibold text-black">
                    {step}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    {desc}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-l-2 border-[var(--accent)] bg-[var(--surface-2)] px-4 py-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                Stays in sync
              </div>
              <p className="text-sm leading-6 text-black/70">
                An{" "}
                <code className="font-mono text-black">fsnotify</code>{" "}
                watcher runs alongside the server. Any save, edit, or delete
                of a <code className="font-mono text-black">.tf</code>{" "}
                or <code className="font-mono text-black">.tfstate</code>{" "}
                file triggers a debounced rescan and atomic graph swap. The
                next tool call always sees the current state of your repo -
                no restart, no manual reload.
              </p>
            </div>

            <h3 className="mt-10 text-xl font-semibold text-black">
              Why a graph
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              Agents that read raw <code className="font-mono text-black">.tf</code>{" "}
              files hit three walls almost immediately. Files don&rsquo;t fit
              into context on real-world repos. Cross-module references
              require following <code className="font-mono text-black">module.foo.bar</code>{" "}
              indirection that&rsquo;s easy to miss. And questions like
              &quot;what depends on this RDS instance?&quot; force a full
              repo grep with no guarantee of completeness.
            </p>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              The graph turns those problems into typed lookups. Token cost
              stays flat regardless of repo size, every reference is resolved
              once at parse time, and dependency walks are O(1) per hop.
              Equally important, the graph is the surface that policies,
              drift detection, and impact simulation can be evaluated
              against. None of that is possible by reading files alone.
            </p>
          </article>

          <article id="policies" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <div className="text-xs uppercase tracking-[0.22em] text-black/60">
              Policies
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Encode your team&rsquo;s rules in YAML
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-black/70">
              Drop a{" "}
              <code className="font-mono text-black">
                .casper/policies.yaml
              </code>{" "}
              file at the root of your Terraform repo and Casper enforces it on
              every change the agent proposes. You write what&rsquo;s required;
              the MCP server checks it on every{" "}
              <code className="font-mono text-black">simulate_impact</code>{" "}
              call without anyone reminding the agent.
            </p>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              This is the difference between <em>hoping</em> the agent follows
              your conventions and <em>guaranteeing</em> it does.
            </p>

            <ol className="mt-6 grid grid-cols-1 gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Define", "Write rules in .casper/policies.yaml for argument constraints and workflow routing."],
                ["Load", "Casper reads the file on startup and reloads automatically when it changes."],
                ["Check", "Every simulate_impact and dump_graph call evaluates the rules against the proposed change."],
                ["Correct", "The agent reads policy_violations[] in the response and fixes its own draft before applying."],
              ].map(([step, desc], i) => (
                <li
                  key={step}
                  className="relative bg-white p-4"
                >
                  <span className="inline-flex size-8 items-center justify-center border border-black/15 font-mono text-xs text-black">
                    0{i + 1}
                  </span>
                  <div className="mt-4 text-sm font-semibold text-black">
                    {step}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    {desc}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article id="argument-rules" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <h3 className="text-xl font-semibold text-black">
              Argument rules
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              Each rule names a Terraform resource type, declares one or more
              argument constraints, and gives a human-readable{" "}
              <code className="font-mono text-black">message</code> the
              agent can quote back when it asks you to confirm a fix.
            </p>

            <div className="mt-5 overflow-hidden border border-black/10 bg-white">
              <div className="border-b border-black/10 px-4 py-2 font-mono text-xs text-black/55">
                .casper/policies.yaml
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-black">
                <code>{`policies:
  - id: rds-deletion-protection
    resource: aws_db_instance
    rules:
      - arg: deletion_protection
        must_equal: "true"
    message: "RDS instances must have deletion_protection enabled"

  - id: rds-backup-retention
    resource: aws_db_instance
    rules:
      - arg: backup_retention_period
        min_value: 7
    message: "RDS instances must retain backups for at least 7 days"

  - id: everything-needs-an-owner
    resource: "*"             # apply to every resource type
    rules:
      - arg: owner
        required: true
    message: "All resources must have an owner argument"`}</code>
              </pre>
            </div>

            <h4 className="mb-3 mt-8 text-sm font-semibold text-black">
              Supported rule types
            </h4>
            <div className="overflow-x-auto border border-black/10 bg-white">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[160px_1fr_190px] gap-4 border-b border-black/10 bg-[var(--surface-2)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-black/55">
                  <span>Rule</span>
                  <span>Behavior</span>
                  <span>Example</span>
                </div>
                {[
                  ["must_equal", "Argument must be present and equal to this value", `deletion_protection: "true"`],
                  ["must_not_equal", "Argument, if present, must not equal this value", `acl: "public-read"`],
                  ["required", "Argument must be present and non-empty", "description: required"],
                  ["min_value", "Argument must parse as a number >= this value", "backup_retention_period: 7"],
                ].map(([rule, behavior, example], i) => (
                  <div
                    key={rule}
                    className={`grid grid-cols-[160px_1fr_190px] gap-4 px-4 py-3 text-sm ${
                      i > 0 ? "border-t border-black/10" : ""
                    }`}
                  >
                    <code className="font-mono text-black">{rule}</code>
                    <span className="text-black/70">{behavior}</span>
                    <code className="font-mono text-xs text-black/70">
                      {example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-black/70">
              Multiple rules in one policy AND together. Each violation
              appears as its own entry in the response, so the agent gets
              full diagnostics on the first call.
            </p>
          </article>

          <article id="workflow-rules" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <h3 className="text-xl font-semibold text-black">
              Workflow rules
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              Workflow rules don&rsquo;t enforce arguments. They classify the{" "}
              <em>change itself</em> and route it to a decision:{" "}
              <code className="font-mono text-black">allow</code>,{" "}
              <code className="font-mono text-black">require_approval</code>,{" "}
              <code className="font-mono text-black">require_security_review</code>,
              or <code className="font-mono text-black">block</code>. The
              agent reads the decision and follows it.
            </p>

            <div className="mt-5 overflow-hidden border border-black/10 bg-white">
              <div className="border-b border-black/10 px-4 py-2 font-mono text-xs text-black/55">
                .casper/policies.yaml
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-black">
                <code>{`workflow_rules:
  - id: prod-database-destroy-block
    when:
      env: prod
      resource_type_family: database
      operation: destroy
    decision: block
    reason: "DB destroys in prod require a manual ticket"

  - id: prod-changes-require-approval
    when:
      env: prod
      operation: [create, modify, destroy]
    decision: require_approval

  - id: iam-needs-security-review
    when:
      resource_type_family: iam
    decision: require_security_review`}</code>
              </pre>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-black/70">
              A rule fires when every non-empty field in{" "}
              <code className="font-mono text-black">when:</code> matches.
              Empty fields are wildcards. For a single change the strictest
              decision wins overall:{" "}
              <code className="font-mono text-black">block</code> &gt;{" "}
              <code className="font-mono text-black">require_security_review</code>{" "}
              &gt;{" "}
              <code className="font-mono text-black">require_approval</code>{" "}
              &gt; <code className="font-mono text-black">allow</code>.
            </p>
          </article>

          <article id="policy-violations" className="mt-16 scroll-mt-20 border-t border-black/10 pt-12">
            <h3 className="text-xl font-semibold text-black">
              How violations surface to the agent
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-black/70">
              Every{" "}
              <code className="font-mono text-black">simulate_impact</code>{" "}
              response carries a{" "}
              <code className="font-mono text-black">policy_violations[]</code>{" "}
              array and a{" "}
              <code className="font-mono text-black">workflow_decision</code>{" "}
              object. The agent&rsquo;s system prompt tells it to read these
              before presenting the change to you.
            </p>

            <div className="mt-5 overflow-hidden border border-black/10 bg-white">
              <div className="border-b border-black/10 px-4 py-2 font-mono text-xs text-black/55">
                simulate_impact response
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-black">
                <code>{`{
  "summary": "1 created, 0 modified, 0 in blast radius",
  "created": [...],
  "policy_violations": [
    {
      "policy_id": "rds-deletion-protection",
      "resource": "aws_db_instance.orders_replica",
      "type": "aws_db_instance",
      "message": "RDS instances must have deletion_protection enabled",
      "details": "argument \\"deletion_protection\\" must be \\"true\\" (not set)"
    }
  ],
  "workflow_decision": {
    "decision": "require_approval",
    "matched_rules": [
      { "id": "prod-changes-require-approval", "reason": "env=prod, operation=create" }
    ],
    "blocked": false
  }
}`}</code>
              </pre>
            </div>

            <div className="mt-6 border-l-2 border-[var(--accent)] bg-[var(--surface-2)] px-4 py-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                Live reload
              </div>
              <p className="text-sm leading-6 text-black/70">
                Casper watches{" "}
                <code className="font-mono text-black">.casper/policies.yaml</code>{" "}
                alongside the rest of the repo. Edit, save, and the next tool
                call uses the new policies. No server restart needed.
              </p>
            </div>
          </article>

          <div className="mb-8 mt-20 border-t border-black/10 pt-12">
            <div className="text-xs uppercase tracking-[0.22em] text-black/60">
              Tools
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-black">
              All 10 tools, in detail
            </h2>
          </div>

          <div className="space-y-16">
            {tools.map((t) => (
              <article
                key={t.id}
                id={t.id}
                className="scroll-mt-20 border-t border-black/10 pt-10"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-mono text-2xl text-black">{t.name}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-black/55">
                    {t.tagline}
                  </span>
                </div>
                <p className="mt-4 max-w-3xl leading-7 text-black/70">
                  {t.description}
                </p>

                <div className="mt-5 max-w-4xl border-l-2 border-[var(--accent)] bg-[var(--surface-2)] px-4 py-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                    Why it exists
                  </div>
                  <p className="text-sm leading-6 text-black/70">
                    {t.whyItExists}
                  </p>
                </div>

                {t.params.length > 0 && (
                  <div className="mt-8">
                    <h4 className="mb-3 text-sm font-semibold text-black">
                      Parameters
                    </h4>
                    <div className="overflow-x-auto border border-black/10 bg-white">
                      <div className="min-w-[760px]">
                        <div className="grid grid-cols-[160px_120px_60px_1fr] gap-4 border-b border-black/10 bg-[var(--surface-2)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-black/55">
                          <span>Name</span>
                          <span>Type</span>
                          <span>Req.</span>
                          <span>Description</span>
                        </div>
                        {t.params.map((p, i) => (
                          <div
                            key={p.name}
                            className={`grid grid-cols-[160px_120px_60px_1fr] gap-4 px-4 py-3 text-sm ${
                              i > 0 ? "border-t border-black/10" : ""
                            }`}
                          >
                            <code className="font-mono text-black">{p.name}</code>
                            <code className="font-mono text-black/70">{p.type}</code>
                            <span
                              className={
                                p.required
                                  ? "font-medium text-black"
                                  : "text-black/45"
                              }
                            >
                              {p.required ? "yes" : "no"}
                            </span>
                            <span className="text-black/70">{p.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="mb-3 text-sm font-semibold text-black">
                    Returns
                  </h4>
                  <div className="overflow-x-auto border border-black/10 bg-white px-4 py-3 font-mono text-sm text-black">
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
    <div className="overflow-hidden border border-black/10 bg-white">
      <div className="border-b border-black/10 px-4 py-2 font-mono text-xs text-black/55">
        {label}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-black">
        <code>{code}</code>
      </pre>
    </div>
  );
}
