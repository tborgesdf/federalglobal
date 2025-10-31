'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        // Salvar dados do usuário no sessionStorage
        sessionStorage.setItem('federal_global_user', JSON.stringify(result.data.user))
        sessionStorage.setItem('federal_global_session', JSON.stringify(result.data.session))
        
        // Redirecionar conforme o tipo de usuário
        const redirectTo = result.data.context.redirectTo
        router.push(redirectTo)
      } else {
        setError(result.error || 'Erro no login')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            🛡️ Federal Global
          </h1>
          <h2 className="text-xl text-white mb-6">
            Painel Administrativo
          </h2>
          <div className="text-sm text-green-400 bg-green-900/20 p-2 rounded mb-6">
            🌐 admin.federalglobal.deltafoxconsult.com.br
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-slate-300 mb-2">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              required
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="text-sm text-yellow-400 bg-yellow-900/20 p-3 rounded">
            📍 <strong>GPS obrigatório:</strong> O sistema solicitará sua localização para acesso
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {loading ? 'Verificando GPS...' : 'Entrar no Dashboard'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <div className="text-xs text-slate-500 pt-4">
            Federal Global by DeltaFox Consultoria<br/>
            Sistema de Inteligência Avançada
          </div>
        </div>
      </div>
    </div>
  )
}