"use client";

import { useState } from "react";

const items = [
  {
    q: "What is MCP?",
    a: "Model Context Protocol is an open standard for connecting AI assistants to external systems. Instead of feeding your agent raw files, an MCP server exposes typed tools — Casper exposes 10 of them for querying Terraform infrastructure.",
  },
  {
    q: "Does Casper modify my Terraform or AWS?",
    a: "No. Casper is read-only. It indexes .tf and .tfstate files, calls AWS Describe APIs, and returns structured answers. It never writes to your repo or your cloud.",
  },
  {
    q: "Do I need Postgres?",
    a: "No. Casper runs in-memory by default. Postgres is optional and only needed for the experimental UI mode where you want graph snapshots persisted across sessions.",
  },
  {
    q: "How does drift detection work?",
    a: "describe_live_state walks the resource address, calls the matching read-only AWS Describe endpoint, and diffs the live attributes against your Terraform state. You see what's declared vs. what actually exists.",
  },
  {
    q: "Can I point it at multiple repos?",
    a: "Yes — call load_repo with a GitHub URL during a session and Casper swaps the graph in place. No restart, no config edit.",
  },
  {
    q: "What clouds does it support?",
    a: "Live drift is AWS-only today. Static analysis (find, simulate, policies) is provider-agnostic — it works on any HCL.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition"
            >
              <span className="text-sm font-medium text-neutral-900">{item.q}</span>
              <span
                className={`text-neutral-400 text-lg transition-transform ${
                  isOpen ? "rotate-45 text-neutral-900" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed max-w-2xl">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
