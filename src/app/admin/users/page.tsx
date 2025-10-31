'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserData {
  id: number
  cpf: string
  fullName: string
  email: string
  phone: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  photo?: string | null
  protocolNumber: string
  active: boolean
  createdAt: string
  updatedAt: string
  lastAccess?: {
    accessDateTime: string
    ipAddress: string
    networkCapture?: {
      country: string
      city: string
      internetProvider: string
      connectionType: string
    }
    deviceCapture?: {
      operatingSystem: string
      browser: string
      gpsLatitude?: number
      gpsLongitude?: number
      deviceCountry: string
      deviceCity: string
    }
  }
  isOnline: boolean
  actionLogs?: ActionLog[]
}

interface ActionLog {
  id: number
  action: string
  targetTable?: string
  targetId?: number
  ipAddress: string
  createdAt: string
  accessLog: {
    sessionId: string
    accessType: string
    deviceCapture?: {
      operatingSystem: string
    }
  }
}

interface UserModalData extends UserData {
  navigationHistory?: {
    url: string
    timestamp: string
    action: string
  }[]
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserModalData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [loadingUserDetails, setLoadingUserDetails] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        console.error('Erro ao carregar usuários')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserDetails = async (userId: number) => {
    setLoadingUserDetails(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/details`)
      if (response.ok) {
        const userData = await response.json()
        setSelectedUser(userData)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do usuário:', error)
    } finally {
      setLoadingUserDetails(false)
    }
  }

  const loadNavigationHistory = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/navigation-history`)
      if (response.ok) {
        const historyData = await response.json()
        setSelectedUser(prev => prev ? { ...prev, navigationHistory: historyData.history } : null)
        setShowHistoryModal(true)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de navegação:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-900 text-red-300'
      case 'ADMIN': return 'bg-blue-900 text-blue-300'
      case 'USER': return 'bg-gray-900 text-gray-300'
      default: return 'bg-gray-900 text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Administração Interna</h1>
          <p className="text-slate-400">Gestão de usuários e monitoramento de acessos</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          ← Voltar ao Dashboard
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total de Usuários</p>
              <p className="text-3xl font-bold text-blue-400">{users.length}</p>
            </div>
            <div className="text-blue-400 text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Usuários Online</p>
              <p className="text-3xl font-bold text-green-400">{users.filter(u => u.isOnline).length}</p>
            </div>
            <div className="text-green-400 text-3xl">🟢</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Administradores</p>
              <p className="text-3xl font-bold text-purple-400">{users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length}</p>
            </div>
            <div className="text-purple-400 text-3xl">🛡️</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Usuários Ativos</p>
              <p className="text-3xl font-bold text-yellow-400">{users.filter(u => u.active).length}</p>
            </div>
            <div className="text-yellow-400 text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Lista de Usuários</h2>
          <p className="text-slate-400 text-sm">Clique em um usuário para ver detalhes completos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => loadUserDetails(user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        {user.photo ? (
                          <img src={user.photo} alt={user.fullName} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-white font-bold">{user.fullName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.fullName}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                        <div className="text-xs text-slate-500">{user.cpf}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      <span className={`text-sm ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.lastAccess ? formatDate(user.lastAccess.accessDateTime) : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.lastAccess?.networkCapture ? 
                      `${user.lastAccess.networkCapture.city}, ${user.lastAccess.networkCapture.country}` : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.lastAccess?.deviceCapture?.operatingSystem || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Usuário */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Detalhes do Usuário</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dados de Cadastro */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Dados de Cadastro</h3>
                  
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      {selectedUser.photo ? (
                        <img src={selectedUser.photo} alt={selectedUser.fullName} className="w-20 h-20 rounded-full" />
                      ) : (
                        <span className="text-white font-bold text-2xl">{selectedUser.fullName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Nome Completo</p>
                      <p className="text-white">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">CPF</p>
                      <p className="text-white">{selectedUser.cpf}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Telefone</p>
                      <p className="text-white">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Protocolo</p>
                      <p className="text-white">{selectedUser.protocolNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Cadastrado em</p>
                      <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Dados da Última Conexão */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Última Conexão</h3>
                  
                  {selectedUser.lastAccess ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Data/Hora</p>
                        <p className="text-white">{formatDate(selectedUser.lastAccess.accessDateTime)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">IP Address</p>
                        <p className="text-white">{selectedUser.lastAccess.ipAddress}</p>
                      </div>
                      {selectedUser.lastAccess.networkCapture && (
                        <>
                          <div>
                            <p className="text-slate-400 text-sm">Localização por IP</p>
                            <p className="text-white">{selectedUser.lastAccess.networkCapture.city}, {selectedUser.lastAccess.networkCapture.country}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Provedor</p>
                            <p className="text-white">{selectedUser.lastAccess.networkCapture.internetProvider}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Tipo de Conexão</p>
                            <p className="text-white">{selectedUser.lastAccess.networkCapture.connectionType}</p>
                          </div>
                        </>
                      )}
                      {selectedUser.lastAccess.deviceCapture && (
                        <>
                          <div>
                            <p className="text-slate-400 text-sm">Sistema Operacional</p>
                            <p className="text-white">{selectedUser.lastAccess.deviceCapture.operatingSystem}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Navegador</p>
                            <p className="text-white">{selectedUser.lastAccess.deviceCapture.browser}</p>
                          </div>
                          {selectedUser.lastAccess.deviceCapture.gpsLatitude && (
                            <div>
                              <p className="text-slate-400 text-sm">Localização GPS</p>
                              <p className="text-white">{selectedUser.lastAccess.deviceCapture.deviceCity}, {selectedUser.lastAccess.deviceCapture.deviceCountry}</p>
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${selectedUser.lastAccess.deviceCapture.gpsLatitude},${selectedUser.lastAccess.deviceCapture.gpsLongitude}`}
                                target="_blank"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Ver no Google Maps →
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400">Nenhuma conexão registrada</p>
                  )}
                </div>

                {/* Logs de Ações */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Logs de Ações Recentes</h3>
                  
                  {selectedUser.actionLogs && selectedUser.actionLogs.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedUser.actionLogs.slice(0, 10).map((log) => (
                        <div key={log.id} className="border-b border-slate-700 pb-2">
                          <p className="text-white text-sm font-medium">{log.action}</p>
                          <p className="text-slate-400 text-xs">{formatDate(log.createdAt)}</p>
                          <p className="text-slate-500 text-xs">IP: {log.ipAddress}</p>
                          {log.accessLog.deviceCapture && (
                            <p className="text-slate-500 text-xs">SO: {log.accessLog.deviceCapture.operatingSystem}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400">Nenhuma ação registrada</p>
                  )}
                </div>
              </div>

              {/* Botão Histórico de Navegação */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => loadNavigationHistory(selectedUser.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  📊 Ver Histórico de Navegação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Histórico de Navegação */}
      {showHistoryModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Histórico de Navegação - {selectedUser.fullName}</h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {selectedUser.navigationHistory && selectedUser.navigationHistory.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.navigationHistory.map((entry, index) => (
                    <div key={index} className="bg-slate-900 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-medium">{entry.action}</p>
                          <p className="text-blue-400 text-sm">{entry.url}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">{formatDate(entry.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center">Nenhum histórico de navegação disponível</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loadingUserDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando detalhes...</p>
          </div>
        </div>
      )}
    </div>
  )
}