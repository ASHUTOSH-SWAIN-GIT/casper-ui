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
    <nav className="space-y-8 border-t border-black/10 pt-5 text-sm lg:border-t-0 lg:pt-0">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
            {group.title}
          </div>
          <ul className="space-y-1">
            {group.sections.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block border-l-2 px-3 py-1.5 transition ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--surface-2)] font-medium text-black"
                        : "border-transparent text-black/62 hover:bg-[var(--surface-2)] hover:text-black"
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
