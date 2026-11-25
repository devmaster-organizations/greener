
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
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Serviços',
    href: '/servicos',
    icon: Server,
  },
  {
    label: 'Comparações',
    href: '/comparacoes',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
  {
    label: 'Login',
    href: '/login',
    icon: LogIn,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col
        bg-[#064E2D] text-white shadow-xl
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        max-md:w-20`}
    >
      {/* Identidade visual */}
      <div className="flex h-24 items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-3"
          title="GreenER - Dashboard"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Leaf size={27} className="text-[#72C879]" />
          </div>

          {!collapsed && (
            <div className="hidden min-w-0 md:block">
              <h1 className="text-2xl font-bold tracking-tight">
                Green<span className="text-[#72C879]">ER</span>
              </h1>
              <p className="text-[9px] tracking-[0.18em] text-white/60">
                TECNOLOGIA SUSTENTÁVEL
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Botão de recolher */}
      <div className="hidden px-4 pb-5 md:flex">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="flex w-full items-center justify-center rounded-lg
            bg-white/10 p-2 text-white/80 transition
            hover:bg-white/20 hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
          {!collapsed && (
            <span className="ml-3 text-xs">Recolher menu</span>
          )}
        </button>
      </div>

      {/* Navegação */}
      <nav aria-label="Menu principal" className="flex-1 px-3">
        <p
          className={`mb-4 px-3 text-[10px] font-semibold uppercase
            tracking-[0.2em] text-white/40
            ${collapsed ? 'hidden' : 'hidden md:block'}`}
        >
          Menu principal
        </p>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex items-center gap-3
                    rounded-xl px-3 py-3 transition-all duration-200
                    ${
                      active
                        ? 'bg-[#159447] font-semibold text-white shadow-lg shadow-black/10'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {active && (
                    <span className="absolute -left-3 h-7 w-1 rounded-r-full bg-[#72C879]" />
                  )}

                  <Icon
                    size={21}
                    strokeWidth={active ? 2.5 : 2}
                    className="shrink-0"
                  />

                  <span
                    className={`hidden truncate text-sm md:inline
                      ${collapsed ? 'md:hidden' : ''}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-center gap-2">
          <Leaf size={16} className="shrink-0 text-[#72C879]" />

          <p
            className={`hidden text-[10px] leading-relaxed text-white/50
              md:block ${collapsed ? 'md:hidden' : ''}`}
          >
            Tecnologia que respeita o amanhã.
          </p>
        </div>

        <p
          className={`mt-3 hidden text-center text-[9px] text-white/30
            md:block ${collapsed ? 'md:hidden' : ''}`}
        >
          GreenER © 2026
        </p>
      </div>
    </aside>
  );
}
