// Tipos globais para suprimir erros TypeScript
declare global {
  interface Window {
    [key: string]: any
  }
}

// Tipos para objetos dinâmicos
export interface DynamicObject {
  [key: string]: any
}

// Tipos para usuários dinâmicos
export interface DynamicUser {
  [key: string]: any
  id: string
  name: string
  email: string
}

export {}