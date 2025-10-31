'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SecurityProtectionProps {
  children: React.ReactNode
  enableInactivityTimeout?: boolean
  timeoutMinutes?: number
}

export default function SecurityProtection({ 
  children, 
  enableInactivityTimeout = true,
  timeoutMinutes = 15 
}: SecurityProtectionProps) {
  const router = useRouter()

  useEffect(() => {
    // 🛡️ PROTEÇÃO ANTI-SCREENSHOT E COPY/PASTE
    const preventScreenshot = (e: KeyboardEvent) => {
      // Prevent print screen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        alert('🛡️ FEDERAL GLOBAL: Captura de tela não permitida por questões de segurança')
        return false
      }

      // Prevent F12, Ctrl+Shift+I, Ctrl+U (DevTools)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J')
      ) {
        e.preventDefault()
        alert('🛡️ FEDERAL GLOBAL: Acesso às ferramentas de desenvolvedor não permitido por questões de segurança')
        return false
      }

      // Prevent Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X (Copy/Paste/Select All)
      if (e.ctrlKey && ['a', 'c', 'v', 'x', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        alert('🛡️ FEDERAL GLOBAL: Operações de copiar/colar/selecionar não permitidas por questões de segurança')
        return false
      }

      // Prevent Shift+F10 (context menu)
      if (e.shiftKey && e.key === 'F10') {
        e.preventDefault()
        return false
      }
    }

    // 🛡️ PROTEÇÃO ANTI-CLIQUE DIREITO
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault()
      alert('🛡️ FEDERAL GLOBAL: Clique direito desabilitado por questões de segurança')
      return false
    }

    // 🛡️ PROTEÇÃO ANTI-DRAG & DROP
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // 🛡️ PROTEÇÃO ANTI-SELEÇÃO
    const preventSelection = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 🛡️ PROTEÇÃO CONTRA ABERTURA DE NOVA ABA/JANELA
    const preventNewWindow = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 🛡️ DETECTAR ABERTURA DE DEVTOOLS
    const detectDevTools = () => {
      const threshold = 160
      const widthDiff = window.outerWidth - window.innerWidth > threshold
      const heightDiff = window.outerHeight - window.innerHeight > threshold
      
      if (widthDiff || heightDiff) {
        alert('🛡️ FEDERAL GLOBAL: Ferramentas de desenvolvedor detectadas! Por questões de segurança, você será redirecionado.')
        window.location.href = '/login'
      }
    }

    // 🛡️ DETECTAR MUDANÇA DE FOCO (possível screenshot)
    const detectFocusChange = () => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          console.warn('🛡️ FEDERAL GLOBAL: Mudança de foco detectada - possível tentativa de screenshot')
        }
      })
    }

    // Adicionar event listeners
    document.addEventListener('keydown', preventScreenshot, true)
    document.addEventListener('contextmenu', preventRightClick, true)
    document.addEventListener('dragstart', preventDragDrop, true)
    document.addEventListener('drop', preventDragDrop, true)
    document.addEventListener('selectstart', preventSelection, true)
    document.addEventListener('mousedown', preventSelection, true)
    window.addEventListener('beforeunload', preventNewWindow, true)

    // Detectar DevTools periodicamente
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Detectar mudanças de foco
    detectFocusChange()

    // 🛡️ APLICAR CSS PROTECTION
    const originalUserSelect = document.body.style.userSelect
    const originalWebkitUserSelect = document.body.style.webkitUserSelect

    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    
    // Aplicar via setAttribute para propriedades vendor-specific
    document.body.setAttribute('style', `${document.body.getAttribute('style') || ''}; -moz-user-select: none; -ms-user-select: none;`)

    // Adicionar CSS dinâmico para proteção
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Permitir seleção apenas em inputs e textareas */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Prevenir highlight de texto */
      ::selection {
        background: transparent !important;
      }
      
      ::-moz-selection {
        background: transparent !important;
      }
      
      /* Prevenir arrastar imagens */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        pointer-events: none !important;
      }
    `
    document.head.appendChild(styleElement)

    // 🕒 SISTEMA DE LOGOUT POR INATIVIDADE
    let inactivityTimer: NodeJS.Timeout

    const resetInactivityTimer = () => {
      if (!enableInactivityTimeout) return

      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        alert(`🕒 FEDERAL GLOBAL: Sessão expirada por inatividade de ${timeoutMinutes} minutos. Você será redirecionado para o login por questões de segurança.`)
        
        // Limpar dados de sessão
        localStorage.clear()
        sessionStorage.clear()
        
        // Limpar cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=")
          const name = eqPos > -1 ? c.substr(0, eqPos) : c
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        })
        
        // Redirecionar para login
        window.location.href = '/login'
      }, timeoutMinutes * 60 * 1000)
    }

    // Eventos que resetam o timer de inatividade
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'touchmove', 'click', 'keydown'
    ]

    if (enableInactivityTimeout) {
      activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true)
      })
      resetInactivityTimer() // Iniciar timer
    }

    // 🛡️ CLEANUP FUNCTION
    return () => {
      // Remover event listeners
      document.removeEventListener('keydown', preventScreenshot, true)
      document.removeEventListener('contextmenu', preventRightClick, true)
      document.removeEventListener('dragstart', preventDragDrop, true)
      document.removeEventListener('drop', preventDragDrop, true)
      document.removeEventListener('selectstart', preventSelection, true)
      document.removeEventListener('mousedown', preventSelection, true)
      window.removeEventListener('beforeunload', preventNewWindow, true)

      // Remover timer de inatividade
      clearTimeout(inactivityTimer)
      if (enableInactivityTimeout) {
        activityEvents.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer, true)
        })
      }

      // Limpar interval de detecção
      clearInterval(devToolsInterval)

      // Restaurar CSS original
      document.body.style.userSelect = originalUserSelect
      document.body.style.webkitUserSelect = originalWebkitUserSelect

      // Remover style element
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [router, enableInactivityTimeout, timeoutMinutes])

  return <>{children}</>
}