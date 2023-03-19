import express from 'express';
import State from './state.js';


// try {

// } catch (error) {
//     next(error);
// } 

let state;

const api = express.Router();

api.get('/', async (req, res, next) => {
    try {
        state = await State.initialize();
        res.send(true);
        res.io.emit('new state', state);
    } catch (error) {
        next(error)
    }
});

api.post('/join/:id/shift/:shift/pointer/:pointer', async (req, res, next) => {  
    try {
        await state.joinRotation(req.params.id, req.params.shift, req.params.pointer);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/gooffrotation/:id/:status', async (req, res, next) => {
    try {
        await state.goOffRotation(req.params.id, req.params.status);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    }   
});

api.post('/rejoin/:id', async (req, res, next) => {
    try {
        await state.rejoin(req.params.id);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/move/:dir/:index', async (req, res, next) => {
    try {
        await state.moveRotation(req.params.dir, req.params.index);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/assignpatient/:initials?', async (req, res, next) => {
    try {
        const initials = req.params.initials ? req.params.initials : 'Anon';
        await state.assignPatient(initials);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/undolastassign', async (req, res, next) => {
    try {
        await state.undoLastAssign();
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    }
});

api.post('/increment/:type/shift/:shift_id', async (req, res, next) => {
    try {
        await state.increment(req.params.shift_id, req.params.type);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/decrement/:type/shift/:shift_id', async (req, res, next) => {
    try {
        await state.decrement(req.params.shift_id, req.params.type);
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/skip', (req, res, next) => {
    state.skip();
    res.io.emit('new state', state);
});

api.post('/goback', (req, res) => {
    state.goback();
    res.io.emit('new state', state);
})

api.post('/changeshiftdetails/:start_id/:shift_id', async (req,res, next) => {
    try {
        await state.changeShiftDetails(req.params.start_id, req.params.shift_id)
        res.io.emit('new state', state);
    } catch (error) {
        next(error);
    } 
});

api.post('/resetboard', async (req, res, next) => {
    try {
        await state.resetBoard();
        state.resetTimeline();
        res.send(true);
        res.io.emit('new state', state);
    } catch(error) {
        next(error);
    }
});

api.post('/resettimeline', (req, res, next) => {
    state.resetTimeline();
    res.io.emit('new state', state);
})

export default api;
