interface HeaderProps {
  titulo: string;
  descricao: string;
}

export default function Header({
  titulo,
  descricao,
}: HeaderProps) {
  return (
    <header className="mb-6 border-b border-[#DCE8DF] pb-4 sm:mb-8 sm:pb-6">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#159447]">
        GreenER | Sustentabilidade digital
      </p>

      <h1 className="text-2xl font-bold tracking-tight text-[#18343C] sm:text-3xl">
        {titulo}
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#52666A]">
        {descricao}
      </p>
    </header>
  );
}
