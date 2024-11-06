import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));



//POST de resgate
router.post('/', async (req, res) => {
    const { aluno, vantagem, data, valor, cupom } = req.body;
    console.log(req.body)

    try {
        const queryResult = await connection.query('INSERT INTO resgate (aluno, vantagem, data, valor, cupom) VALUES ($1, $2, $3, $4, $5)', [aluno, vantagem, data, valor, cupom]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});


router.get('/get/:id', async (req, res) => {
    const { id } = req.params

    try {
        const queryResult = await connection.query(`SELECT
    r.id AS vantagem_id,
    r.aluno AS vantagem_aluno,
    r.cupom AS vantagem_cupom,
    r.valor AS vantagem_valor,
    r.data AS vantagem_data,
    v.nome AS vantagem_nome,
    v.descricao AS vantagem_desc,
    e.nome AS vantagem_nomeEmpresa
FROM 
    resgate r
JOIN 
    vantagem v ON r.vantagem = v.id
JOIN 
    empresa e ON v.empresa = e.id
WHERE 
    r.aluno = $1`, [id])
        res.json(queryResult.rows)
    } catch (error) {
        console.log("o erro foi:", error)
    }
})



export default router;
