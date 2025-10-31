'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SystemStats {
  totalUsers: number
  totalCompanies: number
  totalLogs: number
  onlineUsers: number
  gpsAccuracy: number
  systemUptime: string
  securityLevel: string
}

interface ActivityItem {
  id: number
  action: string
  user: string
  company?: string
  time: string
  type: 'success' | 'warning' | 'info' | 'error'
  location?: string
  ip?: string
}

interface SecurityAlert {
  id: number
  userId: number
  alertType: string
  message: string
  severity: string
  createdAt: string
  user: {
    id: number
    fullName: string
    email: string
    role: string
  }
  details?: Record<string, unknown>
}

interface User {
  id: number
  name: string
  cpf: string
  email: string
  role: string
  company: string
  lastLogin: string
  status: 'online' | 'offline' | 'blocked'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity' | 'system'>('overview')
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [showAlertsModal, setShowAlertsModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  
  // Estados do formulário de usuário
  const [newUser, setNewUser] = useState({
    cpf: '',
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN',
    password: '',
    confirmPassword: ''
  })
  
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 245,
    totalCompanies: 48,
    totalLogs: 15678,
    onlineUsers: 23,
    gpsAccuracy: 4.8,
    systemUptime: '99.97%',
    securityLevel: 'MÁXIMA'
  })

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    { 
      id: 1, 
      action: 'Login realizado com sucesso', 
      user: 'João Silva Santos', 
      company: 'TechCorp LTDA',
      time: '3 min atrás', 
      type: 'success',
      location: 'São Paulo, SP',
      ip: '177.45.123.45'
    },
    { 
      id: 2, 
      action: 'Tentativa de acesso sem GPS', 
      user: 'Maria Oliveira Costa', 
      company: 'InnovaSys Serviços',
      time: '7 min atrás', 
      type: 'warning',
      location: 'Rio de Janeiro, RJ',
      ip: '201.23.156.78'
    },
    { 
      id: 3, 
      action: 'Nova empresa cadastrada', 
      user: 'Sistema Automático', 
      company: 'DeltaFox Solutions',
      time: '15 min atrás', 
      type: 'info',
      location: 'Brasília, DF',
      ip: 'Sistema'
    },
    { 
      id: 4, 
      action: 'Logout por inatividade', 
      user: 'Pedro Costa Ferreira', 
      company: 'Global Tech Industries',
      time: '28 min atrás', 
      type: 'info',
      location: 'Belo Horizonte, MG',
      ip: '186.67.89.123'
    },
    {
      id: 5,
      action: 'Bloqueio automático por localização suspeita',
      user: 'Ana Clara Mendes',
      company: 'SecureData Corp',
      time: '1 hora atrás',
      type: 'error',
      location: 'Localização não autorizada',
      ip: '192.168.1.100'
    }
  ])

  const [topUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Thiago Borges',
      cpf: '123.456.789-01',
      email: 'thiago@deltafoxconsult.com.br',
      role: 'SUPER_ADMIN',
      company: 'DeltaFox Consultoria',
      lastLogin: '2 min atrás',
      status: 'online'
    },
    {
      id: 2,
      name: 'João Silva Santos',
      cpf: '987.654.321-00',
      email: 'joao.silva@techcorp.com.br',
      role: 'ADMIN',
      company: 'TechCorp LTDA',
      lastLogin: '5 min atrás',
      status: 'online'
    },
    {
      id: 3,
      name: 'Maria Oliveira Costa',
      cpf: '456.789.123-45',
      email: 'maria.costa@innovasys.com.br',
      role: 'USER',
      company: 'InnovaSys Serviços',
      lastLogin: '1 hora atrás',
      status: 'offline'
    },
    {
      id: 4,
      name: 'Pedro Costa Ferreira',
      cpf: '789.123.456-78',
      email: 'pedro.ferreira@globaltech.com.br',
      role: 'USER',
      company: 'Global Tech Industries',
      lastLogin: '2 horas atrás',
      status: 'offline'
    },
    {
      id: 5,
      name: 'Ana Clara Mendes',
      cpf: '321.654.987-12',
      email: 'ana.mendes@securedata.com.br',
      role: 'USER',
      company: 'SecureData Corp',
      lastLogin: '1 dia atrás',
      status: 'blocked'
    }
  ])

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = () => {
      try {
        const sessionToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('session_token='))
          ?.split('=')[1];

        if (!sessionToken) {
          router.push('/admin/login')
          return
        }

        setIsAuthenticated(true)
        
        // Carregar alertas de segurança
        loadSecurityAlerts()
        
        // Simular atualizações em tempo real
        const interval = setInterval(() => {
          setStats(prev => ({
            ...prev,
            onlineUsers: Math.floor(Math.random() * 10) + 20,
            totalLogs: prev.totalLogs + Math.floor(Math.random() * 5)
          }))
          
          // Recarregar alertas a cada 30 segundos
          loadSecurityAlerts()
          
          // Atualizar atividades recentes a cada 15 segundos
          if (Math.random() > 0.7) {
            addRealtimeActivity()
          }
        }, 15000)

        return () => clearInterval(interval)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/admin/login')
  }

  const loadSecurityAlerts = async () => {
    try {
      const response = await fetch('/api/admin/security-alerts')
      if (response.ok) {
        const data = await response.json()
        setSecurityAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error('Erro ao carregar alertas:', error)
    }
  }

  const acknowledgeAlert = async (alertId: number) => {
    try {
      const response = await fetch('/api/admin/security-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, userId: 1 }) // TODO: pegar ID do usuário logado
      })

      if (response.ok) {
        setSecurityAlerts(prev => prev.filter(alert => alert.id !== alertId))
      }
    } catch (error) {
      console.error('Erro ao reconhecer alerta:', error)
    }
  }

  // Funções para gerenciamento de usuários
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddUserLoading(true)

    try {
      // Validações
      if (newUser.password !== newUser.confirmPassword) {
        alert('As senhas não coincidem!')
        return
      }

      if (newUser.password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!')
        return
      }

      // Remover formatação do CPF
      const cpfNumbers = newUser.cpf.replace(/\D/g, '')
      
      const userData = {
        cpf: cpfNumbers,
        fullName: newUser.fullName,
        birthDate: newUser.birthDate,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        password: newUser.password,
        active: true
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        alert('Usuário criado com sucesso!')
        setShowAddUserModal(false)
        resetUserForm()
        // Recarregar estatísticas
        loadSecurityAlerts()
      } else {
        const errorData = await response.json()
        alert(`Erro ao criar usuário: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      alert('Erro ao criar usuário. Tente novamente.')
    } finally {
      setAddUserLoading(false)
    }
  }

  const resetUserForm = () => {
    setNewUser({
      cpf: '',
      fullName: '',
      birthDate: '',
      email: '',
      phone: '',
      role: 'USER',
      password: '',
      confirmPassword: ''
    })
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  // Adicionar listener para abrir modal
  useEffect(() => {
    const handleOpenAddUserModal = () => {
      setShowAddUserModal(true)
    }
    
    window.addEventListener('openAddUserModal', handleOpenAddUserModal)
    
    return () => {
      window.removeEventListener('openAddUserModal', handleOpenAddUserModal)
    }
  }, [])

  const addRealtimeActivity = () => {
    const activities = [
      {
        id: Date.now(),
        action: 'Acesso ao painel de usuários',
        user: 'Maria Silva Santos',
        company: 'TechCorp LTDA',
        time: 'Agora',
        type: 'info' as const,
        location: 'São Paulo, SP',
        ip: '177.45.123.78'
      },
      {
        id: Date.now() + 1,
        action: 'Logout realizado',
        user: 'Pedro Costa Ferreira',
        company: 'Global Tech Industries',
        time: 'Agora',
        type: 'success' as const,
        location: 'Rio de Janeiro, RJ',
        ip: '201.23.156.89'
      },
      {
        id: Date.now() + 2,
        action: 'Tentativa de acesso negado',
        user: 'Ana Clara Mendes',
        company: 'SecureData Corp',
        time: 'Agora',
        type: 'warning' as const,
        location: 'Brasília, DF',
        ip: '186.67.89.154'
      }
    ]

    const newActivity = activities[Math.floor(Math.random() * activities.length)]
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]) // Manter apenas 10 itens
  }

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
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do usuário logado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-slate-400">Federal Global by DeltaFox - Sistema de Inteligência</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Indicador de Alertas de Segurança */}
          {securityAlerts.length > 0 && (
            <button
              onClick={() => setShowAlertsModal(true)}
              className="relative bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
            >
              <span className="mr-2">⚠️</span>
              Alertas ({securityAlerts.length})
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {securityAlerts.length}
              </span>
            </button>
          )}
          
          <div className="text-right">
            <p className="text-sm text-white">Thiago Ferreira Alves e Borges</p>
            <p className="text-xs text-green-400">Super Administrador</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: '📊' },
            { id: 'users', label: 'Usuários', icon: '👥' },
            { id: 'activity', label: 'Atividades', icon: '📋' },
            { id: 'system', label: 'Sistema', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'activity' | 'system')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Usuários Totais</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
                  <p className="text-xs text-green-400">+12 este mês</p>
                </div>
                <div className="text-blue-400 text-3xl">👥</div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Empresas Ativas</p>
                  <p className="text-3xl font-bold text-green-400">{stats.totalCompanies}</p>
                  <p className="text-xs text-green-400">+3 este mês</p>
                </div>
                <div className="text-green-400 text-3xl">🏢</div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Logs Registrados</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.totalLogs.toLocaleString()}</p>
                  <p className="text-xs text-yellow-400">Tempo real</p>
                </div>
                <div className="text-yellow-400 text-3xl">📋</div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Usuários Online</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.onlineUsers}</p>
                  <p className="text-xs text-purple-400">Agora</p>
                </div>
                <div className="text-purple-400 text-3xl">🟢</div>
              </div>
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Status do Sistema</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-green-400 font-medium">{stats.systemUptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">GPS Precisão Média</span>
                  <span className="text-blue-400 font-medium">±{stats.gpsAccuracy}m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Nível de Segurança</span>
                  <span className="text-red-400 font-medium">{stats.securityLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Criptografia</span>
                  <span className="text-green-400 font-medium">✅ AES-256</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Atividade Recente</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-slate-700 rounded">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-400' :
                      activity.type === 'warning' ? 'bg-yellow-400' :
                      activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-slate-400 text-xs">{activity.user} - {activity.company}</p>
                      <p className="text-slate-500 text-xs">{activity.time} • {activity.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => router.push('/admin/public-users')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white p-6 rounded-lg text-left transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold">Painel de Clientes</h4>
                  <p className="text-sm opacity-90">Visualizar usuários cadastrados</p>
                </div>
                <div className="text-3xl">👤</div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/users')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-lg text-left transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold">Usuários Internos</h4>
                  <p className="text-sm opacity-90">Gerenciar equipe interna</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </button>

            <button 
              onClick={() => setShowAlertsModal(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-6 rounded-lg text-left transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold">Alertas de Segurança</h4>
                  <p className="text-sm opacity-90">{securityAlerts.length} alertas pendentes</p>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestão de Usuários</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              + Novo Usuário
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Último Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {topUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                          <div className="text-xs text-slate-500">{user.cpf}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'SUPER_ADMIN' ? 'bg-red-900 text-red-400' :
                          user.role === 'ADMIN' ? 'bg-blue-900 text-blue-400' :
                          'bg-gray-900 text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'online' ? 'bg-green-900 text-green-400' :
                          user.status === 'offline' ? 'bg-gray-900 text-gray-400' :
                          'bg-red-900 text-red-400'
                        }`}>
                          {user.status === 'online' ? '🟢 Online' :
                           user.status === 'offline' ? '⚫ Offline' : '🔴 Bloqueado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">Editar</button>
                        <button className="text-red-400 hover:text-red-300">Bloquear</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Log de Atividades</h2>
          
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border-b border-slate-700 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          activity.type === 'success' ? 'bg-green-400' :
                          activity.type === 'warning' ? 'bg-yellow-400' :
                          activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-slate-400 text-sm">{activity.user}</p>
                          {activity.company && (
                            <p className="text-slate-500 text-sm">{activity.company}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-slate-500 text-xs">{activity.time}</span>
                            {activity.location && (
                              <span className="text-slate-500 text-xs">📍 {activity.location}</span>
                            )}
                            {activity.ip && activity.ip !== 'Sistema' && (
                              <span className="text-slate-500 text-xs">🌐 {activity.ip}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${
                        activity.type === 'success' ? 'bg-green-900 text-green-400' :
                        activity.type === 'warning' ? 'bg-yellow-900 text-yellow-400' :
                        activity.type === 'error' ? 'bg-red-900 text-red-400' :
                        'bg-blue-900 text-blue-400'
                      }`}>
                        {activity.type.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Configurações do Sistema</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Configurações de Segurança</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">GPS Obrigatório</span>
                  <span className="text-green-400">✅ Ativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Criptografia AES-256</span>
                  <span className="text-green-400">✅ Ativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Log de Auditoria</span>
                  <span className="text-green-400">✅ Ativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Backup Automático</span>
                  <span className="text-green-400">✅ Diário</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Informações do Servidor</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Versão do Sistema</span>
                  <span className="text-blue-400">v2.0.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Banco de Dados</span>
                  <span className="text-green-400">MySQL 8.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Servidor</span>
                  <span className="text-blue-400">Vercel</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Última Atualização</span>
                  <span className="text-slate-400">30/10/2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Alertas de Segurança */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center">
                ⚠️ Alertas de Segurança ({securityAlerts.length})
              </h2>
              <button 
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {securityAlerts.length > 0 ? (
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'CRITICAL' ? 'bg-red-900/20 border-red-500' :
                      alert.severity === 'HIGH' ? 'bg-orange-900/20 border-orange-500' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-900/20 border-yellow-500' :
                      'bg-blue-900/20 border-blue-500'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full mr-3 ${
                              alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                              alert.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                              alert.severity === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                              'bg-blue-500 text-white'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className="text-slate-400 text-sm">
                              {new Date(alert.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          
                          <h3 className="text-white font-medium mb-1">{alert.message}</h3>
                          <p className="text-slate-300 text-sm">
                            Usuário: {alert.user.fullName} ({alert.user.role})
                          </p>
                          
                          {alert.details && (
                            <div className="mt-2 text-xs text-slate-400">
                              <p>Tipo: {alert.alertType}</p>
                              {typeof alert.details === 'object' && alert.details !== null && 'currentDevice' in alert.details && (
                                <p>Dispositivo atual: {String((alert.details as Record<string, { location?: string }>).currentDevice?.location || 'N/A')}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Reconhecer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">Nenhum alerta de segurança pendente</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Usuário */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Adicionar Usuário</h2>
              <button
                onClick={() => {
                  setShowAddUserModal(false)
                  resetUserForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  value={newUser.cpf}
                  onChange={(e) => setNewUser(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  maxLength={14}
                />
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={newUser.birthDate}
                  onChange={(e) => setNewUser(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  maxLength={15}
                />
              </div>

              {/* Função/Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'USER' | 'ADMIN' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme a senha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  minLength={6}
                />
              </div>

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false)
                    resetUserForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={addUserLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={addUserLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {addUserLoading ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}