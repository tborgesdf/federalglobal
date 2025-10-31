'use client'

import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <div className="min-h-screen flex">
          {/* Menu Lateral */}
          <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Logo no Menu */}
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-blue-400">
                🛡️ Federal Global
              </h2>
              <p className="text-sm text-slate-400">Painel Administrativo</p>
            </div>
            
            {/* Navegação */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <a href="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                    <span>📊</span>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/public-users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                    <span>👤</span>
                    <span>Painel de Clientes</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                    <span>👥</span>
                    <span>Usuários Internos</span>
                  </a>
                </li>
                <li>
                  <button 
                    id="addUserBtn"
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left"
                    onClick={() => {
                      const event = new CustomEvent('openAddUserModal');
                      window.dispatchEvent(event);
                    }}
                  >
                    <span>➕</span>
                    <span>Adicionar Usuário</span>
                  </button>
                </li>
                <li>
                  <a href="/admin/selection" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                    <span>⚙️</span>
                    <span>Configurações</span>
                  </a>
                </li>
              </ul>
            </nav>
            
            {/* Informações do Sistema */}
            <div className="p-4 border-t border-slate-700">
              <div className="text-xs text-slate-400">
                <p>🌐 admin.federalglobal.deltafoxconsult.com.br</p>
                <p className="mt-1">Conectado</p>
              </div>
            </div>
          </aside>

          {/* Área Principal */}
          <div className="flex-1 flex flex-col">
            {/* Header Administrativo */}
            <header className="bg-slate-800 border-b border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-blue-400">
                    Área Administrativa
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-400">
                    🟢 Online
                  </span>
                  <button className="text-red-400 hover:text-red-300">
                    Sair
                  </button>
                </div>
              </div>
            </header>

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