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
      const queryResult = await connection.query('SELECT * FROM curso');
      res.json(queryResult.rows);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error');
    }
  });






export default router;
