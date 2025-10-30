import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Federal Global - Painel Administrativo',
  description: 'Sistema de inteligência Federal Global - Área Administrativa',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <div className="min-h-screen">
          {/* Header Administrativo */}
          <header className="bg-slate-800 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-blue-400">
                  🛡️ Federal Global - Admin
                </h1>
                <span className="text-sm text-slate-400">
                  Painel Administrativo
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-green-400">
                  🌐 admin.federalglobal.deltafoxconsult.com.br
                </span>
                <button className="text-red-400 hover:text-red-300">
                  Sair
                </button>
              </div>
            </div>
          </header>

          {/* Sidebar Administrativo */}
          <div className="flex">
            <aside className="w-64 bg-slate-800 min-h-screen p-4">
              <nav className="space-y-2">
                <a href="/admin" className="block p-3 rounded bg-blue-600 text-white">
                  📊 Dashboard
                </a>
                <a href="/admin/users" className="block p-3 rounded hover:bg-slate-700">
                  👥 Usuários
                </a>
                <a href="/admin/companies" className="block p-3 rounded hover:bg-slate-700">
                  🏢 Empresas
                </a>
                <a href="/admin/logs" className="block p-3 rounded hover:bg-slate-700">
                  📋 Logs
                </a>
                <a href="/admin/analytics" className="block p-3 rounded hover:bg-slate-700">
                  📈 Analytics
                </a>
                <a href="/admin/settings" className="block p-3 rounded hover:bg-slate-700">
                  ⚙️ Configurações
                </a>
              </nav>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}