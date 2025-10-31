'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ClientHome() {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Olá! 👋 Bem-vindo ao Federal Global! Sou sua assistente virtual. Como posso ajudá-lo hoje?", sender: 'bot', timestamp: new Date() }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [chatSessionId, setChatSessionId] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message')
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setShowEmailModal(false)
      } else {
        alert(data.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro de conexão. Tente novamente.')
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Adicionar mensagem do usuário
    const userMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])

    const currentMessage = newMessage
    setNewMessage('')

    try {
      // Enviar para API do chatbot
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage,
          sessionId: chatSessionId
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Atualizar session ID se necessário
        if (data.sessionId && !chatSessionId) {
          setChatSessionId(data.sessionId)
        }

        // Adicionar resposta da IA
        const botResponse = {
          id: chatMessages.length + 2,
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, botResponse])
      } else {
        // Resposta de erro
        const errorResponse = {
          id: chatMessages.length + 2,
          text: "Desculpe, ocorreu um erro. Nossa equipe foi notificada e retornará em breve.",
          sender: 'bot',
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, errorResponse])
      }
    } catch (error) {
      console.error('Erro no chat:', error)
      const errorResponse = {
        id: chatMessages.length + 2,
        text: "Erro de conexão. Por favor, tente novamente.",
        sender: 'bot',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorResponse])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Federal Global</h1>
                <p className="text-blue-300 text-sm">by DeltaFox</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                LOGIN
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2 border border-blue-500 text-blue-300 hover:bg-blue-500/10 rounded-lg font-semibold transition-colors"
              >
                CADASTRE-SE
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            SUPORTE, SEGURANÇA,<br />
            TRANQUILIDADE<br />
            E TRANSPARÊNCIA
          </h2>
          <div className="text-sm text-green-300 bg-green-900/20 inline-block px-4 py-2 rounded-full mb-8">
            🌐 Acessando via: federalglobal.deltafoxconsult.com.br
          </div>
          
          {/* Botão SAIBA MAIS */}
          <div className="mt-8">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📋 SAIBA MAIS
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              🚀 Portal Federal Global - Nossos Serviços
            </h3>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto">
              Venha conhecer nossos serviços de soluções de inteligência e monitoramento de mais alto nível
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h4 className="text-lg font-bold text-blue-300 mb-3">ANÁLISE DOCUMENTAL PARA VALIDAÇÃO DE DADOS</h4>
              <p className="text-blue-200 text-sm">Nossa IA verifica e valida documentos garantindo conformidade total.</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💎</span>
              </div>
              <h4 className="text-lg font-bold text-blue-300 mb-3">MONITORAMENTO HUMANIZADO</h4>
              <p className="text-blue-200 text-sm">Inteligência artificial com suporte humano para monitoramento completo.</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h4 className="text-lg font-bold text-blue-300 mb-3">ASSESSORIA E RELATÓRIOS INTELIGENTES</h4>
              <p className="text-blue-200 text-sm">IA orientada para processos de inteligência e relatórios automáticos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Entre em Contato</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/federalexpresstrad/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@federalexpresstrad</span>
            </a>

            {/* Email */}
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contato@deltafoxconsult.com.br</span>
            </button>

            {/* WhatsApp Chatbot */}
            <button
              onClick={() => setShowChatbot(true)}
              className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.506z"/>
              </svg>
              <span>Chatbot de Atendimento</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-blue-500/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300">
                <span className="font-semibold">DESENVOLVIDO POR:</span><br />
                DeltaFox Consultoria
              </p>
              <p className="text-blue-200 text-sm mt-2">
                contato@deltafoxconsult.com.br
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-300 font-semibold">Federal Global</p>
              <p className="text-blue-200 text-sm">Sistema de Inteligência Avançada</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-300">Entre em Contato</h2>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-blue-200 mb-2">Nome</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full p-3 bg-black/40 border border-blue-500/30 rounded text-white"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-blue-200 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full p-3 bg-black/40 border border-blue-500/30 rounded text-white"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-200 mb-2">Mensagem</label>
                <textarea 
                  name="message"
                  className="w-full p-3 bg-black/40 border border-blue-500/30 rounded text-white h-24"
                  placeholder="Sua mensagem..."
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-sm rounded-xl border border-green-500/20 max-w-md w-full h-96 flex flex-col">
            {/* Header do Chat */}
            <div className="flex justify-between items-center p-4 border-b border-green-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="text-green-300 font-bold">Assistente Federal Global</h3>
                  <p className="text-green-200 text-xs">Online agora</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatbot(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-green-200'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input de Mensagem */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-green-500/20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 bg-black/40 border border-green-500/30 rounded text-white text-sm"
                  placeholder="Digite sua mensagem..."
                />
                <button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}