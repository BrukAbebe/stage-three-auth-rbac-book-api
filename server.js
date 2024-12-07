const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});