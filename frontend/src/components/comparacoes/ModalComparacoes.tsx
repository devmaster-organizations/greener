
interface ModalComparacoesProps {
  onFechar: () => void;
}

export default function ModalComparacoes({
  onFechar,
}: ModalComparacoesProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onFechar();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-comparacoes"
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between border-b border-[#DCE8DF] px-6 py-5">
          <div>
            <h2
              id="titulo-comparacoes"
              className="text-xl font-bold text-[#18343C]"
            >
              Comparação entre serviços
            </h2>

            <p className="mt-1 text-sm text-[#52666A]">
              Compare o impacto ambiental dos serviços monitorados.
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar comparação"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#52666A] transition hover:bg-[#EEF4EF] hover:text-[#18343C]"
          >
            ×
          </button>
        </header>

        {/* Conteúdo */}
        <div className="grid min-h-[420px] flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* Área de serviços */}
          <aside className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF8] p-5">
            <h3 className="font-semibold text-[#18343C]">
              Serviços disponíveis
            </h3>

            <p className="mt-2 text-sm text-[#52666A]">
              A lista de serviços será apresentada aqui.
            </p>
          </aside>

          {/* Área do gráfico */}
          <section className="flex flex-col rounded-xl border border-[#DCE8DF] bg-white p-5">
            <div className="mb-5">
              <h3 className="font-semibold text-[#18343C]">
                Análise comparativa
              </h3>

              <p className="mt-1 text-sm text-[#52666A]">
                Visualização histórica do impacto ambiental.
              </p>
            </div>

            <div className="flex min-h-[300px] flex-1 items-center justify-center rounded-lg border border-dashed border-[#DCE8DF] bg-[#F8FBF8]">
              <p className="text-center text-sm text-[#52666A]">
                O gráfico comparativo será apresentado aqui.
              </p>
            </div>
          </section>
        </div>

        {/* Rodapé */}
        <footer className="flex justify-end border-t border-[#DCE8DF] bg-[#F8FBF8] px-6 py-4">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg border border-[#DCE8DF] bg-white px-5 py-2.5 text-sm font-semibold text-[#52666A] transition hover:bg-[#EEF4EF]"
          >
            Fechar
          </button>
        </footer>
      </section>
    </div>
  );
}
