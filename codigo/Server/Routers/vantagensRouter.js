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
        const queryResult = await connection.query(`SELECT 
    v.id AS vantagem_id,
    v.nome AS vantagem_nome,
    v.descricao AS vantagem_descricao,
    v.valor AS vantagem_valor,
    v.foto AS vantagem_foto,
    e.nome AS empresa_nome
FROM 
    vantagem v
JOIN 
    empresa e ON v.empresa = e.id;
`);
        res.json(queryResult.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});

//POST de vantagens
router.post('/', async (req, res) => {
    const {
        id, ArrayVantagens
    } = req.body;

    let query = "INSERT INTO vantagem (nome, descricao, foto, valor, empresa) VALUES "
    let queryValues = ""
    let counter = 0

    for (const e of ArrayVantagens) {
        if (counter == ArrayVantagens.length - 1) {
            queryValues = "('" + e.nome + "','" + e.descricao + "'," + e.foto + "," + e.custo + "," + id + ");"
        } else {
            queryValues = "('" + e.nome + "','" + e.descricao + "'," + e.foto + "," + e.custo + "," + id + "),"
        }
        query += queryValues
        counter += 1
    }
    try {
        const queryResult = await connection.query(query);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});




export default router;
