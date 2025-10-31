import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'federal_global_secret_2024';

export class SecurityUtils {
  // Criptografar dados sensíveis
  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  }

  // Descriptografar dados sensíveis
  static decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Hash de senha com bcrypt
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 12);
  }

  // Verificar senha com bcrypt
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Validar CPF
  static validateCPF(cpf: string): boolean {
    // Remove caracteres especiais
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }

  // Gerar número de protocolo único
  static generateProtocol(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FG${timestamp.slice(-6)}${random}`;
  }

  // Sanitizar dados para logs
  static sanitizeForLog(data: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = ['password', 'cpf', 'email', 'phone'];
    const sanitized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    });
    
    return sanitized;
  }
}