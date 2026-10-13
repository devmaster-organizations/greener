import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import IndicadorCard from "../components/dashboard/IndicadorCard";
import ImpactoPorServico from "../components/dashboard/ImpactoPorServico";
import HistoricoImpacto from "../components/dashboard/HistoricoImpacto";
import UltimasColetas from "../components/dashboard/UltimasColetas";

import {
  indicadoresDashboard,
  impactoPorServico,
  historicoImpacto,
  ultimasColetas,
} from "../data/mockDashboard";


export default function Home() {
  return (

    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8">
        <Header
          titulo="Dashboard"
          descricao="Monitoramento do impacto ambiental das aplicações."
        />

        <section
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicadores ambientais"
        >
          {indicadoresDashboard.map((indicador) => (
            <IndicadorCard
              key={indicador.id}
              titulo={indicador.titulo}
              valor={indicador.valor}
              descricao={indicador.descricao}
            />
          ))}
        </section>


        <section
          className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2"
          aria-label="Gráficos de impacto ambiental"
        >
          <ImpactoPorServico dados={impactoPorServico} />
          <HistoricoImpacto dados={historicoImpacto} />
        </section>
        
        <UltimasColetas dados={ultimasColetas} />

      </main>

    </div>
  );
}
