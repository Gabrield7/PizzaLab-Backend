import express from 'express';
import routes from './routes/index.js';
import { authErros } from './middlewares/authErros.js';

const app = express();

app.use(express.json());

app.use(routes);

app.use(authErros)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});



