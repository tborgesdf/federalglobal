'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SystemStats {
  totalUsers: number
  totalCompanies: number
  totalLogs: number
  onlineUsers: number
}

interface ActivityItem {
  id: number
  action: string
  user: string
  time: string
  type: 'success' | 'warning' | 'info' | 'neutral'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [stats] = useState<SystemStats>({
    totalUsers: 156,
    totalCompanies: 23,
    totalLogs: 8432,
    onlineUsers: 12
  })

  const [recentActivity] = useState<ActivityItem[]>([
    { id: 1, action: 'Login realizado', user: 'João Silva', time: '2 min atrás', type: 'success' },
    { id: 2, action: 'Erro de GPS', user: 'Maria Santos', time: '5 min atrás', type: 'warning' },
    { id: 3, action: 'Nova empresa cadastrada', user: 'Admin', time: '10 min atrás', type: 'info' },
    { id: 4, action: 'Logout automático', user: 'Pedro Costa', time: '15 min atrás', type: 'neutral' }
  ])

  useEffect(() => {
    // Verificar autenticação (simulado por cookies ou localStorage)
    const checkAuth = () => {
      try {
        const sessionToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('session_token='))
          ?.split('=')[1];

        if (!sessionToken) {
          // Não autenticado - redirecionar para login
          router.push('/admin/login')
          return
        }

        // Verificar se é um token válido (simplificado)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // O redirecionamento já foi feito
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
        <div className="text-sm text-slate-400">
          📍 Acesso via: admin.federalglobal.deltafoxconsult.com.br
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total de Usuários</p>
              <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
            </div>
            <div className="text-blue-400 text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Empresas Ativas</p>
              <p className="text-3xl font-bold text-green-400">{stats.totalCompanies}</p>
            </div>
            <div className="text-green-400 text-3xl">🏢</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Logs Registrados</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.totalLogs}</p>
            </div>
            <div className="text-yellow-400 text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Usuários Online</p>
              <p className="text-3xl font-bold text-purple-400">{stats.onlineUsers}</p>
            </div>
            <div className="text-purple-400 text-3xl">🟢</div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    activity.type === 'info' ? 'bg-blue-400' : 'bg-slate-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-slate-400 text-sm">por {activity.user}</p>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Sistema de GPS</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">GPS Ativo</span>
              <span className="text-green-400">✅ Funcionando</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Precisão Média</span>
              <span className="text-blue-400">5.2m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Usuários com GPS</span>
              <span className="text-yellow-400">98.7%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Segurança</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Tentativas de Login</span>
              <span className="text-green-400">234 (sucesso)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bloqueios por GPS</span>
              <span className="text-red-400">12 (hoje)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Criptografia</span>
              <span className="text-green-400">✅ AES-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}