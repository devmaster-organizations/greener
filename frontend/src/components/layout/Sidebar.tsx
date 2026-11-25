'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  ChartNoAxesCombined,
  Settings,
  LogIn,
  Leaf,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  History,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Serviços', href: '/servicos', icon: Server },
  { label: 'Histórico', href: '/dashboard#historico', icon: History },
  { label: 'Comparações', href: '/comparacoes', icon: ChartNoAxesCombined },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
  { label: 'Login', href: '/login', icon: LogIn },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const nomePagina = menuItems.find((item) => item.href === pathname)?.label ?? 'GreenER';

  const conteudoSidebar = (mobile: boolean) => {
    const recolhido = !mobile && collapsed;

    return (
      <div className="flex h-full flex-col bg-[#064E2D] text-white">
        <div className="flex h-24 items-center justify-between px-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3" title="GreenER - Dashboard" onClick={() => setMenuAberto(false)}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Leaf size={27} className="text-[#72C879]" />
            </div>
            {!recolhido && (
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight">
                  Green<span className="text-[#72C879]">ER</span>
                </p>
                <p className="text-[9px] tracking-[0.18em] text-white/60">
                  TECNOLOGIA SUSTENTÁVEL
                </p>
              </div>
            )}
          </Link>
          {mobile && (
            <button type="button" onClick={() => setMenuAberto(false)} aria-label="Fechar menu de navegação" className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {!mobile && (
          <div className="px-4 pb-5">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
              className="flex w-full items-center justify-center rounded-lg bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
              {!collapsed && <span className="ml-3 text-xs">Recolher menu</span>}
            </button>
          </div>
        )}

        <nav aria-label="Menu principal" className="flex-1 px-3">
          {!recolhido && (
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Menu principal
            </p>
          )}
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.label}
                    onClick={() => setMenuAberto(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                      active
                        ? 'bg-[#159447] font-semibold text-white shadow-lg shadow-black/10'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {active && <span className="absolute -left-3 h-7 w-1 rounded-r-full bg-[#72C879]" />}
                    <Icon size={21} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                    {!recolhido && <span className="truncate text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-2">
            <Leaf size={16} className="shrink-0 text-[#72C879]" />
            {!recolhido && <p className="text-[10px] leading-relaxed text-white/50">Tecnologia que respeita o amanhã.</p>}
          </div>
          {!recolhido && <p className="mt-3 text-center text-[9px] text-white/30">GreenER © 2026</p>}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#064E2D] px-4 py-3 text-white shadow-sm md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight">Green<span className="text-[#72C879]">ER</span></span>
          <span className="text-xs text-white/70">{nomePagina}</span>
        </div>
        <button type="button" onClick={() => setMenuAberto(true)} aria-label="Abrir menu de navegação" aria-expanded={menuAberto} className="rounded-lg p-2 text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuAberto && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMenuAberto(false)} aria-hidden="true" />
          <div className="relative z-10 h-full w-64">{conteudoSidebar(true)}</div>
        </div>
      )}

      <aside className={`sticky top-0 hidden h-screen shrink-0 shadow-xl transition-all duration-300 ease-in-out md:block ${collapsed ? 'w-20' : 'w-64'}`}>
        {conteudoSidebar(false)}
      </aside>
    </>
  );
}
