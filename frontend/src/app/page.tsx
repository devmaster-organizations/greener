import React from 'react';
import { 
  Zap, 
  Leaf, 
  BarChart3, 
  Sprout, 
  ArrowRight, 
  Users, 
  Globe 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full font-sans bg-gray-50 overflow-hidden text-gray-800">
      
      {/* Background Image Container (Lado Direito) */}
      <div 
        className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/green-datacenter.jpg')`, // Imagem na pasta public/
        }}
      >
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* 2. SVG DA CURVA (Substitua só este bloco se ainda não atualizou) */}
      <div className="absolute top-0 left-0 h-full w-full lg:w-[72%] z-10 pointer-events-none drop-shadow-2xl">
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
          </defs>
          <path 
            d="M 0,0 L 75,0 C 95,35 90,70 85,100 L 0,100 Z" 
            fill="url(#greenGradient)" 
          />
        </svg>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-between py-6">
        
        {/* Header / Navbar */}
        <header className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2.5 rounded-2xl shadow-md">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                Green<span className="text-green-600">ER</span>
              </h1>
              <p className="text-[10px] tracking-widest text-gray-500 uppercase font-medium mt-0.5">
                TECNOLOGIA QUE RESPEITA O AMANHÃ
              </p>
            </div>
          </div>

        </header>

        {/* Hero Section */}
        <main className="my-auto py-12 max-w-xl lg:max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] mb-6">
            Transformando dados em um{' '}
            <span className="text-green-600">futuro mais verde.</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
            O GreenER monitora métricas de infraestrutura e transforma consumo de recursos
            em indicadores ambientais, como energia consumida e emissões de CO₂e, ajudando
            organizações a tomar decisões mais sustentáveis.
          </p>

          {/* Ícones de Recursos / Funcionalidades */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">Monitora o consumo</span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">Estima emissões de CO₂e</span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">Acompanha evolução</span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">Apoia decisões sustentáveis</span>
            </div>
          </div>

          {/* Botão de Ação */}
          <button className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Acessar o Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </main>

        {/* Rodapé / Barra Inferior de Benefícios */}

        {/* Rodapé / Barra Inferior de Benefícios */}
<footer className="w-full bg-green-50/90 backdrop-blur-md border border-green-200/50 rounded-2xl p-4 sm:p-6 shadow-sm">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    
    {/* Card 1: Sustentabilidade */}
    <div className="flex items-center gap-3">
      <div className="bg-green-700 p-2.5 rounded-xl shadow-xs">
        <Leaf className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-800">Sustentabilidade</h4>
        <p className="text-xs text-gray-600">Tecnologia a favor do planeta</p>
      </div>
    </div>

    {/* Card 2: Transparência */}
    <div className="flex items-center gap-3">
      <div className="bg-green-700 p-2.5 rounded-xl shadow-xs">
        <Users className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-800">Transparência</h4>
        <p className="text-xs text-gray-600">Indicadores claros e acessíveis</p>
      </div>
    </div>

    {/* Card 3: Eficiência */}
    <div className="flex items-center gap-3">
      <div className="bg-green-700 p-2.5 rounded-xl shadow-xs">
        <BarChart3 className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-800">Eficiência</h4>
        <p className="text-xs text-gray-600">Mais dados, melhores decisões</p>
      </div>
    </div>

    {/* Card 4: Impacto real */}
    <div className="flex items-center gap-3">
      <div className="bg-green-700 p-2.5 rounded-xl shadow-xs">
        <Globe className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-800">Impacto real</h4>
        <p className="text-xs text-gray-600">Pequenas ações, grandes mudanças</p>
      </div>
    </div>

  </div>
</footer>

      </div>
    </div>
  );
};

export default LandingPage;