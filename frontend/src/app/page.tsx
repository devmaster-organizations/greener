import Image from "next/image";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import IndicadorCard from "../components/dashboard/IndicadorCard";
import { indicadoresDashboard } from "../data/mockDashboard";

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
      </main>

    </div>
  );
}
