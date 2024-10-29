import express from 'express';

import alunoRouter from './Routers/alunoRouter.js'
import instituicaoRouter from './Routers/instituicaoRouter.js'
import cursoRouter from './Routers/courseRouter.js'
import enderecoRouter from './Routers/enderecoRouter.js'

const app = express();
const PORT = process.env.PORT || 3001;
app.use('/alunos', alunoRouter);
app.use('/instituicao', instituicaoRouter);
app.use('/cursos', cursoRouter);
app.use('/endereco', enderecoRouter)

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});


// ...