'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [location, setLocation] = useState('')

  // Atualizar relógio
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Detectar localização
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Usar API de geocodificação reversa para obter cidade
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=pt`
            )
            const data = await response.json()
            setLocation(`${data.city || 'Localização'}, ${data.principalSubdivision || 'BR'}`)
          } catch {
            setLocation('Localização Detectada')
          }
        },
        () => {
          setLocation('Localização Não Detectada')
        }
      )
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verificar GPS
      if (!navigator.geolocation) {
        throw new Error('GPS obrigatório para acesso ao sistema')
      }

      const gpsData = await new Promise<{latitude: number, longitude: number, accuracy: number}>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          () => reject(new Error('GPS obrigatório para acesso'))
        )
      })

      // Capturar informações do dispositivo
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      // Fazer login via API
      const response = await fetch('/api/auth/domain-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: formData.cpf,
          password: formData.password,
          gpsData,
          deviceInfo
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Salvar dados de sessão
        sessionStorage.setItem('federal_global_user', JSON.stringify(result.data.user))
        sessionStorage.setItem('federal_global_session', JSON.stringify(result.data.session))
        
        // Redirecionar para dashboard
        router.push('/admin')
      } else {
        setError(result.error || 'Erro no login')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Menu Lateral */}
      <aside className="w-64 bg-slate-800/80 backdrop-blur-sm border-r border-slate-700 flex flex-col">
        {/* Logo no Menu */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-400">Federal Global</h2>
              <p className="text-xs text-slate-400">Painel Administrativo</p>
            </div>
          </div>
        </div>
        
        {/* Navegação */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/30 text-blue-300">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg text-slate-400">
              <span>👤</span>
              <span>Painel de Clientes</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg text-slate-400">
              <span>👥</span>
              <span>Usuários Internos</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg text-slate-400">
              <span>⚙️</span>
              <span>Configurações</span>
            </div>
          </div>
        </nav>
        
        {/* Informações do Sistema */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 space-y-1">
            <p className="text-green-400">🌐 admin.federalglobal.deltafoxconsult.com.br</p>
            <p>📍 {location || 'Detectando localização...'}</p>
            <p>🕒 {currentTime}</p>
            <p className="text-green-400 mt-2">🟢 Sistema Online</p>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Federal Global</h1>
            <p className="text-blue-300">Área Administrativa</p>
          </div>

          {/* Card de Login */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-blue-200 text-sm font-medium mb-2">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                  className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  autoComplete="username"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-blue-200 text-sm font-medium mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Aviso GPS */}
              <div className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                📍 <strong>GPS obrigatório:</strong> O sistema solicitará sua localização para acesso
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando GPS...
                  </div>
                ) : (
                  'Entrar no Dashboard'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm">
              Federal Global by DeltaFox Consultoria<br />
              Sistema de Inteligência Avançada
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}