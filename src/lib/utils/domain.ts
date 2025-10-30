/**
 * Utilitário para detecção automática de contexto baseado no domínio
 * Diferencia automaticamente entre admin e cliente
 */

export type DomainType = 'admin' | 'client' | 'development';

export interface DomainContext {
  type: DomainType;
  hostname: string;
  isAdmin: boolean;
  isClient: boolean;
  isDevelopment: boolean;
  baseUrl: string;
  apiPrefix: string;
}

/**
 * Detecta o tipo de domínio baseado no hostname
 */
export function detectDomainType(hostname?: string): DomainType {
  if (typeof window === 'undefined' && !hostname) {
    return 'development';
  }
  
  const host = hostname || window.location.hostname;
  
  // Verifica se é domínio administrativo
  if (host.includes('admin.federalglobal') || 
      host.includes('admin-federalglobal')) {
    return 'admin';
  }
  
  // Verifica se é domínio cliente
  if (host.includes('federalglobal') && !host.includes('admin')) {
    return 'client';
  }
  
  // Desenvolvimento local ou outros casos
  return 'development';
}

/**
 * Obtém o contexto completo do domínio
 */
export function getDomainContext(hostname?: string): DomainContext {
  const type = detectDomainType(hostname);
  const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  
  return {
    type,
    hostname: host,
    isAdmin: type === 'admin',
    isClient: type === 'client',
    isDevelopment: type === 'development',
    baseUrl: getBaseUrl(type, host),
    apiPrefix: getApiPrefix(type)
  };
}

/**
 * Obtém a URL base baseada no tipo de domínio
 */
export function getBaseUrl(type: DomainType, hostname: string): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }
  
  const protocol = window.location.protocol;
  
  switch (type) {
    case 'admin':
      return hostname.includes('localhost') 
        ? `${protocol}//localhost:3000` 
        : `${protocol}//admin.federalglobal.deltafoxconsult.com.br`;
    
    case 'client':
      return hostname.includes('localhost') 
        ? `${protocol}//localhost:3000` 
        : `${protocol}//federalglobal.deltafoxconsult.com.br`;
    
    default:
      return `${protocol}//${hostname}`;
  }
}

/**
 * Obtém o prefixo da API baseado no tipo de domínio
 */
export function getApiPrefix(type: DomainType): string {
  switch (type) {
    case 'admin':
      return '/api/admin';
    case 'client':
      return '/api/client';
    default:
      return '/api';
  }
}

/**
 * Redireciona para o domínio correto baseado no contexto
 */
export function redirectToDomain(targetType: DomainType, path: string = '/') {
  if (typeof window === 'undefined') return;
  
  const context = getDomainContext();
  
  // Se já está no domínio correto, não redireciona
  if (context.type === targetType) return;
  
  let targetUrl: string;
  
  switch (targetType) {
    case 'admin':
      targetUrl = context.isDevelopment 
        ? `${window.location.origin}/admin${path}`
        : `https://admin.federalglobal.deltafoxconsult.com.br${path}`;
      break;
    
    case 'client':
      targetUrl = context.isDevelopment 
        ? `${window.location.origin}/client${path}`
        : `https://federalglobal.deltafoxconsult.com.br${path}`;
      break;
    
    default:
      return;
  }
  
  window.location.href = targetUrl;
}

/**
 * Hook React para usar o contexto de domínio
 */
export function useDomainContext(): DomainContext {
  if (typeof window === 'undefined') {
    return {
      type: 'development',
      hostname: 'localhost',
      isAdmin: false,
      isClient: false,
      isDevelopment: true,
      baseUrl: 'http://localhost:3000',
      apiPrefix: '/api'
    };
  }
  
  return getDomainContext();
}

/**
 * Utilitário para construir URLs baseadas no contexto
 */
export function buildUrl(path: string, type?: DomainType): string {
  const context = getDomainContext();
  const targetType = type || context.type;
  
  const baseUrl = getBaseUrl(targetType, context.hostname);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}

/**
 * Utilitário para construir URLs de API baseadas no contexto
 */
export function buildApiUrl(endpoint: string, type?: DomainType): string {
  const context = getDomainContext();
  const targetType = type || context.type;
  
  const apiPrefix = getApiPrefix(targetType);
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return buildUrl(`${apiPrefix}${cleanEndpoint}`, targetType);
}

/**
 * Middleware para validação de acesso baseado no domínio
 */
export function validateDomainAccess(requiredType: DomainType): boolean {
  const context = getDomainContext();
  
  // Em desenvolvimento, permite acesso a tudo
  if (context.isDevelopment) return true;
  
  // Valida se o tipo de domínio corresponde ao requerido
  return context.type === requiredType;
}

/**
 * Configurações específicas por tipo de domínio
 */
export const DOMAIN_CONFIG = {
  admin: {
    title: 'Federal Global - Painel Administrativo',
    description: 'Sistema de inteligência Federal Global - Área Administrativa',
    theme: 'dark',
    layout: 'dashboard',
    features: ['analytics', 'user-management', 'logs', 'settings'],
    redirectPath: '/admin'
  },
  client: {
    title: 'Federal Global - Portal do Cliente',
    description: 'Sistema de inteligência Federal Global - Área do Cliente',
    theme: 'gradient',
    layout: 'landing',
    features: ['public-info', 'login', 'services'],
    redirectPath: '/client'
  },
  development: {
    title: 'Federal Global - Desenvolvimento',
    description: 'Ambiente de desenvolvimento',
    theme: 'debug',
    layout: 'flexible',
    features: ['all'],
    redirectPath: '/'
  }
} as const;

/**
 * Obtém configuração específica do domínio
 */
export function getDomainConfig(type?: DomainType) {
  const context = getDomainContext();
  const targetType = type || context.type;
  
  return DOMAIN_CONFIG[targetType];
}