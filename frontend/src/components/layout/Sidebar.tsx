'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const itensMenu = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#historico', label: 'Histórico' },
  { href: '/comparacoes', label: 'Comparações' },
  { href: '/configuracoes', label: 'Configurações' },
  { href: '/login', label: 'Login' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const paginaAtual = itensMenu.find((item) => item.href === pathname);
  const nomePagina = paginaAtual?.label ?? 'GreenER';

  const conteudoSidebar = (
    <div className="flex h-full w-64 flex-col bg-[#064E2D] p-6 text-white">
      <div className="mb-8 flex items-center justify-between gap-3 md:mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
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
            <p className="text-2xl font-bold tracking-tight">
              Green<span className="text-[#72C879]">ER</span>
            </p>
            <p className="mt-1 text-[11px] tracking-widest text-white/60">
              TECNOLOGIA SUSTENTÁVEL
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu de navegação"
          className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Menu principal" className="flex-1">
        <ul className="space-y-2">
                    {itensMenu.map((item) => {
            const ativo = pathname === item.href;

            const href =
              item.href.startsWith('#') && pathname !== '/dashboard'
                ? `/dashboard${item.href}`
                : item.href;

            return (
              <li key={item.href}>
                <a
                  href={href}
                  onClick={() => setMenuAberto(false)}
                  aria-current={ativo ? 'page' : undefined}
                  className={`block rounded-lg px-4 py-3 text-sm transition-colors ${
                    ativo
                      ? 'bg-[#159447] font-semibold text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 border-t border-white/15 pt-5">
        <p className="text-xs leading-relaxed text-white/60">
          Tecnologia que respeita o amanhã.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra superior no mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#064E2D] px-4 py-3 text-white shadow-sm md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight">
            Green<span className="text-[#72C879]">ER</span>
          </span>
          <span className="text-xs text-white/70">{nomePagina}</span>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={menuAberto}
          className="rounded-lg p-2 text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer mobile */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMenuAberto(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{conteudoSidebar}</div>
        </div>
      )}

      {/* Sidebar fixa em telas médias e grandes */}
      <aside className="hidden md:flex md:min-h-screen md:w-64 md:shrink-0">
        {conteudoSidebar}
      </aside>
    </>
  );
}
