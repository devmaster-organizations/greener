
interface Servico {
  id: number;
  nome: string;
  status: "Online" | "Indisponível";
  pais: string;
  regiao: string;
  cidade: string;
  energiaKwh: number;
  co2e: number;
}

interface ServicosMonitoradosProps {
  dados: Servico[];
}

export default function ServicosMonitorados({
  dados,
}: ServicosMonitoradosProps) {
  return (
    <section className="mt-8 rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#18343C]">
          Serviços monitorados
        </h2>

        <p className="mt-1 text-sm text-[#52666A]">
          Estado, localização e impacto ambiental por serviço
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#DCE8DF] text-[#52666A]">
              <th className="px-4 py-3 font-medium">Serviço</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Localização</th>
              <th className="px-4 py-3 text-right font-medium">
                Energia (kWh)
              </th>
              <th className="px-4 py-3 text-right font-medium">
                CO₂e (g)
              </th>
            </tr>
          </thead>

          <tbody>
            {dados.map((servico) => (
              <tr
                key={servico.id}
                className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
              >
                <td className="px-4 py-4 font-medium text-[#18343C]">
                  {servico.nome}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                      servico.status === "Online"
                        ? "bg-[#E5F5E9] text-[#087443]"
                        : "bg-[#FFF0E5] text-[#A64B12]"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        servico.status === "Online"
                          ? "bg-[#159447]"
                          : "bg-[#D97732]"
                      }`}
                    />
                    {servico.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-[#52666A]">
                  {servico.cidade}, {servico.regiao}, {servico.pais}
                </td>

                <td className="px-4 py-4 text-right text-[#18343C]">
                  {servico.energiaKwh.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </td>

                <td className="px-4 py-4 text-right text-[#18343C]">
                  {servico.co2e.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3,
                  })}
                </td>
              </tr>
            ))}

            {dados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[#52666A]"
                >
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
