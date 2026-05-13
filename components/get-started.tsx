"use client";

import { useState } from "react";

type Mode = "quick" | "manual";

const quickSteps = [
  {
    label: "Install",
    desc: "Auto-detects Claude Code, Claude Desktop, Cursor, and Codex on your machine and wires each one up. No init command needed.",
    code: "npm install -g casper-mcp",
  },
  {
    label: "Restart your MCP client",
    desc: "Quit and reopen Claude Code, Claude Desktop, Cursor, or Codex CLI. The Casper server starts automatically. The graph view (casper/graph.html) materializes the first time you run /casper or call render_graph.",
    code: "# Cmd+Q, then reopen",
  },
  {
    label: "Use it",
    desc: "In Claude Code, run /casper for a guided session. In any client, just ask infra questions. The agent will reach for Casper's tools.",
    code: "/casper",
  },
];

const manualConfigs = [
  {
    id: "claude-code",
    label: "Claude Code",
    file: ".mcp.json",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "casper-mcp",
      "args": ["serve", "--dir", ".", "--html", "casper/graph.html"]
    }
  }
}`,
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    file: "claude_desktop_config.json",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "casper-mcp",
      "args": ["serve", "--dir", "/path/to/your/terraform", "--html", "casper/graph.html"]
    }
  }
}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    file: ".cursor/mcp.json",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "casper-mcp",
      "args": ["serve", "--dir", "/path/to/your/terraform", "--html", "casper/graph.html"]
    }
  }
}`,
  },
  {
    id: "codex",
    label: "Codex CLI",
    file: "~/.codex/config.toml",
    code: `[mcp_servers.casper]
command = "casper-mcp"
args = ["serve", "--dir", ".", "--html", "casper/graph.html"]`,
  },
];

export function GetStarted() {
  const [mode, setMode] = useState<Mode>("quick");
  const [activeClient, setActiveClient] = useState(manualConfigs[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1200);
  };

  const currentManual = manualConfigs.find((c) => c.id === activeClient)!;

  return (
    <div className="border border-black/10 bg-white">
      <div className="flex flex-col gap-3 border-b border-black/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          <span className="font-mono text-xs text-black/60">
            get started
          </span>
        </div>
        <div className="flex w-fit border border-black/10 bg-white p-0.5 text-xs">
          <button
            onClick={() => setMode("quick")}
            className={`px-3 py-1 transition ${
              mode === "quick"
                ? "bg-[var(--surface-2)] text-black"
                : "text-black/65 hover:text-black"
            }`}
          >
            Quick
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-3 py-1 transition ${
              mode === "manual"
                ? "bg-[var(--surface-2)] text-black"
                : "text-black/65 hover:text-black"
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {mode === "quick" ? (
          <div className="animate-fadeUp">
            <div className="mb-5 inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              <span className="size-1.5 rounded-full bg-[var(--accent)]" />
              No <code className="font-mono">init</code> command. Install auto-wires every MCP client it detects.
            </div>
            <ol className="space-y-3">
              {quickSteps.map((step, i) => {
                const key = `quick-${i}`;
                return (
                  <li
                    key={step.label}
                    className="group relative border border-black/10 bg-white p-4 transition hover:bg-[var(--surface-2)]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center border border-black/15 font-mono text-xs text-black">
                        0{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-black">
                            {step.label}
                          </h4>
                          <button
                            onClick={() => copy(key, step.code)}
                            className="font-mono text-[11px] text-black/45 transition hover:text-black"
                          >
                            {copiedKey === key ? "copied" : "copy"}
                          </button>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-black/65">
                          {step.desc}
                        </p>
                        <div className="mt-3 overflow-x-auto border border-black/10 bg-white px-3 py-2 font-mono text-[13px] text-black">
                          <span className="select-none text-black/45">$ </span>
                          {step.code}
                        </div>
                      </div>
                    </div>
                    {i < quickSteps.length - 1 && (
                      <span
                        className="absolute -bottom-3 left-[28px] h-3 w-px bg-black/10"
                        aria-hidden
                      />
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-xs leading-6 text-black/60">
              The graph renders to{" "}
              <code className="font-mono text-black">casper/graph.html</code>{" "}
              and stays in sync as your Terraform changes. Delete it and it
              regenerates within ~5 seconds.
            </p>
          </div>
        ) : (
          <div className="animate-fadeUp">
            <p className="mb-4 text-sm leading-6 text-black/70">
              Skip the auto-wiring and configure your client directly. Drop the
              snippet into the file shown.
            </p>
            <div className="overflow-hidden border border-black/10 bg-white">
              <div className="flex flex-col gap-2 border-b border-black/10 bg-white sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap">
                  {manualConfigs.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveClient(c.id)}
                      className={`px-4 py-2.5 text-xs font-mono transition border-b-2 ${
                        activeClient === c.id
                          ? "border-[var(--accent)] text-black"
                          : "border-transparent text-black/55 hover:text-black"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copy(`manual-${activeClient}`, currentManual.code)}
                  className="mx-3 mb-3 px-2 py-1 text-left text-xs text-black/55 transition hover:text-black sm:mb-0"
                >
                  {copiedKey === `manual-${activeClient}` ? "copied" : "copy"}
                </button>
              </div>
              <div className="px-5 pb-1 pt-3 font-mono text-[11px] text-black/55">
                {currentManual.file}
              </div>
              <pre
                key={activeClient}
                className="animate-fadeUp overflow-x-auto px-5 pb-5 font-mono text-[13px] leading-relaxed text-black"
              >
                <code>{currentManual.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
