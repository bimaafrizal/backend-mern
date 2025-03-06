import express from 'express';
import dumyController from '../controllers/dummy.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, world!');
});

router.get('/dumy', dumyController.dumy);


export default router;