#!/bin/bash

# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js e npm (se ainda não estiverem instalados)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente para gerenciamento de processos
sudo npm install -g pm2

# Criar diretório da aplicação
sudo mkdir -p /var/www/ip-manager
sudo chown -R $USER:$USER /var/www/ip-manager

# Copiar arquivos da aplicação para o diretório de produção
cp -r * /var/www/ip-manager/

# Entrar no diretório da aplicação
cd /var/www/ip-manager

# Instalar dependências e build
npm install
npm run build

# Servir aplicação com PM2
pm2 start server.js --name "ip-manager"
pm2 save
pm2 startup

# Criar arquivo de configuração do Nginx
sudo tee /etc/nginx/sites-available/ip-manager > /dev/null << EOF
server {
    listen 80;
    server_name _;

    # Aumentar limite de upload se necessário
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Adicionar headers CORS
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        # Configurar CSP mais permissivo
        add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: data: blob: ws:;";
    }

    # Configuração para requisições OPTIONS (preflight CORS)
    location /api {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Remover configuração default do Nginx se existir
sudo rm -f /etc/nginx/sites-enabled/default

# Ativar site no Nginx
sudo ln -sf /etc/nginx/sites-available/ip-manager /etc/nginx/sites-enabled/

# Verificar e reiniciar Nginx
sudo nginx -t && sudo systemctl restart nginx

echo "Deployment completed! The application should be accessible via HTTP."