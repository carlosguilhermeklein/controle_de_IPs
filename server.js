import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuração CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend Vite
  credentials: true
}));

app.use(express.json());

// Configurar headers de segurança
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http://localhost:5173; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );
  next();
});

// Servir arquivos estáticos
app.use(express.static(join(__dirname, 'dist')));

// Funções auxiliares para manipulação de arquivos
const readJsonFile = async (filename) => {
  try {
    const data = await fs.readFile(join(__dirname, 'src', 'database', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

const writeJsonFile = async (filename, data) => {
  try {
    await fs.writeFile(
      join(__dirname, 'src', 'database', filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Rotas para subredes
app.get('/api/subnets', async (req, res) => {
  const data = await readJsonFile('subnets.json');
  if (data) {
    res.json(data.subnets);
  } else {
    res.status(500).json({ error: 'Erro ao ler subredes' });
  }
});

app.post('/api/subnets', async (req, res) => {
  const data = await readJsonFile('subnets.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler subredes' });
  }

  data.subnets.push(req.body);
  const success = await writeJsonFile('subnets.json', data);
  
  if (success) {
    res.json(req.body);
  } else {
    res.status(500).json({ error: 'Erro ao salvar subrede' });
  }
});

app.put('/api/subnets/:id', async (req, res) => {
  const data = await readJsonFile('subnets.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler subredes' });
  }

  const index = data.subnets.findIndex(subnet => subnet.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Subrede não encontrada' });
  }

  data.subnets[index] = { ...data.subnets[index], ...req.body };
  const success = await writeJsonFile('subnets.json', data);
  
  if (success) {
    res.json(data.subnets[index]);
  } else {
    res.status(500).json({ error: 'Erro ao atualizar subrede' });
  }
});

app.delete('/api/subnets/:id', async (req, res) => {
  const data = await readJsonFile('subnets.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler subredes' });
  }

  data.subnets = data.subnets.filter(subnet => subnet.id !== req.params.id);
  const success = await writeJsonFile('subnets.json', data);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Erro ao excluir subrede' });
  }
});

// Rotas para usuários
app.get('/api/users', async (req, res) => {
  const data = await readJsonFile('users.json');
  if (data) {
    res.json(data.users);
  } else {
    res.status(500).json({ error: 'Erro ao ler usuários' });
  }
});

app.post('/api/users', async (req, res) => {
  const data = await readJsonFile('users.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler usuários' });
  }

  data.users.push(req.body);
  const success = await writeJsonFile('users.json', data);
  
  if (success) {
    res.json(req.body);
  } else {
    res.status(500).json({ error: 'Erro ao salvar usuário' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const data = await readJsonFile('users.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler usuários' });
  }

  const index = data.users.findIndex(user => user.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  data.users[index] = { ...data.users[index], ...req.body };
  const success = await writeJsonFile('users.json', data);
  
  if (success) {
    res.json(data.users[index]);
  } else {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const data = await readJsonFile('users.json');
  if (!data) {
    return res.status(500).json({ error: 'Erro ao ler usuários' });
  }

  data.users = data.users.filter(user => user.id !== req.params.id);
  const success = await writeJsonFile('users.json', data);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

// Rota catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});