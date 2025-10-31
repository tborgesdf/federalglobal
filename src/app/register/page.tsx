'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
  connection?: {
    effectiveType: string
    type: string
    downlink: number
    rtt: number
  }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    termsAcceptedAt: null as Date | null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

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

  const handleInputChange = (field: string, value: string | boolean) => {
    let formattedValue = value
    
    if (typeof value === 'string') {
      if (field === 'cpf') {
        formattedValue = formatCPF(value)
      } else if (field === 'phone') {
        formattedValue = formatPhone(value)
      }
    }
    
    // Se for o campo de aceitar termos, salvar timestamp
    if (field === 'acceptedTerms') {
      setFormData(prev => ({ 
        ...prev, 
        acceptedTerms: value as boolean,
        termsAcceptedAt: value ? new Date() : null
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: formattedValue }))
    }
  }

  const handleTermsClick = () => {
    setShowTermsModal(true)
  }

  const getGpsLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const captureDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as NavigatorWithMemory).deviceMemory || 'unknown',
      connection: (navigator as NavigatorWithMemory).connection ? {
        effectiveType: (navigator as NavigatorWithMemory).connection!.effectiveType,
        type: (navigator as NavigatorWithMemory).connection!.type,
        downlink: (navigator as NavigatorWithMemory).connection!.downlink,
        rtt: (navigator as NavigatorWithMemory).connection!.rtt
      } : null,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      documentSize: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
      timestamp: new Date().toISOString()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      setLoading(false)
      return
    }

    if (!formData.acceptedTerms) {
      setError('Você deve aceitar os termos de uso para continuar')
      setLoading(false)
      return
    }

    try {
      // Solicitar GPS
      const gpsLocation = await getGpsLocation()

      // Capturar informações do dispositivo
      const deviceInfo = captureDeviceInfo()

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          birthDate: formData.birthDate,
          password: formData.password,
          acceptedTerms: formData.acceptedTerms,
          termsAcceptedAt: formData.termsAcceptedAt,
          gpsData: gpsLocation,
          deviceInfo: deviceInfo
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Cadastro realizado com sucesso! Você pode fazer login agora.')
        window.location.href = '/login'
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (gpsError) {
      console.error('Erro GPS:', gpsError)
      setError('🛡️ GPS é obrigatório para criar conta. Por favor, permita o acesso à localização e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Federal Global</h1>
          <p className="text-blue-300">Criar Nova Conta</p>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="Seu nome completo"
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="000.000.000-00"
                maxLength={14}
                required
                autoComplete="off"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Telefone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
                autoComplete="tel"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                placeholder="Digite a senha novamente"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Checkbox de Termos de Uso */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptedTerms}
                onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                required
              />
              <label htmlFor="acceptTerms" className="text-blue-200 text-sm cursor-pointer">
                Eu aceito os{' '}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Termos de Uso
                </button>
                {' '}e autorizo o uso dos meus dados conforme a política de privacidade
              </label>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link para Login */}
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Federal Global by DeltaFox Consultoria<br />
            Sistema de Inteligência Avançada
          </p>
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Termos de Uso - Federal Global</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="text-slate-300 space-y-4 text-sm leading-relaxed">
              <h3 className="text-white font-semibold text-base">1. Aceitação dos Termos</h3>
              <p>
                Ao utilizar o sistema Federal Global, você concorda com estes termos de uso e nossa política de privacidade.
                Este é um sistema de inteligência avançada que requer autorização para coleta de dados de localização e dispositivo.
              </p>

              <h3 className="text-white font-semibold text-base">2. Coleta de Dados</h3>
              <p>
                Para garantir a segurança do sistema, coletamos as seguintes informações:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Dados pessoais fornecidos no cadastro (nome, email, CPF, telefone, data de nascimento)</li>
                <li>Localização GPS no momento do cadastro (obrigatório)</li>
                <li>Informações do dispositivo (sistema operacional, navegador, resolução de tela)</li>
                <li>Dados de conexão (IP, provedor, tipo de rede)</li>
                <li>Logs de acesso e atividades no sistema</li>
              </ul>

              <h3 className="text-white font-semibold text-base">3. Uso dos Dados</h3>
              <p>
                Os dados coletados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Autenticação e verificação de identidade</li>
                <li>Prevenção de fraudes e atividades suspeitas</li>
                <li>Análise de segurança e monitoramento do sistema</li>
                <li>Melhoria dos serviços oferecidos</li>
                <li>Cumprimento de obrigações legais</li>
              </ul>

              <h3 className="text-white font-semibold text-base">4. Segurança e Proteção</h3>
              <p>
                O Federal Global implementa medidas avançadas de segurança incluindo:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Criptografia de dados sensíveis</li>
                <li>Proteção contra captura de tela</li>
                <li>Monitoramento de atividades suspeitas</li>
                <li>Verificação contínua de integridade</li>
              </ul>

              <h3 className="text-white font-semibold text-base">5. Responsabilidades do Usuário</h3>
              <p>
                O usuário compromete-se a:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a confidencialidade de suas credenciais</li>
                <li>Usar o sistema apenas para fins legítimos</li>
                <li>Não tentar burlar as medidas de segurança</li>
              </ul>

              <h3 className="text-white font-semibold text-base">6. Contato</h3>
              <p>
                Para dúvidas sobre estes termos, entre em contato através do sistema ou pelos canais oficiais da Federal Global.
              </p>

              <p className="text-blue-300 font-medium mt-6">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}