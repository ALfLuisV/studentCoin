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
        const queryResult = await connection.query('SELECT * FROM empresa');
        res.json(queryResult.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});



//POST de empresas
router.post('/', async (req, res) => {
    const {
        nome, CNPJ, email, senha
    } = req.body;

    try {
        const queryResult = await connection.query('INSERT INTO empresa (nome, "CNPJ", email, senha) VALUES ($1, $2, $3, $4) RETURNING id', [nome, CNPJ, email, senha]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});




export default router;
