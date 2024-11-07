import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));




//POST de empresas
router.post('/', async (req, res) => {
    const {
        prof, aluno, valor, date, desc
    } = req.body;

    try {
        const queryResult = await connection.query('INSERT INTO transacao (professor, aluno, valor, data, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING id', [prof, aluno, valor, date, desc]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});


//get para o historico de transação dos professores
router.get('/professores/:id', async (req, res) => {
    const  idProf  = req.params


    try {
        const queryResult = await connection.query(`SELECT 
    t.id AS transacao_id,
    p.nome AS professor_nome,
    a.nome AS aluno_nome,
    t.valor,
    t.data,
    t.descricao
FROM 
    transacao t
JOIN 
    professor p ON t.professor = p.id
JOIN 
    aluno a ON t.aluno = a.cpf 
WHERE 
    p.id = $1;`,[parseInt(idProf.id, 10)]);
        res.json(queryResult.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});





export default router;
