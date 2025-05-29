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
pm2 serve dist 3000 --name "ip-manager"
pm2 save
pm2 startup

# Criar arquivo de configuração do Nginx
sudo tee /etc/nginx/sites-available/ip-manager > /dev/null << EOF
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Ativar site no Nginx
sudo ln -sf /etc/nginx/sites-available/ip-manager /etc/nginx/sites-enabled/ip-manager

# Verificar e reiniciar Nginx
sudo nginx -t && sudo systemctl reload nginx
