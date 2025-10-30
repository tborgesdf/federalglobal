import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Enviar email de boas-vindas
  static async sendWelcomeEmail(
    email: string, 
    fullName: string, 
    protocolNumber: string, 
    role: string
  ): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: email,
        subject: 'Bem-vindo ao Federal Global by DeltaFox',
        html: this.generateWelcomeEmailHTML(fullName, protocolNumber, role),
        text: this.generateWelcomeEmailText(fullName, protocolNumber, role)
      };

      await this.sendEmail(emailData);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      return false;
    }
  }

  // Enviar email genérico
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Federal Global by DeltaFox" <${process.env.SMTP_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  // Gerar HTML do email de boas-vindas
  private static generateWelcomeEmailHTML(
    fullName: string, 
    protocolNumber: string, 
    role: string
  ): string {
    const roleNames = {
      'SUPER_ADMIN': 'Super Administrador',
      'ADMIN': 'Administrador',
      'USER': 'Usuário'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bem-vindo ao Federal Global</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #228B22 0%, #1E40AF 100%); color: white; padding: 30px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .content { padding: 30px; }
          .welcome { font-size: 24px; color: #228B22; margin-bottom: 20px; }
          .protocol { background: #f8f9fa; border-left: 4px solid #228B22; padding: 15px; margin: 20px 0; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Federal Global</div>
            <div>by DeltaFox Consultoria</div>
          </div>
          
          <div class="content">
            <h2 class="welcome">Bem-vindo, ${fullName}!</h2>
            
            <p>É um prazer tê-lo(a) em nossa plataforma de inteligência e contrainteligência empresarial.</p>
            
            <div class="protocol">
              <strong>Seus dados de acesso:</strong><br>
              <strong>Número de Protocolo:</strong> ${protocolNumber}<br>
              <strong>Nível de Acesso:</strong> ${roleNames[role as keyof typeof roleNames] || role}
            </div>
            
            <p>Sua conta foi criada com sucesso e você já pode acessar o sistema Federal Global.</p>
            
            <p><strong>Próximos passos:</strong></p>
            <ul>
              <li>Acesse o sistema com seu CPF e senha</li>
              <li>Complete seu perfil se necessário</li>
              <li>Explore as funcionalidades disponíveis</li>
            </ul>
            
            <p>Em caso de dúvidas, entre em contato conosco.</p>
          </div>
          
          <div class="footer">
            © Desenvolvido por DeltaFox Consultoria<br>
            Federal Global - Protegendo o futuro das empresas
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Gerar texto do email de boas-vindas
  private static generateWelcomeEmailText(
    fullName: string, 
    protocolNumber: string, 
    role: string
  ): string {
    return `
Bem-vindo ao Federal Global by DeltaFox!

Olá, ${fullName}!

É um prazer tê-lo(a) em nossa plataforma de inteligência e contrainteligência empresarial.

Seus dados de acesso:
- Número de Protocolo: ${protocolNumber}
- Nível de Acesso: ${role}

Sua conta foi criada com sucesso e você já pode acessar o sistema Federal Global.

Próximos passos:
- Acesse o sistema com seu CPF e senha
- Complete seu perfil se necessário
- Explore as funcionalidades disponíveis

Em caso de dúvidas, entre em contato conosco.

© Desenvolvido por DeltaFox Consultoria
Federal Global - Protegendo o futuro das empresas
    `;
  }
}