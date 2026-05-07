"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };
type Group = { title: string; sections: Section[] };

export function DocsSidebar({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<string>(groups[0]?.sections[0]?.id ?? "");

  useEffect(() => {
    const ids = groups.flatMap((g) => g.sections.map((s) => s.id));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <nav className="space-y-8 text-sm">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            {group.title}
          </div>
          <ul className="space-y-1">
            {group.sections.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block rounded-md px-3 py-1.5 transition border-l-2 ${
                      isActive
                        ? "border-[var(--accent)] bg-neutral-50 text-neutral-900 font-medium"
                        : "border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <span className={isActive ? "" : "font-mono text-[13px]"}>
                      {s.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
