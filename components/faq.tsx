"use client";

import { useState } from "react";

const items = [
  {
    q: "What is MCP?",
    a: "Model Context Protocol is an open standard for connecting AI assistants to external systems. Instead of feeding your agent raw files, an MCP server exposes typed tools. Casper exposes a focused set of them for querying Terraform infrastructure — see the docs for the full list.",
  },
  {
    q: "Does Casper modify my Terraform or AWS?",
    a: "Casper never writes Terraform or AWS resources. The only file it ever touches is casper/graph.html — the interactive graph view — and only after you (or the /casper slash command) explicitly call render_graph.",
  },
  {
    q: "How does drift detection work?",
    a: "describe_live_state walks the resource address, calls the matching read-only AWS Describe endpoint, and diffs the live attributes against your Terraform state. You see what's declared vs. what actually exists.",
  },
  {
    q: "What clouds does it support?",
    a: "Live drift is AWS-only today. Static analysis for find, simulate, and policies is provider-agnostic. It works on any HCL.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-black/10 border-y border-black/10 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-0 py-5 text-left transition hover:bg-[var(--surface-2)] sm:px-4"
            >
              <span className="text-sm font-semibold text-black">{item.q}</span>
              <span
                className={`text-lg text-black/45 transition-transform ${
                  isOpen ? "rotate-45 text-black" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="max-w-2xl px-0 pb-5 text-sm leading-6 text-black/70 sm:px-4">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
