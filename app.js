const express = require('express');
const connectDB = require('./database');
const User = require('./user');
const routes = require('./routes');
const { generateToken, verifyToken } = require('./auth');

const app = express();
app.use(express.json());

connectDB();

app.use('/', routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
