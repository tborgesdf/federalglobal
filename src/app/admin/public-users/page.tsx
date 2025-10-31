'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PublicUser {
  id: number
  cpf: string
  fullName: string
  email: string
  phone: string
  birthDate?: string
  role: string
  protocolNumber: string
  active: boolean
  emailVerified: boolean
  acceptedTerms: boolean
  termsAcceptedAt?: string
  gpsLocation?: {
    latitude: number
    longitude: number
  }
  deviceInfo?: {
    userAgent?: string
    platform?: string
    language?: string
    screenResolution?: string
    timezone?: string
    [key: string]: string | number | undefined
  }
  createdAt: string
  updatedAt: string
  userType: string
}

export default function PublicUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificação de autenticação
  useEffect(() => {
    const checkAuth = () => {
      const sessionToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_token='))
        ?.split('=')[1];
      
      if (!sessionToken) {
        router.push('/login')
        return
      }
      
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router])

  const loadUsers = async () => {
    if (!isAuthenticated) return
    
    try {
      const response = await fetch('/api/admin/public-users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        console.error('Erro ao carregar usuários públicos')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Erro ao carregar usuários públicos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers()
    }
  }, [isAuthenticated, loadUsers])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando usuários públicos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Clientes</h1>
          <p className="text-slate-400">Usuários cadastrados pelo site público</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            👥 Usuários Internos
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total de Clientes</p>
              <p className="text-3xl font-bold text-blue-400">{users.length}</p>
            </div>
            <div className="text-blue-400 text-3xl">👤</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Email Verificado</p>
              <p className="text-3xl font-bold text-green-400">{users.filter(u => u.emailVerified).length}</p>
            </div>
            <div className="text-green-400 text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Termos Aceitos</p>
              <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.acceptedTerms).length}</p>
            </div>
            <div className="text-purple-400 text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Com GPS</p>
              <p className="text-3xl font-bold text-yellow-400">{users.filter(u => u.gpsLocation).length}</p>
            </div>
            <div className="text-yellow-400 text-3xl">📍</div>
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Lista de Clientes Públicos</h2>
          <p className="text-slate-400 text-sm">Clique em um cliente para ver detalhes completos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Protocolo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data Nascimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">GPS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedUser(user)
                    setShowModal(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">{user.fullName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.fullName}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                        <div className="text-xs text-slate-500">{formatCPF(user.cpf)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                      {user.protocolNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className={`text-xs ${user.active ? 'text-green-400' : 'text-red-400'}`}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.emailVerified ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                        <span className={`text-xs ${user.emailVerified ? 'text-blue-400' : 'text-yellow-400'}`}>
                          {user.emailVerified ? 'Email OK' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.birthDate ? (
                      <div>
                        <div>{new Date(user.birthDate).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-slate-400">{getAge(user.birthDate)} anos</div>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.gpsLocation ? (
                      <div className="text-green-400">
                        <div className="text-xs">📍 Disponível</div>
                        <div className="text-xs text-slate-400">
                          {user.gpsLocation.latitude.toFixed(4)}, {user.gpsLocation.longitude.toFixed(4)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-red-400">❌ Não disponível</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDate(user.createdAt)}
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
              <h2 className="text-2xl font-bold text-white">Detalhes do Cliente Público</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dados Pessoais */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Dados Pessoais</h3>
                  
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-2xl">{selectedUser.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                      {selectedUser.protocolNumber}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Nome Completo</p>
                      <p className="text-white">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">CPF</p>
                      <p className="text-white">{formatCPF(selectedUser.cpf)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedUser.email}</p>
                      <span className={`text-xs px-2 py-1 rounded ${selectedUser.emailVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {selectedUser.emailVerified ? '✅ Verificado' : '⏳ Pendente'}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Telefone</p>
                      <p className="text-white">{formatPhone(selectedUser.phone)}</p>
                    </div>
                    {selectedUser.birthDate && (
                      <div>
                        <p className="text-slate-400 text-sm">Data de Nascimento</p>
                        <p className="text-white">{new Date(selectedUser.birthDate).toLocaleDateString('pt-BR')}</p>
                        <p className="text-slate-400 text-xs">{getAge(selectedUser.birthDate)} anos</p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-400 text-sm">Cadastrado em</p>
                      <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Dados de Localização */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Localização GPS</h3>
                  
                  {selectedUser.gpsLocation ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Coordenadas</p>
                        <p className="text-white text-sm">
                          Lat: {selectedUser.gpsLocation.latitude.toFixed(6)}<br/>
                          Lng: {selectedUser.gpsLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                      
                      {/* Mini Mapa */}
                      <div className="border border-slate-600 rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedUser.gpsLocation.longitude - 0.01},${selectedUser.gpsLocation.latitude - 0.01},${selectedUser.gpsLocation.longitude + 0.01},${selectedUser.gpsLocation.latitude + 0.01}&layer=mapnik&marker=${selectedUser.gpsLocation.latitude},${selectedUser.gpsLocation.longitude}`}
                        ></iframe>
                      </div>
                      
                      <div className="flex space-x-2">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedUser.gpsLocation.latitude},${selectedUser.gpsLocation.longitude}`}
                          target="_blank"
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          🗺️ Google Maps
                        </a>
                        <a 
                          href={`https://www.openstreetmap.org/?mlat=${selectedUser.gpsLocation.latitude}&mlon=${selectedUser.gpsLocation.longitude}&zoom=15`}
                          target="_blank"
                          className="text-green-400 hover:text-green-300 text-xs"
                        >
                          🌍 OpenStreetMap
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400">GPS não capturado durante o cadastro</p>
                  )}
                </div>

                {/* Informações do Dispositivo */}
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Dados do Dispositivo</h3>
                  
                  {selectedUser.deviceInfo ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Navegador</p>
                        <p className="text-white text-sm">{selectedUser.deviceInfo.userAgent?.split(' ')[0] || 'Desconhecido'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Plataforma</p>
                        <p className="text-white text-sm">{selectedUser.deviceInfo.platform || 'Desconhecida'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Idioma</p>
                        <p className="text-white text-sm">{selectedUser.deviceInfo.language || 'Desconhecido'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Resolução de Tela</p>
                        <p className="text-white text-sm">{selectedUser.deviceInfo.screenResolution || 'Desconhecida'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Fuso Horário</p>
                        <p className="text-white text-sm">{selectedUser.deviceInfo.timezone || 'Desconhecido'}</p>
                      </div>
                      {selectedUser.deviceInfo.connection && (
                        <div>
                          <p className="text-slate-400 text-sm">Conexão</p>
                          <p className="text-white text-sm">
                            {/* @ts-ignore - Dynamic device info */}
                            {selectedUser.deviceInfo.connection.effectiveType || 'Desconhecido'}
                            {/* @ts-ignore - Dynamic device info */}
                            {selectedUser.deviceInfo.connection.downlink && ` (${selectedUser.deviceInfo.connection.downlink} Mbps)`}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400">Informações do dispositivo não disponíveis</p>
                  )}
                </div>
              </div>

              {/* Informações Legais */}
              <div className="mt-6 bg-slate-900 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">Informações Legais e Conformidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-400 text-sm">Termos de Uso</p>
                    <p className={`text-sm ${selectedUser.acceptedTerms ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedUser.acceptedTerms ? '✅ Aceitos' : '❌ Não aceitos'}
                    </p>
                    {selectedUser.termsAcceptedAt && (
                      <p className="text-slate-400 text-xs">
                        Aceitos em: {formatDate(selectedUser.termsAcceptedAt)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status da Conta</p>
                    <p className={`text-sm ${selectedUser.active ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedUser.active ? '✅ Ativa' : '❌ Inativa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}