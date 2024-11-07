import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from '../controllers/index.js';
import nodemailer  from 'nodemailer';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    // Configuração do transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Altere conforme o serviço de e-mail que estiver usando
      auth: {
        user: 'studentcoin59@gmail.com', // Seu e-mail
        pass: 'ftgd yqzi dgrj cpkv' // Sua senha ou senha de app
      }
    });
  
    // Configuração das opções do e-mail
    const mailOptions = {
      from: 'studentcoin59@gmail.com',
      to,
      subject,
      text,
    };
  
    try {
      // Envia o e-mail
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).json({ error: 'Erro ao enviar e-mail' });
    }
  });




export default router;