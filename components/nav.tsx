import Link from "next/link";

export function Nav() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-mono text-sm text-neutral-900">
        <span className="relative inline-flex size-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 dot-pulse" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[var(--accent)]" />
        </span>
        casper
      </Link>
      <nav className="flex items-center gap-5 text-sm text-neutral-600">
        <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
        <Link href="/docs" className="hover:text-neutral-900 transition">Docs</Link>
        <a
          href="https://github.com/ASHUTOSH-SWAIN-GIT/casper-mcp"
          target="_blank"
          rel="noreferrer"
          className="hover:text-neutral-900 transition"
        >
          GitHub →
        </a>
      </nav>
    </header>
  );
}
