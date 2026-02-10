require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/utils/db');
require('./src/services/manukatoWatcher');

const PORT = process.env.PORT || 5000;

// Test DB Connection
testConnection();

app.listen(PORT, () => {
  // Log the clickable local URL as requested
  console.log(`\n🏹 Twostones Server Ignited`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Health: http://localhost:${PORT}/api/health\n`);
});
