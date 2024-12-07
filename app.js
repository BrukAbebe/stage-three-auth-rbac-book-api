const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const homeRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const errorConverter = require('./middlewares/errorConverter');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);


module.exports = app;