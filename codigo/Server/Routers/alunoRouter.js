import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

//get para pegar a lista de alunos
router.get('/all', async (req, res) => {
    try {
        const queryResult = await connection.query('SELECT * FROM aluno');
        res.json(queryResult.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//POST de aluno
router.post('/', async (req, res) => {
    const {
        CPF, nome, email, RG, endereco, instituicao, curso, moedas
    } = req.body;

    try {
        const queryResult = await connection.query('INSERT INTO aluno (cpf, nome, email, rg, endereco, instituicao, curso, moedas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [CPF, nome, email, RG, endereco, instituicao, curso, moedas]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//POST de aluno
router.put('/insert/:id', async (req, res) => {
    const {
        value
    } = req.body;

    const idAluno = req.params
    try {
        const queryResult = await connection.query('UPDATE aluno SET moedas = moedas + $1 WHERE cpf = $2', [value, idAluno.id]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//POST de aluno
router.put('/reduce/:id', async (req, res) => {
    const {
        value
    } = req.body;

    const idAluno = req.params
    try {
        const queryResult = await connection.query('UPDATE aluno SET moedas = moedas - $1 WHERE cpf = $2', [value, idAluno.id]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//get de aluno especifico
router.get('/get/:id', async (req, res) =>{
    const studentId = req.params

    try {
        const studentInfo = await connection.query('SELECT cpf, nome, email, rg, moedas FROM aluno WHERE cpf = $1', [parseInt(studentId.id, 10)])
        res.json(studentInfo.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
})






export default router;
