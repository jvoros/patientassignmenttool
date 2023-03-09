// setup express
import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { Server } from "socket.io";
const ROOT_PATH = new URL(path.dirname(import.meta.url)).pathname;

// api routes
import api from './src/api.js';

//build app with socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set the view engine to ejs
app.set('view engine', 'ejs');

// middleware
app.use(cors());
// passes io object to routers
app.use((req, res, next) => {
    res.io = io;
    return next();
});

// routes
app.use(express.static('public'));
// app.get('/', (req, res) => {
//     res.sendFile(ROOT_PATH + '/index.html')
// })
app.get('/triage', (req, res) => {
    res.render('board', {admin: true});
});

app.get('/doctors', (req, res) => {
    res.render('board');
});

app.use('/api', api);

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});
