import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

import IndicadorEnergia from "../../components/dashboard/IndicadorEnergia";
import IndicadorEmissoes from "../../components/dashboard/IndicadorEmissoes";
import IndicadorServicosMonitorados from "../../components/dashboard/IndicadorServicosMonitorados";
import IndicadorServicosIndisponiveis from "../../components/dashboard/IndicadorServicosIndisponiveis";
import ImpactoPorServico from "../../components/dashboard/ImpactoPorServico";
import HistoricoImpacto from "../../components/dashboard/HistoricoImpacto";
import UltimasColetas from "../../components/dashboard/UltimasColetas";
import ServicosMonitorados from "../../components/dashboard/ServicosMonitorados";
import MapaServicos from "../../components/dashboard/MapaServicos";

import Link from "next/link";


export default function Home() {
    return (

        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="min-w-0 flex-1 p-8">
                <Header
                    titulo="Dashboard"
                    descricao="Monitoramento do impacto ambiental das aplicações."
                />

                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition-colors"
                    >
                        ← Voltar para Home
                    </Link>
                </div>

                <section
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Indicadores ambientais"
                >
                    <IndicadorEnergia />
                    <IndicadorEmissoes />
                    <IndicadorServicosMonitorados />
                    <IndicadorServicosIndisponiveis />
                </section>


                <section
                    className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2"
                    aria-label="Gráficos de impacto ambiental"
                >
                    <ImpactoPorServico />
                    <HistoricoImpacto />
                </section>

                <ServicosMonitorados />

                <section
                    className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-2"
                    aria-label="Detalhes do monitoramento"
                >

                   <MapaServicos />

                    <UltimasColetas />
                </section>

            </main>

        </div>
    );
}
