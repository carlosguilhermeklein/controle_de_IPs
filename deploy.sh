#!/bin/bash

# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js e npm (se ainda não estiverem instalados)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente para gerenciamento de processos
sudo npm install -y pm2 -g

# Criar diretório da aplicação
sudo mkdir -p /var/www/ip-manager
sudo chown -R $USER:$USER /var/www/ip-manager

# Copiar arquivos da aplicação
# (Substitua /caminho/para/sua/aplicacao pelo caminho real dos arquivos)
cp -r * /var/www/ip-manager/

# Entrar no diretório da aplicação
cd /var/www/ip-manager

# Instalar dependências
npm install

# Construir a aplicação
npm run build

# Iniciar o servidor com PM2
pm2 start server.js --name "ip-manager"

# Configurar PM2 para iniciar automaticamente
pm2 startup
pm2 save

# Criar arquivo de configuração do Nginx
sudo tee /etc/nginx/sites-available/ip-manager << EOF
server {
    listen 80;
    server_name seu-dominio.com;  # Substitua pelo seu domínio

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

# Ativar o site
sudo ln -s /etc/nginx/sites-available/ip-manager /etc/nginx/sites-enabled/

# Verificar configuração do Nginx
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx