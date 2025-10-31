'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDomainContext } from '../../lib/utils/domain'

interface WeatherData {
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
        }
      }
    }>
  }
}

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
}

interface LocationInfo {
  city: string
  country: string
  region: string
}

export default function LoginPage() {
  const router = useRouter()
  const domainContext = useDomainContext()
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [gpsData, setGpsData] = useState<{ latitude: number; longitude: number } | null>(null)
  
  // Estados para menu lateral
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [newsRss, setNewsRss] = useState<NewsItem[]>([])

  // Atualizar relógio a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Obter localização e previsão do tempo
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            setGpsData({ latitude, longitude })

            try {
              const locationResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
              )
              const locationData = await locationResponse.json()
              setLocation({
                city: locationData.city || locationData.locality || 'Brasília',
                country: locationData.countryName || 'Brasil',
                region: locationData.principalSubdivision || 'DF'
              })

              // Obter previsão do tempo
              const weatherResponse = await fetch(
                `https://wttr.in/${latitude},${longitude}?format=j1`
              )
              const weatherData = await weatherResponse.json()
              
              const convertedWeather: WeatherData = {
                current: {
                  temp_c: parseFloat(weatherData.current_condition[0].temp_C),
                  condition: {
                    text: weatherData.current_condition[0].weatherDesc[0].value,
                    icon: getWeatherIcon(weatherData.current_condition[0].weatherCode)
                  }
                },
                forecast: {
                  forecastday: weatherData.weather.slice(0, 7).map((day: {
                    date: string
                    maxtempC: string
                    mintempC: string
                    hourly: Array<{ weatherDesc: Array<{ value: string }> }>
                  }) => ({
                    date: day.date,
                    day: {
                      maxtemp_c: parseFloat(day.maxtempC),
                      mintemp_c: parseFloat(day.mintempC),
                      condition: {
                        text: day.hourly[4].weatherDesc[0].value,
                        // @ts-ignore - API de clima externa
                        icon: getWeatherIcon(day.hourly[4].weatherCode)
                      }
                    }
                  }))
                }
              }
              
              setWeather(convertedWeather)
            } catch (error) {
              console.error('Erro ao obter dados meteorológicos:', error)
              setLocation({
                city: 'Brasília',
                country: 'Brasil',
                region: 'DF'
              })
            }
          }, () => {
            setLocation({
              city: 'Brasília',
              country: 'Brasil', 
              region: 'DF'
            })
          })
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error)
      }
    }

    getLocationAndWeather()
  }, [])

  // Obter feed de notícias RSS
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const rssUrl = encodeURIComponent('https://rss.cnn.com/rss/edition.rss')
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=5`)
        const data = await response.json()
        
        if (data.status === 'ok') {
          setNewsRss(data.items)
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      }
    }

    fetchNews()
  }, [])

  const getWeatherIcon = (code: string) => {
    const codeNum = parseInt(code)
    if (codeNum >= 200 && codeNum < 300) return '⛈️'
    if (codeNum >= 300 && codeNum < 400) return '🌦️'
    if (codeNum >= 500 && codeNum < 600) return '🌧️'
    if (codeNum >= 600 && codeNum < 700) return '❄️'
    if (codeNum >= 700 && codeNum < 800) return '🌫️'
    if (codeNum === 800) return '☀️'
    if (codeNum > 800) return '☁️'
    return '🌤️'
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gpsData) {
      setError('🛡️ GPS é obrigatório para acessar o sistema. Por favor, permita o acesso à localização.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      const response = await fetch('/api/auth/domain-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cpf: formData.cpf,
          password: formData.password,
          gpsData,
          deviceInfo
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Generate temporary session URL
        const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('temp_session', tempSessionId)
        
        const redirectTo = data.data.context.redirectTo
        router.push(`${redirectTo}?session=${tempSessionId}`)
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Menu Lateral Esquerdo - Informações Públicas */}
      <div className="w-80 bg-black/40 backdrop-blur-sm border-r border-blue-500/20 p-6 overflow-y-auto">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <h2 className="text-xl font-bold text-white">Federal Global</h2>
          <p className="text-blue-300 text-sm">Sistema de Inteligência</p>
        </div>

        {/* Localização Atual */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            📍 Localização Atual
          </h3>
          {location ? (
            <div className="text-sm">
              <p className="text-blue-300">{location.city}</p>
              <p className="text-slate-400">{location.region}, {location.country}</p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Carregando...</p>
          )}
        </div>

        {/* Data e Hora */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            🕒 Data e Hora
          </h3>
          <div className="text-sm">
            <p className="text-blue-300">{currentTime.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="text-slate-400">{currentTime.toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>

        {/* Previsão do Tempo */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            🌤️ Previsão do Tempo
          </h3>
          {weather ? (
            <div>
              {/* Tempo Atual */}
              <div className="text-center mb-4 p-3 bg-blue-900/30 rounded-lg">
                <div className="text-2xl mb-1">{weather.current.condition.icon}</div>
                <div className="text-xl font-bold text-white">{weather.current.temp_c}°C</div>
                <div className="text-xs text-slate-400">{weather.current.condition.text}</div>
              </div>
              
              {/* Próximos 7 dias */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">Próximos 7 dias:</p>
                {weather.forecast.forecastday.map((day, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <span className="text-lg">{day.day.condition.icon}</span>
                    <span className="text-white">
                      {Math.round(day.day.maxtemp_c)}°/{Math.round(day.day.mintemp_c)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Carregando previsão...</p>
          )}
        </div>

        {/* Feed de Notícias */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            📰 Notícias
          </h3>
          {newsRss.length > 0 ? (
            <div className="space-y-3">
              {newsRss.map((item, index) => (
                <div key={index} className="border-b border-slate-700 pb-2 last:border-b-0">
                  <p className="text-xs text-blue-300 line-clamp-2">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(item.pubDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Carregando notícias...</p>
          )}
        </div>
      </div>

      {/* Área Principal de Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Federal Global</h1>
            <p className="text-blue-300">Painel Administrativo</p>
            <div className="text-sm text-green-300 mt-2">
              🌐 {domainContext.hostname}
            </div>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* CPF */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={handleCPFChange}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* GPS Status */}
            <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-3">
              <p className="text-orange-300 text-sm flex items-center">
                ⚠️ <span className="ml-2">GPS obrigatório: O sistema solicitará sua localização para acesso</span>
              </p>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading || !gpsData}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar no Dashboard'
              )}
            </button>
          </form>

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