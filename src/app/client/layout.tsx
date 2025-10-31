import { Inter } from 'next/font/google'
import '../globals.css'

const interFont = Inter({ subsets: ['latin'] })

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
      <body className={`${interFont.className} bg-gradient-to-br from-blue-900 to-slate-900 text-white`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}