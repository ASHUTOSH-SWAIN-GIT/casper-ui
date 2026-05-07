"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="group inline-flex h-10 items-center gap-3 rounded-md bg-[var(--accent)] px-4 text-sm font-medium text-white hover:bg-[var(--accent-soft)] transition shadow-sm"
    >
      <span className="font-mono">$ {command}</span>
      <span className="text-white/70 group-hover:text-white/90">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
