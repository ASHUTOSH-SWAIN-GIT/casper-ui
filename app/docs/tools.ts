export type Param = {
  name: string;
  type: string;
  required: boolean;
  desc: string;
};

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  whenToUse: string;
  params: Param[];
  returns: string;
  exampleCall: string;
  exampleResponse: string;
};

export const tools: Tool[] = [
  {
    id: "get_context",
    name: "get_context",
    tagline: "One-shot infra context",
    description:
      "Combined lookup that returns existing resources, similar examples, matching modules, and codebase conventions in a single call. This is the recommended entry point for almost every infrastructure task — start here so the agent doesn't make redundant follow-up calls.",
    whenToUse:
      "Call this first whenever the agent receives a task involving infrastructure (\"add an RDS replica\", \"create a new SQS queue\", \"refactor the IAM role for the data team\"). The response gives enough grounding to draft Terraform that matches existing conventions.",
    params: [
      { name: "intent", type: "string", required: true, desc: "Free-text description of what the agent is trying to do." },
      { name: "resource_type", type: "string", required: false, desc: "Optional filter to a Terraform resource type, e.g. aws_db_instance." },
    ],
    returns:
      "{ resources: Resource[], examples: HclBlock[], modules: Module[], conventions: { common_args, common_tags, modal_values } }",
    exampleCall: `get_context({
  intent: "add an RDS replica for prod",
  resource_type: "aws_db_instance"
})`,
    exampleResponse: `{
  "resources": [
    { "address": "aws_db_instance.prod", "engine": "postgres", "multi_az": true }
  ],
  "examples": ["resource \\"aws_db_instance\\" \\"prod\\" { ... }"],
  "modules": [],
  "conventions": {
    "common_args": ["backup_retention_period=14", "deletion_protection=true"],
    "common_tags": { "Env": "prod", "Owner": "platform" }
  }
}`,
  },
  {
    id: "find_resource",
    name: "find_resource",
    tagline: "Targeted search",
    description:
      "Searches resources by name, type, tag, or attribute across every .tf and .tfstate file in the loaded graph. Returns full resource records including source location.",
    whenToUse:
      "Use when the agent needs to look up a specific known resource — e.g. \"find the production database\", \"show all S3 buckets tagged Env=staging\".",
    params: [
      { name: "query", type: "string", required: true, desc: "Substring or attribute match against name, address, or tags." },
      { name: "type", type: "string", required: false, desc: "Restrict results to a Terraform resource type." },
    ],
    returns: "Resource[] — { address, type, name, attrs, tags, source: { file, line } }",
    exampleCall: `find_resource({ query: "prod", type: "aws_db_instance" })`,
    exampleResponse: `[
  {
    "address": "aws_db_instance.prod",
    "type": "aws_db_instance",
    "name": "prod",
    "attrs": { "engine": "postgres", "instance_class": "db.r6g.xlarge" },
    "source": { "file": "modules/rds/main.tf", "line": 12 }
  }
]`,
  },
  {
    id: "get_dependencies",
    name: "get_dependencies",
    tagline: "Dependency graph",
    description:
      "Walks the dependency graph for a resource and returns both upstream (what this depends on) and downstream (what depends on this) edges, up to a configurable depth.",
    whenToUse:
      "Critical before any destroy or breaking-change operation. Also useful for impact analysis (\"if I rotate this IAM role, what gets affected?\").",
    params: [
      { name: "address", type: "string", required: true, desc: "Resource address, e.g. aws_db_instance.prod." },
      { name: "depth", type: "number", required: false, desc: "Hop limit. Defaults to 2." },
    ],
    returns: "{ upstream: Edge[], downstream: Edge[] } where Edge = { from, to, kind }",
    exampleCall: `get_dependencies({ address: "aws_db_instance.prod", depth: 3 })`,
    exampleResponse: `{
  "upstream": [
    { "from": "aws_subnet.private_a", "to": "aws_db_instance.prod", "kind": "ref" }
  ],
  "downstream": [
    { "from": "aws_db_instance.prod", "to": "aws_lambda_function.api", "kind": "env" }
  ]
}`,
  },
  {
    id: "find_similar",
    name: "find_similar",
    tagline: "Pattern lookup",
    description:
      "Returns resources of the same type that match optional attribute filters, formatted as full HCL blocks. Treat the response as ready-made examples for the agent to mirror.",
    whenToUse:
      "Use when authoring a new resource and you want it to look like the rest of the codebase — same arg order, same tagging style, same module call patterns.",
    params: [
      { name: "type", type: "string", required: true, desc: "Resource type to search for." },
      { name: "match", type: "object", required: false, desc: "Attribute filters, e.g. { engine: \"postgres\" }." },
    ],
    returns: "Example[] — { hcl, source: { file, line } }",
    exampleCall: `find_similar({
  type: "aws_db_instance",
  match: { engine: "postgres" }
})`,
    exampleResponse: `[
  {
    "hcl": "resource \\"aws_db_instance\\" \\"prod\\" {\\n  engine = \\"postgres\\"\\n  ...\\n}",
    "source": { "file": "modules/rds/main.tf", "line": 12 }
  }
]`,
  },
  {
    id: "get_module_for",
    name: "get_module_for",
    tagline: "Reuse what exists",
    description:
      "Discovers reusable modules in the codebase that match the given intent. Returns the module path, its inputs and outputs, and a usage snippet so the agent can call it instead of writing the resource from scratch.",
    whenToUse:
      "Always call this before authoring raw resources for common patterns (VPC, RDS, ECS service, S3 bucket). If a module already exists, reuse it.",
    params: [
      { name: "intent", type: "string", required: true, desc: "What the agent is building." },
    ],
    returns: "Module[] — { path, inputs, outputs, example_call }",
    exampleCall: `get_module_for({ intent: "create a postgres database with backups" })`,
    exampleResponse: `[
  {
    "path": "modules/rds",
    "inputs": ["name", "engine", "instance_class", "backup_retention"],
    "outputs": ["endpoint", "arn"],
    "example_call": "module \\"db\\" {\\n  source = \\"./modules/rds\\"\\n  ...\\n}"
  }
]`,
  },
  {
    id: "get_conventions",
    name: "get_conventions",
    tagline: "How this codebase configures X",
    description:
      "Aggregates how a resource type is configured across the codebase — common arguments, recurring tag keys, and modal values for each argument.",
    whenToUse:
      "Use to enforce consistency when authoring a new resource type the agent hasn't touched before in this repo.",
    params: [
      { name: "type", type: "string", required: true, desc: "Terraform resource type." },
    ],
    returns: "{ common_args: string[], common_tags: Record<string,string>, modal_values: Record<string,string> }",
    exampleCall: `get_conventions({ type: "aws_s3_bucket" })`,
    exampleResponse: `{
  "common_args": ["versioning", "server_side_encryption_configuration"],
  "common_tags": { "Owner": "platform", "Env": "prod" },
  "modal_values": { "acl": "private" }
}`,
  },
  {
    id: "simulate_impact",
    name: "simulate_impact",
    tagline: "Plan before you apply",
    description:
      "Parses proposed HCL and returns a structured impact report: created/modified/destroyed resources, broken references, similar real examples, reversibility context, and policy violations. This is the safety net before suggesting an apply.",
    whenToUse:
      "Always call this after drafting Terraform and before presenting code to the user. If the response shows policy violations or broken refs, fix the draft first.",
    params: [
      { name: "hcl", type: "string", required: true, desc: "Proposed Terraform code as a string." },
      { name: "operation", type: "create | modify | destroy", required: true, desc: "What the agent intends to do." },
    ],
    returns: "{ created, modified, destroyed, broken_refs, policy_violations, reversibility }",
    exampleCall: `simulate_impact({
  hcl: "resource \\"aws_db_instance\\" \\"prod_replica\\" { ... }",
  operation: "create"
})`,
    exampleResponse: `{
  "created": ["aws_db_instance.prod_replica"],
  "modified": [],
  "destroyed": [],
  "broken_refs": [],
  "policy_violations": [],
  "reversibility": "reversible"
}`,
  },
  {
    id: "describe_live_state",
    name: "describe_live_state",
    tagline: "AWS drift detection",
    description:
      "Compares Terraform state against live AWS via read-only Describe APIs. Returns whether the resource is in sync, plus an attribute-level diff when it isn't.",
    whenToUse:
      "Use when the agent needs to check reality vs. declared state — before any modify operation, or as a periodic drift report.",
    params: [
      { name: "address", type: "string", required: true, desc: "Resource address, e.g. aws_db_instance.prod." },
    ],
    returns: "{ in_sync: boolean, diffs: { attr, terraform, live }[] }",
    exampleCall: `describe_live_state({ address: "aws_db_instance.prod" })`,
    exampleResponse: `{
  "in_sync": false,
  "diffs": [
    { "attr": "backup_retention_period", "terraform": 7, "live": 14 }
  ]
}`,
  },
  {
    id: "load_repo",
    name: "load_repo",
    tagline: "Swap the graph",
    description:
      "Clones a GitHub repository to a temp dir, runs the full ingest pipeline, and swaps the live graph in place. No server restart required — the next tool call operates on the new repo.",
    whenToUse:
      "For multi-repo agents, onboarding flows, or comparing two infra repos in a single session.",
    params: [
      { name: "url", type: "string", required: true, desc: "GitHub repository URL (https or ssh)." },
      { name: "token", type: "string", required: false, desc: "Optional GitHub PAT for private repos." },
    ],
    returns: "{ resources_loaded: number, dependencies_loaded: number, took_ms: number }",
    exampleCall: `load_repo({ url: "https://github.com/acme/infra" })`,
    exampleResponse: `{
  "resources_loaded": 312,
  "dependencies_loaded": 487,
  "took_ms": 1840
}`,
  },
  {
    id: "dump_graph",
    name: "dump_graph",
    tagline: "Full snapshot",
    description:
      "Returns a complete snapshot of the loaded graph — every resource, every edge, and every active policy violation. Use sparingly; this is intentionally verbose.",
    whenToUse:
      "For debugging, audits, or when building external visualizations on top of Casper. Most agent workflows should prefer find_resource or get_context.",
    params: [],
    returns: "{ nodes: Resource[], edges: Edge[], policy_violations: Violation[] }",
    exampleCall: `dump_graph({})`,
    exampleResponse: `{
  "nodes": [ /* every resource */ ],
  "edges": [ /* every dependency */ ],
  "policy_violations": [
    { "policy_id": "rds-deletion-protection", "address": "aws_db_instance.staging" }
  ]
}`,
  },
];
