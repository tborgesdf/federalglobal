'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDomainContext } from '../lib/utils/domain';

export default function Home() {
  const router = useRouter();
  const domainContext = useDomainContext();
  const [showCanva, setShowCanva] = useState(false);

  useEffect(() => {
    // Se for o domínio principal federalglobal.deltafoxconsult.com.br, mostrar Canva
    if (domainContext.hostname?.includes('federalglobal.deltafoxconsult.com.br') && !domainContext.isAdmin) {
      setShowCanva(true);
      return; // Não redirecionar, mostrar o conteúdo
    }

    // Para domínios admin, redirecionar para login direto
    if (domainContext.isAdmin) {
      router.push('/login');
    } else if (domainContext.isClient || domainContext.isDevelopment) {
      router.push('/client');
    }
  }, [router, domainContext]);

  // Se deve mostrar o Canva (domínio principal)
  if (showCanva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
        {/* Header Federal Global */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Federal Global</h1>
                  <p className="text-blue-300 text-sm">by DeltaFox Consultoria</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                🔐 Fazer Login
              </button>
            </div>
          </div>
        </header>

        {/* Portal Federal Global - Canva Integration */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🚀 Portal Federal Global
            </h2>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto">
              Sistema avançado de inteligência e contrainteligência empresarial. 
              Acesse nosso portal completo com todas as funcionalidades, serviços e informações sobre 
              nossos processos de inteligência e monitoramento avançado.
            </p>
          </div>

          {/* Canva Embed Container */}
          <div className="max-w-6xl mx-auto">
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: 0,
                paddingTop: '112.4451%',
                paddingBottom: 0,
                boxShadow: '0 4px 20px 0 rgba(59, 130, 246, 0.3)',
                marginTop: '1.6em',
                marginBottom: '0.9em',
                overflow: 'hidden',
                borderRadius: '12px',
                willChange: 'transform',
                border: '2px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <iframe 
                loading="lazy" 
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  border: 'none',
                  padding: 0,
                  margin: 0
                }}
                src="https://www.canva.com/design/DAG3TnNbMUY/1MD8MlYR5xIR3PR_p-Pa8w/view?embed" 
                allowFullScreen 
                allow="fullscreen"
                title="Portal Federal Global - Interface Principal"
              />
            </div>
            
            {/* Portal Info and Links */}
            <div className="text-center mt-8">
              <p className="text-blue-300 mb-6">
                🎨 Interface criada por <strong>Thiago Borges</strong> - Design Federal Global
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a 
                  href="https://www.canva.com/design/DAG3TnNbMUY/1MD8MlYR5xIR3PR_p-Pa8w/view?utm_content=DAG3TnNbMUY&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
                  target="_blank" 
                  rel="noopener"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  🌐 Ver Página Principal Completa
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button 
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500/10 rounded-lg font-semibold transition-all duration-300"
                >
                  🔐 Acessar Sistema Federal Global
                </button>
              </div>
            </div>
          </div>

          {/* Informações sobre o Sistema */}
          <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                🎯 Sistema de Inteligência Empresarial
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-4">🛡️</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Proteção Avançada</h4>
                  <p className="text-blue-200 text-sm">
                    Monitoramento em tempo real com GPS obrigatório e captura completa de dispositivos.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-4">📊</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Dashboard Inteligente</h4>
                  <p className="text-blue-200 text-sm">
                    Painéis administrativos com alertas de segurança e controle total de usuários.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-4">🌐</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Acesso Controlado</h4>
                  <p className="text-blue-200 text-sm">
                    Sistema de domínios duplos com bloqueio automático e sessões únicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm border-t border-blue-500/30 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-blue-300 mb-2">
                © 2024 Federal Global - Sistema de Inteligência Empresarial
              </p>
              <p className="text-blue-400 text-sm">
                Desenvolvido por <strong>DeltaFox Consultoria</strong> | Thiago Borges
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Página de redirecionamento original para outros domínios
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-green-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="w-48 h-36 mx-auto mb-6 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🛡️</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">Federal Global</h1>
        <p className="text-2xl mb-8 text-green-100">by DeltaFox Consultoria</p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-lg text-green-100 mb-4">
            Sistema avançado de inteligência e contrainteligência empresarial
          </p>
          <p className="text-base text-blue-100">
            Protegendo o futuro das empresas através da inteligência estratégica
          </p>
          <div className="mt-4 text-sm text-blue-200">
            <p>Domínio: {domainContext.hostname}</p>
            <p>Tipo: {domainContext.type}</p>
          </div>
        </div>

        <div className="animate-pulse">
          <p className="text-sm text-white opacity-75">
            Redirecionando para {domainContext.isAdmin ? 'painel administrativo' : 'portal do cliente'}...
          </p>
        </div>

        <div className="mt-12 space-x-4">
          <button
            onClick={() => router.push(domainContext.isAdmin ? '/admin' : '/client')}
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
          >
            Acessar {domainContext.isAdmin ? 'Dashboard' : 'Portal'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-sm text-green-100">
            © Desenvolvido por DeltaFox Consultoria
          </p>
        </div>
      </div>
    </div>
  );
}
