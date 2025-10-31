'use client'

import { useState } from 'react'

export default function ClientHome() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">FG</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Federal Global</h1>
                <p className="text-xs text-blue-300">by DeltaFox</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                LOGIN
              </button>
              <button className="px-6 py-2 border border-blue-500 text-blue-300 hover:bg-blue-500/10 rounded-lg font-semibold transition-colors">
                CADASTRE-SE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              SUPORTE, SEGURANÇA,<br />
              TRANQUILIDADE<br />
              E TRANSPARÊNCIA
            </h2>
            <div className="text-sm text-green-300 bg-green-900/20 inline-block px-4 py-2 rounded-full mb-8">
              🌐 Acessando via: federalglobal.deltafoxconsult.com.br
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Venha conhecer nossos serviços de soluções<br />
              de inteligência e monitoramento de mais alto nível
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Service 1 */}
            <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-blue-300 mb-4">
                ANÁLISE DOCUMENTAL PARA<br />
                VALIDAÇÃO DE DADOS?
              </h4>
              <p className="text-blue-200 leading-relaxed">
                Nossa IA consular verifica e valida<br />
                seus documentos antes do envio,<br />
                garantindo conformidade total.<br /><br />
                <span className="font-semibold">Precisão e segurança em cada<br />detalhe.</span>
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-blue-300 mb-4">
                MONITORAMENTO HUMANIZADO<br />
                DE ATIVIDADES E LOCALIZAÇÃO
              </h4>
              <p className="text-blue-200 leading-relaxed">
                Com inteligência artificial e suporte<br />
                humano, monitoramos corretamente<br />
                todas as atividades do sistema.<br /><br />
                <span className="font-semibold">Tecnologia que entende de<br />segurança.</span>
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h4 className="text-xl font-bold text-blue-300 mb-4">
                ASSESSORIA, RELATÓRIOS E<br />
                CONSULTORIA INTELIGENTE
              </h4>
              <p className="text-blue-200 leading-relaxed">
                Nossa IA orientada a processos<br />
                de inteligência organiza relatórios e<br />
                atualizações automáticas.<br /><br />
                <span className="font-semibold">Atendimento moderno e<br />confiável.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Federal Global - Canva Integration */}
      <section className="py-20 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              🚀 Portal Federal Global
            </h3>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto">
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
            
            {/* Portal Info and Link */}
            <div className="text-center mt-6">
              <p className="text-blue-300 mb-4">
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
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500/10 rounded-lg font-semibold transition-all duration-300"
                >
                  🔐 Fazer Login no Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✅</span>
              </div>
              <h5 className="text-xl font-bold text-green-400 mb-2">EVITE ERROS E ATRASOS</h5>
              <p className="text-blue-200">Sistema automatizado de verificação e validação</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📋</span>
              </div>
              <h5 className="text-xl font-bold text-blue-400 mb-2">RELATÓRIOS SEM COMPLICAÇÃO</h5>
              <p className="text-blue-200">Interface intuitiva e processos simplificados</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h5 className="text-xl font-bold text-purple-400 mb-2">ACOMPANHE TUDO COM FACILIDADE</h5>
              <p className="text-blue-200">Monitoramento em tempo real e notificações</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-blue-500/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300">
                <span className="font-semibold">DESENVOLVIDO POR:</span><br />
                DeltaFox Consultoria
              </p>
              <p className="text-blue-200 text-sm mt-2">
                contato@deltafoxconsult.com.br
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-300 font-semibold">Federal Global</p>
              <p className="text-blue-200 text-sm">Sistema de Inteligência Avançada</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-300">Acesso ao Sistema</h2>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-blue-200 mb-2">CPF</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/40 border border-blue-500/30 rounded text-white"
                  placeholder="000.000.000-00"
                />
              </div>
              
              <div>
                <label className="block text-blue-200 mb-2">Senha</label>
                <input 
                  type="password" 
                  className="w-full p-3 bg-black/40 border border-blue-500/30 rounded text-white"
                  placeholder="Digite sua senha"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors"
              >
                Entrar no Sistema
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-blue-200 text-sm">
                📍 GPS obrigatório para acesso
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}