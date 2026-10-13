export default function Home() {
return (
<main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-white px-6 py-16 font-sans text-zinc-900">
{/* Cabeçalho */}
<div
    aria-hidden="true"
    className="absolute inset-0 -z-20 bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/greener-background.jpg')",
    }}
  />

  {/* Camada 2: sobreposição para leitura */}
  <div
    aria-hidden="true"
    className="absolute inset-0 -z-10 bg-white/45"
  />
<header className="mb-16 text-center">
<h1 className="text-4xl font-bold text-green-700">
GreenER
</h1>

    <p className="mt-4 text-lg text-zinc-600">
      Tecnologia e sustentabilidade caminhando juntas.
    </p>
  </header>

  {/* Boas-vindas */}
  <section className="mb-12 max-w-2xl text-center">
    <h2 className="text-3xl font-semibold text-zinc-900">
      Bem-vindo ao GreenER!
    </h2>

    <p className="mt-4 text-zinc-600">
      Monitore indicadores de infraestrutura, acompanhe estimativas
      de consumo energético e descubra oportunidades para uma
      computação mais sustentável.
    </p>
  </section>

  {/* Cards de navegação */}
  <section className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">

    {/* Card de apresentação */}
    <a
      href="/dashboard"
      className="group rounded-2xl border border-white/70 bg-white/80 p-8 shadow-lg shadow-green-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white/95 hover:shadow-xl"
    >
      <h3 className="text-xl font-bold text-green-800">
        Conheça o GreenER
      </h3>

      <p className="mt-3 text-zinc-600">
        Explore a proposta da plataforma e acompanhe os indicadores
        ambientais da infraestrutura tecnológica.
      </p>

      <span className="mt-6 inline-block font-semibold text-green-700">
        Explorar plataforma →
      </span>
    </a>

    {/* Card de login */}
    <a
      href="/login"
      className="group rounded-2xl border border-white/70 bg-white/80 p-8 shadow-lg shadow-green-950/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white/95 hover:shadow-xl"
    >
      <h3 className="text-xl font-bold text-zinc-900">
        Acessar plataforma
      </h3>

      <p className="mt-3 text-zinc-600">
        Entre na sua conta para acessar as funcionalidades da
        plataforma GreenER.
      </p>

      <span className="mt-6 inline-block font-semibold text-green-700">
        Fazer login →
      </span>
    </a>

  </section>
</main>

);
}
