import app from './app.js';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`filedrop-api is running on http://localhost:${PORT}`);
  });
};

startServer();
