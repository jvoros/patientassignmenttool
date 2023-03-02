
// https://aaryanadil.com/pass-socket-io-to-express-routes-in-files/
// to add socket io here


// Maps the state functions in store.js to api routes
// Hitting the route modifies the state,
// then returns complete state

// custom store
const store = require('./store.js');

// express
const express = require('express');
const api = express.Router();

//routes
api.get('/', (req, res) => {
    newState = { state: store.get() };
    req.io.emit("new state", newState);
    res.json(newState);
});

api.post('/logindoctor/:name', (req, res) => {
    res.json({
        state: store.loginDoctor(req.params.name)
    });
});

api.post('/logoutdoctor/:id', (req, res) => {
    res.json({
        state: store.logoutDoctor(req.params.id)
    });
});

api.post('/move/:updown/:i', (req, res) => {
    if (req.params.updown == 'up') {
        res.json({
            state: store.moveUp(req.params.i)
        });
    } else {
        res.json({
            state: store.moveDown(req.params.i)
        });
    }

});

api.post('/assignpatient', (req, res) => {
    res.json({
        state: store.assignPatient()
    });
});

module.exports = api;
