
interface HeaderProps {
  titulo: string;
  descricao: string;
}

export default function Header({
  titulo,
  descricao,
}: HeaderProps) {
  return (
    <header className="mb-8 border-b border-[#DCE8DF] pb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#159447]">
        GreenER | Sustentabilidade digital
      </p>

      <h1 className="text-3xl font-bold tracking-tight text-[#18343C]">
        {titulo}
      </h1>

      <p className="mt-2 text-sm leading-relaxed text-[#52666A]">
        {descricao}
      </p>
    </header>
  );
}
