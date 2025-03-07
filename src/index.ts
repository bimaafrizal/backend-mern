import express from "express";
import router from './routes/api.ts';

const app = express();
const port = 3000;

app.use('/api', router);


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});