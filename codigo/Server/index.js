import express from 'express';

import alunoRouter from './Routers/alunoRouter.js'

const app = express();
const PORT = process.env.PORT || 3001;
app.use('/alunos', alunoRouter);

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});


// ...