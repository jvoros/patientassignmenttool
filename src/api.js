import express from 'express';
import State from './state.js';

let state;

const api = express.Router();

function responder(res) {
    // client browser needs a response to know transmission complete
    res.json({ message: 'success' });
    // state payload sent to client by socket.io
    res.io.emit('new state', state);
}

api.post('/', async (req, res, next) => {
    try {
        state = await State.initialize();
        responder(res);
    } catch (error) {
        next(error)
    }
});

api.post('/join/:id/shift/:shift/pointer/:pointer', async (req, res, next) => {  
    try {
        await state.joinRotation(req.params.id, req.params.shift, req.params.pointer);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/gooffrotation/:id/:status', async (req, res, next) => {
    try {
        await state.goOffRotation(req.params.id, req.params.status);
        responder(res);
    } catch (error) {
        next(error);
    }   
});

api.post('/rejoin/:id', async (req, res, next) => {
    try {
        await state.rejoin(req.params.id);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/move/:dir/:index', async (req, res, next) => {
    try {
        await state.moveRotation(req.params.dir, req.params.index);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/assignpatient/:initials?', async (req, res, next) => {
    try {
        const initials = req.params.initials ? req.params.initials : 'Anon';
        await state.assignPatient(initials);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/undolastassign', async (req, res, next) => {
    try {
        await state.undoLastAssign();
        responder(res);
    } catch (error) {
        next(error);
    }
});

api.post('/increment/:type/shift/:shift_id', async (req, res, next) => {
    try {
        await state.increment(req.params.shift_id, req.params.type);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/decrement/:type/shift/:shift_id', async (req, res, next) => {
    try {
        await state.decrement(req.params.shift_id, req.params.type);
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/skip', (req, res, next) => {
    state.skip();
    responder(res);
});

api.post('/goback', (req, res) => {
    state.goback();
    responder(res);
})

api.post('/changeshiftdetails/:start_id/:shift_id', async (req,res, next) => {
    try {
        await state.changeShiftDetails(req.params.start_id, req.params.shift_id)
        responder(res);
    } catch (error) {
        next(error);
    } 
});

api.post('/resetboard', async (req, res, next) => {
    try {
        await state.resetBoard();
        state.resetTimeline();
        responder(res);
    } catch(error) {
        next(error);
    }
});

api.post('/resettimeline', (req, res, next) => {
    state.resetTimeline();
    responder(res);
})

export default api;
