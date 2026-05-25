"use client";

import { useEffect, useRef, useState } from "react";

const configs = [
  {
    id: "claude-code",
    label: "Claude Code",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "npx",
      "args": ["-y", "casper-mcp", "serve", "--dir", "."]
    }
  }
}`,
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "casper-mcp",
      "args": ["serve", "--dir", "/path/to/your/terraform"]
    }
  }
}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    code: `{
  "mcpServers": {
    "casper": {
      "command": "casper-mcp",
      "args": ["serve", "--dir", "/path/to/your/terraform"]
    }
  }
}`,
  },
];

export function SetupTabs() {
  const [active, setActive] = useState(configs[0].id);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = configs.find((c) => c.id === active)!;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
    } catch {
      return;
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-950 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-black/60">
        <div className="flex">
          {configs.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`px-4 py-3 text-xs font-mono transition border-b-2 ${
                active === c.id
                  ? "text-white border-[var(--accent)]"
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mr-3 text-xs text-neutral-500 hover:text-white transition px-2 py-1"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="p-5 text-sm font-mono text-neutral-200 overflow-x-auto leading-relaxed">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
