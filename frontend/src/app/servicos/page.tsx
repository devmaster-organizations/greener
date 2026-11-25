import { Suspense } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import ServicosDashboard from "../../components/servicos/ServicosDashboard";

export default function ServicosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Header
          titulo="Serviços"
          descricao="Métricas detalhadas e histórico de cada serviço monitorado."
        />

        <Suspense
          fallback={
            <section className="rounded-xl border border-[#DCE8DF] bg-white p-8 text-center text-sm text-[#52666A] shadow-sm">
              Carregando serviços...
            </section>
          }
        >
          <ServicosDashboard />
        </Suspense>
      </main>
    </div>
  );
}
