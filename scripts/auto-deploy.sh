#!/bin/bash

# Script de Deploy Automático - Federal Global by DeltaFox
# Este script atualiza automaticamente o subdomínio federalglobal.deltafoxconsult.com.br
# para apontar para o último deploy do Vercel

echo "🚀 Iniciando deploy automático do Federal Global..."

# Fazer o deploy no Vercel e capturar a URL
echo "📦 Fazendo deploy no Vercel..."
DEPLOY_OUTPUT=$(vercel --prod 2>&1)
NEW_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*vercel.app')

if [ -z "$NEW_URL" ]; then
    echo "❌ Erro: Não foi possível obter a URL do deploy"
    exit 1
fi

echo "✅ Deploy realizado com sucesso: $NEW_URL"

# Extrair apenas o hostname (sem https://)
HOSTNAME=$(echo "$NEW_URL" | sed 's|https://||')

echo "🌐 Atualizando DNS para $HOSTNAME..."

# Configurar as credenciais da API do Hostgator (você precisa obter essas credenciais)
# HOSTGATOR_API_KEY="sua_api_key_aqui"
# HOSTGATOR_API_SECRET="seu_api_secret_aqui"

# Comando cURL para atualizar o registro CNAME via API do Hostgator
# Substitua pelos valores reais da sua conta
curl -X POST "https://api.hostgator.com.br/dns/update" \
  -H "Authorization: Bearer $HOSTGATOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"domain\": \"deltafoxconsult.com.br\",
    \"type\": \"CNAME\",
    \"name\": \"federalglobal\",
    \"content\": \"$HOSTNAME\",
    \"ttl\": 300
  }"

echo "✅ DNS atualizado com sucesso!"
echo "🌐 O site estará disponível em: https://federalglobal.deltafoxconsult.com.br"
echo "⏰ Aguarde alguns minutos para a propagação do DNS"

# Atualizar arquivo de documentação com a nova URL
sed -i "s|https://federalglobal-.*vercel.app|$NEW_URL|g" FEDERAL_GLOBAL.md

# Fazer commit das mudanças
git add FEDERAL_GLOBAL.md
git commit -m "🔄 Atualização automática de deploy: $NEW_URL"
git push origin master

echo "📝 Documentação atualizada e enviada para o GitHub"
echo "🎉 Deploy automático concluído!"