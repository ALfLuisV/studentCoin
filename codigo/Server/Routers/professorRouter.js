import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));




//PUt de redução de moedas do envio
router.put('/send/:id', async (req, res) => {
    const {
        value
    } = req.body;

    const idProf = req.params
    try {
        const queryResult = await connection.query('UPDATE professor SET moedas = moedas - $1 WHERE id = $2', [value, parseInt(idProf.id, 10)]);
        res.json(queryResult.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error');
    }
});


router.get('/get/:id', async (req, res) =>{
    const idprof = req.params

    try {
        const profInfo = await connection.query('SELECT * FROM professor WHERE id = $1', [parseInt(idprof.id, 10)])
        res.json(profInfo.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
})





export default router;
