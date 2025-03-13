import express from "express";
import router from './routes/api.ts';
import bodyParser from "body-parser";
import db from "./utils/database.ts";

async function connectToDatabase() {
  try {
    const connection = await db();
    console.log(connection);
  }
  catch (error) {
    console.error("Database connection error:", error);
  }
}

const app = express();
app.use(bodyParser.json());
const port = 3000;

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use('/api', router);


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

connectToDatabase()

export default app;