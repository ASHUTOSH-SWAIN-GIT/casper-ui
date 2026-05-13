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
      "Most infra tasks need the same four pieces of context to be answered well. Forcing the agent to fetch them separately wastes round-trips and burns context. get_context bundles them so the agent gets enough grounding from a single call to draft Terraform that fits the codebase.",
    params: [
      { name: "intent", type: "string", required: true, desc: "Free-text description of the task being worked on." },
      { name: "resource_type", type: "string", required: false, desc: "Optional filter narrowing the response to one Terraform type." },
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
      "Searches the graph for resources by name, address, type, tag, or attribute and returns full records including source file and line.",
    whyItExists:
      "Pinpoint lookups (\"the production database\", \"every bucket tagged Env=staging\") are the most common infra question. Casper exposes them as a typed search instead of leaving the agent to grep raw .tf files — fast, exact, and constant in token cost regardless of repo size.",
    params: [
      { name: "query", type: "string", required: true, desc: "Substring or attribute match against name, address, or tags." },
      { name: "type", type: "string", required: false, desc: "Restrict results to a single Terraform resource type." },
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
      "Walks the graph from a given resource and returns both upstream edges (what it depends on) and downstream edges (what depends on it), up to a configurable depth.",
    whyItExists:
      "Modify and destroy operations are dangerous when blast radius is invisible. By exposing the dependency walk as a first-class call, Casper makes it trivial to answer \"what breaks if this changes?\" before the change is proposed — not after it ships.",
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
      "Returns existing resources of a given type, optionally filtered by attribute, formatted as full HCL blocks alongside their source location.",
    whyItExists:
      "New code that doesn't look like the rest of the codebase creates review friction. find_similar surfaces real, working examples from the same repo so authored Terraform mirrors existing arg order, tagging style, and module call patterns by default.",
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
      "Aggregates how a Terraform resource type is configured across the repo: which arguments are commonly set, which tag keys recur, and the modal values for each argument.",
    whyItExists:
      "Conventions live in the diff between what's possible and what this team actually does. Reading the Terraform provider docs gives the former; this tool gives the latter — so authored code matches house style without anyone writing it down.",
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
      "Parses proposed HCL and returns a structured impact report: created, modified, and destroyed resources, broken references, similar real examples, reversibility context, and any policy violations the change would trigger.",
    whyItExists:
      "Terraform plan tells you what changes; it doesn't tell you what breaks downstream, what policy rule it trips, or whether the operation is reversible. simulate_impact answers all three before a single tf file is written, so unsafe changes get caught before review — not in production.",
    params: [
      { name: "hcl", type: "string", required: true, desc: "Proposed Terraform code as a string." },
      { name: "operation", type: "create | modify | destroy", required: true, desc: "What the change is intended to do." },
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
      "Calls read-only AWS Describe APIs for a given resource address and diffs the live attributes against what Terraform state declares. Returns whether the resource is in sync and, if not, the per-attribute diff.",
    whyItExists:
      "Terraform state lies. Manual changes, partial applies, and out-of-band edits drift the real cloud away from the file. Without a way to detect this from inside the agent loop, every change is built on assumptions. This tool grounds the agent in what AWS actually has — not what was last applied.",
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
    requirements: [
      {
        title: "AWS credentials required",
        body: "This is the only tool that talks to AWS. Casper uses the standard AWS SDK credential chain, so any method the AWS CLI accepts will work. Credentials must have read-only Describe permissions for the resource types you query (e.g. rds:DescribeDBInstances, ec2:DescribeInstances, s3:GetBucket*). A managed policy like ReadOnlyAccess covers everything.",
      },
      {
        title: "Option 1 — environment variables",
        body: "Export these in the shell that launches your MCP client (Claude Code, Cursor, etc.). Casper inherits the environment.",
        codeLabel: "shell",
        code: `export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
# optional, if using temporary creds:
export AWS_SESSION_TOKEN=...`,
      },
      {
        title: "Option 2 — shared profile (~/.aws/credentials)",
        body: "Configure a named profile once, then point Casper at it via AWS_PROFILE. Best if you already use the AWS CLI.",
        codeLabel: "~/.aws/credentials",
        code: `[casper]
aws_access_key_id = AKIA...
aws_secret_access_key = ...
region = us-east-1

# then, in the shell that launches your MCP client:
export AWS_PROFILE=casper`,
      },
      {
        title: "Option 3 — SSO / assume-role",
        body: "For orgs on IAM Identity Center, run aws sso login first; Casper picks up the cached credentials. For cross-account access, configure a profile with role_arn + source_profile and set AWS_PROFILE — the SDK handles the AssumeRole call.",
        codeLabel: "shell",
        code: `aws sso login --profile casper
export AWS_PROFILE=casper`,
      },
    ],
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
    id: "render_graph",
    name: "render_graph",
    tagline: "Interactive HTML graph",
    description:
      "Writes an interactive HTML rendering of the current graph to casper/graph.html and returns the absolute path. After the first call, the file auto-updates whenever .tf files change.",
    whyItExists:
      "A typed graph is useful to the agent, but humans want a picture. render_graph materializes the graph into a self-contained HTML file the user can open in any browser — pan, zoom, filter, click through to source. The /casper slash command calls this so the user always has a fresh visual alongside the conversation.",
    params: [],
    returns: "{ status: \"rendered\", path: string, scanned_dir: string, resource_count: number, edge_count: number }",
    exampleCall: `render_graph({})`,
    exampleResponse: `{
  "status": "rendered",
  "path": "/Users/you/code/infra/casper/graph.html",
  "scanned_dir": "/Users/you/code/infra",
  "resource_count": 214,
  "edge_count": 318
}`,
  },
  {
    id: "dump_graph",
    name: "dump_graph",
    tagline: "Full snapshot",
    description:
      "Returns the entire loaded graph: every resource node, every dependency edge, and every active policy violation. Intentionally verbose.",
    whyItExists:
      "Some tasks need the whole picture at once: audits, external visualizations, debugging Casper itself. Rather than chaining dozens of targeted calls, dump_graph hands the full snapshot back in one shot. Reach for it when no narrower tool fits.",
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
