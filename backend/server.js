import app from './app.js';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`✅ filedrop-api is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1); // Optional: force exit with error code
  }
};

startServer();
