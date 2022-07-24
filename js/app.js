const express = require('express');
const router = require('../API/routes');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require('cors')
app.use(express.json())
app.use('/api', cors(), router);
module.exports = app;