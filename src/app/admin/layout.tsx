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

          {/* Conteúdo Principal */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}