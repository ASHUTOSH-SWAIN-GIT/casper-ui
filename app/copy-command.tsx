"use client";

import { useEffect, useRef, useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex min-h-11 items-center gap-3 rounded-md border border-black bg-white px-4 text-sm font-medium text-black transition hover:bg-[var(--surface-2)]"
    >
      <span className="font-mono">$ {command}</span>
      <span className="text-black/55 group-hover:text-black">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
