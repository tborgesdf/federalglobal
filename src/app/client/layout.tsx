import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Federal Global - Portal do Cliente',
  description: 'Sistema de inteligência Federal Global - Área do Cliente',
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gradient-to-br from-blue-900 to-slate-900 text-white`}>
        <div className="min-h-screen">
          {/* Header Cliente */}
          <header className="bg-black/20 backdrop-blur-sm border-b border-blue-500/20 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-blue-300">
                  🌐 Federal Global
                </h1>
                <span className="text-sm text-blue-200">
                  Sistema de Inteligência
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-green-300">
                  🔗 federalglobal.deltafoxconsult.com.br
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                  Entrar
                </button>
              </div>
            </div>
          </header>

          {/* Navegação Cliente */}
          <nav className="bg-black/10 backdrop-blur-sm p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex space-x-6">
                <a href="/client" className="text-blue-300 hover:text-blue-200 font-medium">
                  🏠 Início
                </a>
                <a href="/client/services" className="text-blue-300 hover:text-blue-200">
                  🔧 Serviços
                </a>
                <a href="/client/about" className="text-blue-300 hover:text-blue-200">
                  ℹ️ Sobre
                </a>
                <a href="/client/contact" className="text-blue-300 hover:text-blue-200">
                  📞 Contato
                </a>
              </div>
            </div>
          </nav>

          {/* Conteúdo Principal */}
          <main className="max-w-7xl mx-auto p-6">
            {children}
          </main>

          {/* Footer Cliente */}
          <footer className="bg-black/20 backdrop-blur-sm border-t border-blue-500/20 p-4 mt-8">
            <div className="max-w-7xl mx-auto text-center text-blue-200">
              <p>© 2025 Federal Global by DeltaFox - Sistema de Inteligência Avançada</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}