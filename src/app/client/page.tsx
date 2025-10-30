export default function ClientHome() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-blue-300 mb-4">
          Federal Global
        </h1>
        <p className="text-xl text-blue-200 mb-8">
          Sistema de Inteligência e Monitoramento Avançado
        </p>
        <div className="text-sm text-green-300 bg-green-900/20 inline-block px-4 py-2 rounded-full">
          🌐 Acessando via: federalglobal.deltafoxconsult.com.br
        </div>
      </div>

      {/* Recursos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">Segurança Avançada</h3>
            <p className="text-blue-200">
              Sistema de autenticação com GPS obrigatório e criptografia de ponta
            </p>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">Monitoramento Real-time</h3>
            <p className="text-blue-200">
              Acompanhamento em tempo real de atividades e localização
            </p>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold text-blue-300 mb-2">Inteligência Global</h3>
            <p className="text-blue-200">
              Análise inteligente de dados com IA e machine learning
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Login */}
      <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-blue-500/20 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center">Acesso ao Sistema</h2>
        
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

      {/* Informações do Sistema */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-blue-500/20">
        <h2 className="text-xl font-bold text-blue-300 mb-4">Status do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-green-400 text-2xl mb-2">✅</div>
            <p className="text-blue-200 text-sm">Sistema Online</p>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-2xl mb-2">🛰️</div>
            <p className="text-blue-200 text-sm">GPS Ativo</p>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-2xl mb-2">🔒</div>
            <p className="text-blue-200 text-sm">Segurança Máxima</p>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-2xl mb-2">⚡</div>
            <p className="text-blue-200 text-sm">Performance Otimizada</p>
          </div>
        </div>
      </div>
    </div>
  )
}