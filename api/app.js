require('dotenv').config();
const express = require("express");
const logger = require("morgan");

const mongoose = require("mongoose");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
    next();
})


require('./config/db.config');

/* API Routes Configuration */
const routes = require('./config/routes.config.js');
app.use('/api/v1/', routes);

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;