export type Param = {
  name: string;
  type: string;
  required: boolean;
  desc: string;
};

export type Requirement = {
  title: string;
  body: string;
  code?: string;
  codeLabel?: string;
};

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  whyItExists: string;
  params: Param[];
  returns: string;
  exampleCall: string;
  exampleResponse: string;
  requirements?: Requirement[];
};

export const tools: Tool[] = [
  {
    id: "get_context",
    name: "get_context",
    tagline: "One-shot infra context",
    description:
      "Returns a bundled view of the graph for a given intent: matching resources, similar HCL examples, reusable modules, and the conventions the codebase already follows. One call replaces what would otherwise be three or four targeted lookups.",
    whyItExists:
      "Bundles four common lookups so the agent gets enough grounding from a single call to draft Terraform that fits the codebase.",
    params: [
      { name: "intent", type: "string", required: true, desc: "Free-text description of what you're trying to build or understand." },
    ],
    returns:
      "{ existing_resources: Resource[], similar_examples: Resource[], modules: Resource[], conventions: Resource[] }",
    exampleCall: `get_context({ intent: "postgres read replica" })`,
    exampleResponse: `{
  "existing_resources": [
    { "Identifier": "aws_db_instance.orders_primary", "Type": "aws_db_instance" }
  ],
  "similar_examples": [
    { "Identifier": "aws_db_instance.orders_replica", "Attributes": { "arguments": { ... } } }
  ],
  "modules": [
    { "Identifier": "modules/rds", "Type": "terraform_module" }
  ],
  "conventions": [
    { "Identifier": "modules/rds:aws_db_instance", "Type": "terraform_convention" }
  ]
}`,
  },
  {
    id: "find_resource",
    name: "find_resource",
    tagline: "Targeted search",
    description:
      "Searches the graph for resources by name, type, provider, tag, or attribute. Returns up to `limit` matches with full arguments and source path.",
    whyItExists:
      "Typed search beats grepping raw .tf files — exact, structured, constant in token cost regardless of repo size.",
    params: [
      { name: "query", type: "string", required: false, desc: "Free-text query matched against name, type, tags, attributes. Optional if you pass type or provider." },
      { name: "type", type: "string", required: false, desc: "Restrict to a single Terraform resource type (e.g. aws_db_instance)." },
      { name: "provider", type: "string", required: false, desc: "Restrict to a single provider (aws, kubernetes, datadog, …)." },
      { name: "limit", type: "number", required: false, desc: "Max results. Default 25, max 200." },
    ],
    returns: "{ matches: Resource[], truncated: boolean }",
    exampleCall: `find_resource({ query: "orders_primary", type: "aws_db_instance" })`,
    exampleResponse: `{
  "matches": [
    {
      "ID": "tfres_c235ce39db5e57b52cf0da98",
      "Type": "aws_db_instance",
      "Provider": "aws",
      "Identifier": "aws_db_instance.orders_primary",
      "Source": "/path/to/repo/services/orders",
      "Attributes": { "arguments": { "engine": "postgres", "instance_class": "var.instance_class" } }
    }
  ],
  "truncated": false
}`,
  },
  {
    id: "list_providers",
    name: "list_providers",
    tagline: "Provider inventory",
    description:
      "Returns every Terraform provider in use across the repo with a resource count and the top resource types per provider. A cheap, high-signal summary of what's deployed.",
    whyItExists:
      "Before drilling into any specific resource, the agent often needs a one-shot view of what kinds of infrastructure exist — AWS only, or AWS + Datadog + Kubernetes? This avoids grepping versions.tf or required_providers blocks and avoids dumping the full graph just to count things.",
    params: [],
    returns: "{ provider_count: number, providers: { provider, resource_count, top_types: { type, count }[] }[] }",
    exampleCall: `list_providers({})`,
    exampleResponse: `{
  "provider_count": 2,
  "providers": [
    {
      "provider": "aws",
      "resource_count": 214,
      "top_types": [
        { "type": "aws_iam_policy", "count": 42 },
        { "type": "aws_security_group", "count": 31 },
        { "type": "aws_s3_bucket", "count": 18 }
      ]
    },
    {
      "provider": "datadog",
      "resource_count": 12,
      "top_types": [
        { "type": "datadog_monitor", "count": 9 },
        { "type": "datadog_dashboard", "count": 3 }
      ]
    }
  ]
}`,
  },
  {
    id: "get_dependencies",
    name: "get_dependencies",
    tagline: "Dependency graph",
    description:
      "Returns dependencies for a given Casper resource ID — both what it depends on (upstream) and what depends on it (downstream).",
    whyItExists:
      "Makes \"what breaks if this changes?\" answerable before a change ships — not after.",
    params: [
      { name: "resource_id", type: "string", required: true, desc: "Casper resource ID returned by find_resource or get_context." },
      { name: "limit", type: "number", required: false, desc: "Max results. Default 50, max 500." },
    ],
    returns: "{ dependencies: DependencyResult[], truncated?: boolean }",
    exampleCall: `get_dependencies({ resource_id: "tfres_c235ce39db5e57b52cf0da98" })`,
    exampleResponse: `{
  "dependencies": [
    {
      "Direction": "dependency",
      "Kind": "reference",
      "Resource": { "Identifier": "aws_security_group.app", "Type": "aws_security_group" }
    },
    {
      "Direction": "dependent",
      "Kind": "reference",
      "Resource": { "Identifier": "aws_db_instance.orders_replica", "Type": "aws_db_instance" }
    }
  ]
}`,
  },
  {
    id: "find_similar",
    name: "find_similar",
    tagline: "HCL examples",
    description:
      "Finds existing resources or modules that match a natural-language description and returns them as concrete examples to base new code on. Synonym expansion handles common abbreviations (rds → aws_db_instance, vpc → aws_vpc, replica → replicate_source_db).",
    whyItExists:
      "Real working examples from the same repo prevent authored code from drifting away from house style.",
    params: [
      { name: "description", type: "string", required: true, desc: "Natural-language description (e.g. \"read replica\", \"postgres database\", \"security group\")." },
    ],
    returns: "Resource[] — each with full attributes including the `arguments` HCL map",
    exampleCall: `find_similar({ description: "read replica" })`,
    exampleResponse: `[
  {
    "Identifier": "aws_db_instance.orders_replica",
    "Type": "aws_db_instance",
    "Attributes": {
      "arguments": {
        "replicate_source_db": "aws_db_instance.orders_primary.identifier",
        "instance_class": "var.instance_class"
      }
    }
  }
]`,
  },
  {
    id: "get_module_for",
    name: "get_module_for",
    tagline: "Reuse what exists",
    description:
      "Discovers reusable modules in the codebase that match a given intent. Each result includes the module path, its inputs and outputs, and a usage snippet.",
    whyItExists:
      "Most infra repos already have wrappers for common patterns (VPC, RDS, ECS service, S3 bucket). Re-implementing those resources from scratch is a regression. This tool surfaces the existing module so it gets reused instead.",
    params: [
      { name: "intent", type: "string", required: true, desc: "Description of what is being built." },
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
      "Returns existing resources of a given type so the agent can see the actual arguments, tag style, and patterns this codebase uses for that type.",
    whyItExists:
      "Authored code matches house style without anyone writing the style guide down.",
    params: [
      { name: "resource_type", type: "string", required: true, desc: "Terraform resource type (e.g. aws_db_instance, aws_security_group)." },
    ],
    returns: "Resource[] — same shape as find_resource, ranked by argument richness",
    exampleCall: `get_conventions({ resource_type: "aws_db_instance" })`,
    exampleResponse: `[
  {
    "Identifier": "aws_db_instance.orders_primary",
    "Attributes": {
      "arguments": {
        "engine": "postgres",
        "engine_version": "15.4",
        "instance_class": "var.instance_class",
        "deletion_protection": "true"
      }
    }
  }
]`,
  },
  {
    id: "simulate_impact",
    name: "simulate_impact",
    tagline: "Plan before you apply",
    description:
      "Parses proposed HCL and returns a structured impact report: created/modified resources with arg diffs, blast radius, broken references, similar real examples, reversibility context, and any policy violations.",
    whyItExists:
      "Catches unsafe changes — broken refs, policy violations, dangerous blast radius — before the .tf is even written.",
    params: [
      { name: "code", type: "string", required: true, desc: "Proposed Terraform HCL — one or more resource blocks." },
    ],
    returns: "{ summary, created, modified, blast_radius, warnings, similar_examples, reversibility_context, policy_violations, workflow_decision }",
    exampleCall: `simulate_impact({
  code: "resource \\"aws_db_instance\\" \\"replica\\" { replicate_source_db = aws_db_instance.primary.identifier }"
})`,
    exampleResponse: `{
  "summary": "1 created, 0 modified, 1 in blast radius",
  "created": [{ "identifier": "aws_db_instance.replica", ... }],
  "blast_radius": [{ "identifier": "aws_db_instance.primary" }],
  "warnings": [],
  "policy_violations": [
    {
      "policy_id": "rds-deletion-protection",
      "resource": "aws_db_instance.replica",
      "message": "RDS instances must have deletion_protection enabled"
    }
  ]
}`,
  },
  {
    id: "describe_live_state",
    name: "describe_live_state",
    tagline: "AWS drift detection",
    description:
      "Resolves a set of resources from a natural-language intent or explicit IDs, calls read-only AWS Describe APIs for each, and returns per-resource drift between Terraform state and what AWS currently has.",
    whyItExists:
      "Grounds the agent in what AWS actually has — not what was last applied. Catches out-of-band drift before the next plan misreads it.",
    params: [
      { name: "intent", type: "string", required: false, desc: "Natural-language description (e.g. \"orders database\"). Resolved via graph search + one-hop dependency walk." },
      { name: "resource_ids", type: "string[]", required: false, desc: "Explicit Casper resource identifiers. Skips graph resolution. At least one of intent or resource_ids is required." },
    ],
    returns: "{ scope_resources, resources: ResourceState[], not_in_terraform, errors }",
    exampleCall: `describe_live_state({ intent: "orders database" })`,
    exampleResponse: `{
  "scope_resources": ["aws_db_instance.orders_primary"],
  "resources": [
    {
      "identifier": "aws_db_instance.orders_primary",
      "type": "aws_db_instance",
      "drift": [
        { "field": "backup_retention_period", "terraform_value": "7", "aws_value": "14" }
      ]
    }
  ]
}`,
  },
  {
    id: "list_state_sources",
    name: "list_state_sources",
    tagline: "Remote state status",
    description:
      "Lists every remote Terraform state backend Casper discovered in this repo's .tf files, along with the last fetch status. Failed fetches include the verbatim error so the cause (usually AWS auth, wrong bucket/key, or NoSuchKey) is obvious.",
    whyItExists:
      "When a resource the user expects is missing from the graph, the answer is almost always \"the state file failed to load.\" Without this tool, the agent has to guess. With it, the agent can point at the specific backend that failed and explain what to fix — typically credentials or a bucket policy.",
    params: [],
    returns: "{ total: number, loaded: number, failed: number, sources: { type, identity, bucket, key, region, declared_in, status, error?, resource_count, edge_count }[] }",
    exampleCall: `list_state_sources({})`,
    exampleResponse: `{
  "total": 2,
  "loaded": 1,
  "failed": 1,
  "sources": [
    {
      "type": "s3",
      "identity": "s3://acme-tfstate/prod/terraform.tfstate",
      "bucket": "acme-tfstate",
      "key": "prod/terraform.tfstate",
      "region": "us-east-1",
      "declared_in": "envs/prod/backend.tf",
      "status": "loaded",
      "resource_count": 214,
      "edge_count": 318
    },
    {
      "type": "s3",
      "identity": "s3://acme-tfstate/staging/terraform.tfstate",
      "bucket": "acme-tfstate",
      "key": "staging/terraform.tfstate",
      "region": "us-east-1",
      "declared_in": "envs/staging/backend.tf",
      "status": "failed",
      "error": "AccessDenied: User is not authorized to perform s3:GetObject",
      "resource_count": 0,
      "edge_count": 0
    }
  ]
}`,
  },
  {
    id: "dump_graph",
    name: "dump_graph",
    tagline: "Full snapshot",
    description:
      "Returns the complete graph — every resource, every edge, every policy violation per resource. Intentionally verbose; use only for full-repo audits or when bootstrapping a UI.",
    whyItExists:
      "When you genuinely need every node. For any filtered question, find_resource is dramatically cheaper.",
    params: [],
    returns: "{ fetched_at, resource_count, dep_count, resources_by_type, resources, dependencies }",
    exampleCall: `dump_graph({})`,
    exampleResponse: `{
  "fetched_at": "2026-05-14T09:30:00Z",
  "resource_count": 247,
  "dep_count": 318,
  "resources": [ /* every resource */ ],
  "dependencies": [ /* every edge */ ]
}`,
  },
  {
    id: "render_graph",
    name: "render_graph",
    tagline: "Utility — writes graph.html",
    description:
      "Materializes the in-memory graph to an interactive HTML file (default casper/graph.html). The only tool that writes a file. After the first call, the file auto-updates on every .tf / .tfstate change. Used by the /casper slash command so the user has a fresh visual alongside the conversation.",
    whyItExists:
      "Agents read the typed graph. Humans want a picture. Lazy by design — no file lands on disk until this fires.",
    params: [],
    returns: "{ status: \"rendered\", path, scanned_dir, resource_count, edge_count }",
    exampleCall: `render_graph({})`,
    exampleResponse: `{
  "status": "rendered",
  "path": "/Users/you/repo/casper/graph.html",
  "scanned_dir": "/Users/you/repo",
  "resource_count": 247,
  "edge_count": 318
}`,
  },
];
