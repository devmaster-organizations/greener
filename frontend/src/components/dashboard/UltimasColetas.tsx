
interface Coleta {
  id: number;
  servico: string;
  dataHora: string;
  energiaKwh: number;
  co2e: number;
  status: "Concluída" | "Indisponível";
}

interface UltimasColetasProps {
  dados: Coleta[];
}

export default function UltimasColetas({
  dados,
}: UltimasColetasProps) {
  return (
    <section className="mt-8 rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#18343C]">
          Coletas recentes
        </h2>

        <p className="mt-1 text-sm text-[#52666A]">
          Últimos registros do monitoramento ambiental
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#DCE8DF] text-[#52666A]">
              <th className="px-4 py-3 font-medium">Serviço</th>
              <th className="px-4 py-3 font-medium">Data e hora</th>
              <th className="px-4 py-3 text-right font-medium">
                Energia (kWh)
              </th>
              <th className="px-4 py-3 text-right font-medium">
                CO₂e (g)
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((coleta) => (
              <tr
                key={coleta.id}
                className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
              >
                <td className="px-4 py-4 font-medium text-[#18343C]">
                  {coleta.servico}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-[#52666A]">
                  {coleta.dataHora}
                </td>

                <td className="px-4 py-4 text-right text-[#18343C]">
                  {coleta.energiaKwh.toLocaleString("pt-BR", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </td>

                <td className="px-4 py-4 text-right text-[#18343C]">
                  {coleta.co2e.toLocaleString("pt-BR", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      coleta.status === "Concluída"
                        ? "bg-[#E5F5E9] text-[#087443]"
                        : "bg-[#FFF0E5] text-[#A64B12]"
                    }`}
                  >
                    {coleta.status}
                  </span>
                </td>
              </tr>
            ))}

            {dados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[#52666A]"
                >
                  Nenhuma coleta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
