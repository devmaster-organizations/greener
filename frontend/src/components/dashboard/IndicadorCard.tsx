
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-gray-600">
        {titulo}
      </h2>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {valor}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {descricao}
      </p>
    </div>
  );
}
