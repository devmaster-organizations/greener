
interface IndicadorCardProps {
  titulo: string;
  valor: string;
  descricao: string;
}

export default function IndicadorCard({
  titulo,
  valor,
  descricao,
}: IndicadorCardProps) {
  return (
    <article className="h-full rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm transition-all duration-[1200ms] ease-in-out hover:border-green-300 hover:shadow-[0_8px_24px_rgba(34,197,94,0.20)] hover:scale-[1.03]">
      <h2 className="text-sm font-medium leading-relaxed text-[#52666A]">
        {titulo}
      </h2>

      <p className="mt-3 text-3xl font-bold tracking-tight text-[#18343C]">
        {valor}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-[#52666A]">
        {descricao}
      </p>
    </article>
  );
}
