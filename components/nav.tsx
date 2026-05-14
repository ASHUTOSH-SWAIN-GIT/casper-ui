import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 pb-5">
      <Link href="/" className="flex items-center gap-3 font-mono text-sm text-black">
        <span className="relative inline-flex size-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 dot-pulse" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[var(--accent)]" />
        </span>
        casper mcp
      </Link>
      <nav className="flex items-center gap-5 text-sm text-black/70">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <Link href="/docs" className="hover:text-black transition">Docs</Link>
        <a
          href="https://github.com/ASHUTOSH-SWAIN-GIT/casper-mcp"
          target="_blank"
          rel="noreferrer"
          className="hover:text-black transition"
        >
          GitHub
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
