import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const connected = await connectDb();
if (!connected) {
  console.warn(
    'Warning: MongoDB is offline. API is up for health checks; order/product writes need Atlas.'
  );
}

app.listen(env.port, () => {
  console.log(`Hautoria API running on http://localhost:${env.port}`);
});
