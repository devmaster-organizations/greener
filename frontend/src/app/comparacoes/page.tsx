
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import ComparacoesClient from '../../components/comparacoes/ComparacoesClient';

export default function ComparacoesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7FAF7] md:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8">
        <Header
          titulo="Comparações"
          descricao="Compare o consumo energético e as emissões ambientais dos serviços monitorados."
        />

        <ComparacoesClient />
      </main>
    </div>
  );
}
