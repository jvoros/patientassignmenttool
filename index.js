import * as dotenv from 'dotenv';
dotenv.config();
// setup express
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import path from 'path';
import basicAuth from 'express-basic-auth';
import cookieSession from 'cookie-session';
import { Server } from "socket.io";

// passport setup
import passport from './src/passport.js';
import mw from './src/middleware.js'

// api routes
import api from './src/api.js';

// initialize app, ejs, and socket.io
const app = express();
app.set('view engine', 'ejs');
const server = http.createServer(app);
const io = new Server(server);

// custom middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
}

// load middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// passes io object to routers
app.use((req, res, next) => {
    res.io = io;
    return next();
});

// cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['key1key1', 'key2key2'],
  
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth', passport.authenticate('google', { hd: 'carepointhc.com', prompt: 'select_account', scope: ['profile', 'email'] }));
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/account/google', passport.authenticate('google', { failureRedirect: '/auth/error' }),
  function(req, res) {
    res.redirect('/doctor');
  }
);

// routes
app.use(express.static('public'));

// const ROOT_PATH = new URL(path.dirname(import.meta.url)).pathname;
// app.get('/', (req, res) => {
//     res.sendFile(ROOT_PATH + '/index.html')
// })

app.get('/', (req, res) => {
    res.json( req.user );
});

app.get('/testauth', (req, res) => {
    res.json('failure' );
    // res.render('login');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/triage',
    failureRedirect: '/testauth'
  }));

// behind authentication
app.use(ensureAuthenticated);
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.use('/api', api);

app.get('/doctor', (req, res) => {
    res.render('board', { role: 'user', user: req.user.displayName });
});

app.get('/triage', (req, res) => {
    res.render('board', { role: 'admin', user: req.user.displayName });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});
