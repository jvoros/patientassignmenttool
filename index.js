// setup express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// for socket.io
const http = require('http');
const { Server, } = require("socket.io");

// api routes
const api = require('./api.js');

//build app with socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.io = io;
    return next();
});

// routes
app.use(express.static('public'));
app.use('/api', api);

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});