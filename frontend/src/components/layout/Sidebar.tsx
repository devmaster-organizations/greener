"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", rotulo: "Dashboard" },
  { href: "/servicos", rotulo: "Serviços" },
  { href: "/configuracoes", rotulo: "Configurações" },
  { href: "/login", rotulo: "Login" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#064E2D] p-6 text-white">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <svg
            viewBox="0 0 48 48"
            className="h-8 w-8"
            fill="none"
            stroke="#72C879"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M24 42V20" />
            <path d="M24 29C10 29 5 19 7 7c12 0 21 7 17 22Z" />
            <path d="M24 36c0-13 8-22 19-23 1 12-6 22-19 23Z" />
            <path d="m13 14 11 12" />
            <path d="m35 20-11 12" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Green<span className="text-[#72C879]">ER</span>
          </h1>
          <p className="mt-1 text-xs tracking-widest text-white/60">
            TECNOLOGIA SUSTENTÁVEL
          </p>
        </div>
      </div>

      <nav aria-label="Menu principal">
        <ul className="space-y-2">
          {LINKS.map((link) => {
            const ativo =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={ativo ? "page" : undefined}
                  className={
                    ativo
                      ? "block rounded-lg bg-[#159447] px-4 py-3 font-semibold text-white"
                      : "block rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  }
                >
                  {link.rotulo}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/15 pt-5">
        <p className="text-xs leading-relaxed text-white/60">
          Tecnologia que respeita o amanhã.
        </p>
      </div>
    </aside>
  );
}
