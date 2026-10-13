
export default function Sidebar() {
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
          <li>
            <a
              href="/"
              aria-current="page"
              className="block rounded-lg bg-[#159447] px-4 py-3 font-semibold text-white"
            >
              Dashboard
            </a>
          </li>

          <li>
            <a
              href="#servicos"
              className="block rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Serviços
            </a>
          </li>

          <li>
            <a
              href="#historico"
              className="block rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Histórico
            </a>
          </li>

          <li>
            <a
              href="#comparacoes"
              className="block rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Comparações
            </a>
          </li>

          <li>
            <a
              href="#configuracoes"
              className="block rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Configurações
            </a>
          </li>
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
