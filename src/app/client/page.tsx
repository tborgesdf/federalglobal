'use client'

import { useState } from 'react'

export default function ClientHome() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Header Federal Global */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Federal Global</h1>
                <p className="text-blue-300 text-sm">by DeltaFox</p>
              </div>
            </div>
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

      {/* Main Content - Substituído pela Interface do Canva */}
      <main className="flex-1">
        {/* Hero Section com texto principal */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              SUPORTE, SEGURANÇA,<br />
              TRANQUILIDADE<br />
              E TRANSPARÊNCIA
            </h2>
            <div className="text-sm text-green-300 bg-green-900/20 inline-block px-4 py-2 rounded-full mb-8">
              🌐 Acessando via: federalglobal.deltafoxconsult.com.br
            </div>
          </div>
        </section>

        {/* Interface Principal do Canva - Tela Cheia */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                🚀 Portal Federal Global - Interface Principal
              </h3>
              <p className="text-blue-200 text-lg max-w-3xl mx-auto">
                Venha conhecer nossos serviços de soluções de inteligência e monitoramento de mais alto nível
              </p>
            </div>

            {/* Canva Embed - Interface Principal Completa */}
            <div className="max-w-7xl mx-auto">
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingTop: '112.4451%',
                  paddingBottom: 0,
                  boxShadow: '0 8px 40px 0 rgba(59, 130, 246, 0.4)',
                  marginTop: '1.6em',
                  marginBottom: '0.9em',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  willChange: 'transform',
                  border: '3px solid rgba(59, 130, 246, 0.3)',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
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
                  title="Federal Global - Portal Completo"
                />
              </div>
              
              {/* Controles da Interface */}
              <div className="text-center mt-8">
                <p className="text-blue-300 mb-6 text-lg">
                  🎨 Interface Profissional criada por <strong>Thiago Borges</strong> - Federal Global Design
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <a 
                    href="https://www.canva.com/design/DAG3TnNbMUY/1MD8MlYR5xIR3PR_p-Pa8w/view?utm_content=DAG3TnNbMUY&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
                    target="_blank" 
                    rel="noopener"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🌐 Ver Interface Completa
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center px-8 py-4 border-3 border-green-500 text-green-400 hover:bg-green-500/20 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    🔐 Acessar Sistema Federal Global
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Serviços - Simplificada */}
        <section className="py-16 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h4 className="text-lg font-bold text-blue-300 mb-3">ANÁLISE DOCUMENTAL PARA VALIDAÇÃO DE DADOS</h4>
                <p className="text-blue-200 text-sm">Nossa IA verifica e valida documentos garantindo conformidade total.</p>
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">�</span>
                </div>
                <h4 className="text-lg font-bold text-blue-300 mb-3">MONITORAMENTO HUMANIZADO</h4>
                <p className="text-blue-200 text-sm">Inteligência artificial com suporte humano para monitoramento completo.</p>
              </div>

              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌐</span>
                </div>
                <h4 className="text-lg font-bold text-blue-300 mb-3">ASSESSORIA E RELATÓRIOS INTELIGENTES</h4>
                <p className="text-blue-200 text-sm">IA orientada para processos de inteligência e relatórios automáticos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

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