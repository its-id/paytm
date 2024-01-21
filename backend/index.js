import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// {
//   origin: "http://localhost:3000", // restrict calls to those this address
//   methods: "GET" // only allow GET requests
// }

app.use('/api/v1', router);

app.use((err, req, res, next) => {
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
