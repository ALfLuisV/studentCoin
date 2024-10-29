import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


//POST
router.post('/', async (req, res) => {
    const {
      rua, cidade, estado, pais
    } = req.body;
  
    try {
      const queryResult = await connection.query('INSERT INTO endereco (rua, cidade, estado, pais) VALUES ($1, $2, $3, $4) RETURNING id', [rua, cidade, estado, pais]);
      res.json(queryResult.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error');
    }
  });





export default router;