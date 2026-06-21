import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rotas from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/vida', (req, res) => res.json({ status: 'ok' }));
app.use('/api', rotas);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});