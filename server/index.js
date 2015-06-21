'use strict';

const express     = require('express');
const mongoose    = require('mongoose');
const morgan      = require('morgan');
const path        = require('path');

const app         = express();
const database    = require('./config/db')
const port        = process.env.PORT || 5000;

mongoose.connect(database.uri);

app.use(morgan('dev'));
app.set('publicDir', path.join(__dirname, '../client'));

require('./routes')(app);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
