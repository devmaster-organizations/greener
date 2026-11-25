
import type { ReactNode } from "react";

interface IndicadorCardProps {
  titulo: string;
  valor: string;
  descricao: string;
  icone?: ReactNode;
  corDestaque?: string;
}

export default function IndicadorCard({
  titulo,
  valor,
  descricao,
  icone,
  corDestaque = "border-t-green-500",
}: IndicadorCardProps) {
  return (
    <article
      className={`group h-full overflow-hidden rounded-2xl border border-[#DCE8DF] border-t-4 ${corDestaque} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-sm font-semibold leading-relaxed text-[#52666A]">
          {titulo}
        </h2>

        {icone && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F1]">
            {icone}
          </div>
        )}
      </div>

      <p className="mt-5 break-words text-3xl font-extrabold tracking-tight tabular-nums text-[#18343C]">
        {valor}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-[#718187]">
        {descricao}
      </p>
    </article>
  );
}
