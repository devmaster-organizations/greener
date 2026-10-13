export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 font-sans text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <a
            href="/"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Voltar ao início
          </a>

          <h1 className="mt-8 text-4xl font-bold text-green-700">
            Conheça o GreenER
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Uma plataforma voltada ao monitoramento de infraestrutura
            tecnológica e à compreensão de seus impactos ambientais.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-bold text-green-800">
              Monitoramento da infraestrutura
            </h2>

            <p className="mt-3 text-zinc-600">
              Acompanhe métricas de processamento, memória, armazenamento
              e rede para compreender a utilização dos recursos computacionais.
            </p>
          </article>

          <article className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-bold text-green-800">
              Eficiência energética e ambiental
            </h2>

            <p className="mt-3 text-zinc-600">
              Utilize estimativas de consumo energético e de emissões
              de CO₂ equivalente como apoio à análise da eficiência
              da infraestrutura.
            </p>
          </article>
        </section>

        <div className="mt-10">
          <a
            href="/login"
            className="inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Acessar plataforma
          </a>
        </div>
      </div>
    </main>
  );
}