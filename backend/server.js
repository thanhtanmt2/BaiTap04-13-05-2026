require('dotenv').config();
const app = require('./src/app');
const initializeDatabase = require('./src/config/initDb');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`✓ Server đang chạy trên http://localhost:${PORT}`);
  
  // Initialize Database after server starts
  await initializeDatabase();
});
