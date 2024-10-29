import express from 'express';

import alunoRouter from './Routers/alunoRouter.js'
import instituicaoRouter from './Routers/instituicaoRouter.js'
import cursoRouter from './Routers/courseRouter.js'
import enderecoRouter from './Routers/enderecoRouter.js'
import empresaRouter from './Routers/empresaRouter.js'
import vantagemRouter from './Routers/vantagensRouter.js'

const app = express();
const PORT = process.env.PORT || 3001;
app.use('/alunos', alunoRouter);
app.use('/instituicao', instituicaoRouter);
app.use('/cursos', cursoRouter);
app.use('/endereco', enderecoRouter)
app.use('/empresas', empresaRouter)
app.use('/vantagem', vantagemRouter)

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});


// ...