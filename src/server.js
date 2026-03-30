import express from 'express';
import 'dotenv/config';
import quartosRoutes from './routes/quartosRoutes'

import pdfRoute from './routes/pdfRoutes.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas

app.use('/quartos', quartosRoutes)


app.use('/alunos', pdfRoute);


app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
