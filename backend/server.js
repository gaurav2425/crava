require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { connectDb } = require('./src/db');
const authRoutes = require('./src/routes/auth');

const port = Number(process.env.PORT) || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing.');
  }

  await connectDb(process.env.MONGODB_URI);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Calora API listening on http://localhost:${port}`);
    console.log(
      `Add this Google Web redirect URI: http://<your-lan-ip>:${port}/auth/google/callback`,
    );
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
