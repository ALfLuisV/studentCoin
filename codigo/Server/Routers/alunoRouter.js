import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/all', async (req, res) => {
    try {
        const queryResult = await connection.query('SELECT * FROM aluno');
        res.json(queryResult.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//POST
router.post('/', async (req, res) => {
    const {
        CPF, nome, email, RG, endereco, instituicao, curso, moedas
    } = req.body;

    try {
        const queryResult = await connection.query('INSERT INTO aluno ("CPF", nome, email, "RG", endereco, instituicao, curso, moedas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [CPF, nome, email, RG, endereco, instituicao, curso, moedas]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});




export default router;
