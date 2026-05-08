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
      className="group inline-flex min-h-11 items-center gap-3 rounded-md border border-black bg-white px-4 text-sm font-medium text-black transition hover:bg-[var(--surface-2)]"
    >
      <span className="font-mono">$ {command}</span>
      <span className="text-black/55 group-hover:text-black">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
