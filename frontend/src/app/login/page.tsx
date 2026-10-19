
'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    // Login simulado para a primeira Sprint
    setIsLoading(true);
    setSuccessMessage('Login realizado com sucesso! Redirecionando...');

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <main className="relative isolate min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/green-datacenter.jpg')",
        }}
      />

      {/* Camada para melhorar a leitura */}
      <div className="absolute inset-0 -z-10 bg-slate-950/40 backdrop-blur-xs" />

      {/* Card de login */}
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-2xl border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-green-700">
            GreenER
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-600">
            Entre na sua conta para gerenciar o monitoramento
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              E-mail corporativo
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100 disabled:bg-slate-100"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Senha de acesso
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100 disabled:bg-slate-100"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center rounded-xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Acessando...
              </span>
            ) : (
              'Acessar plataforma'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline tracking-wide"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </main>
  );
}
