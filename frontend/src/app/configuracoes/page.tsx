
"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function Configuracoes() {
  const [intervalo, setIntervalo] = useState("10");

  function salvarConfiguracao() {
    alert(`Intervalo selecionado: ${intervalo} minutos`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8">
        <Header
          titulo="Configurações"
          descricao="Configure o intervalo de coleta dos serviços."
        />

        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-green-700 hover:text-green-900 font-medium"
          >
            ← Voltar para Dashboard
          </Link>
        </div>

        <section className="max-w-3xl rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#18343C]">
            Intervalo de coleta
          </h2>

          <p className="mt-2 text-sm text-[#52666A]">
            Defina com que frequência os serviços devem ser consultados.
          </p>

          <div className="mt-6">
            <label
              htmlFor="intervalo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tempo entre coletas
            </label>

            <select
              id="intervalo"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <option value="1">1 minuto</option>
              <option value="5">5 minutos</option>
              <option value="10">10 minutos</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </div>

          <div className="mt-6 rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">
              O intervalo selecionado será usado como configuração
              para as próximas coletas.
            </p>
          </div>

          <button
            onClick={salvarConfiguracao}
            className="mt-6 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Salvar configuração
          </button>
        </section>
      </main>
    </div>
  );
}
