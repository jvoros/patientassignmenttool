import express from 'express';
import state from './state.js';

const api = express.Router();

function responder(res) {
    // client browser needs a response to know transmission complete
    res.json({ message: 'success' });
    // state payload sent to client by socket.io
    res.io.emit('new state', state);
}

// api endpoints

api.post('/', async (req, res, next) => {
    await state.initialize();
    responder(res);
});

api.post('/join/:doc_id/shift/:shift_id/pointer/:pointer', async (req, res) => {  
    await state.joinRotation(req.params.doc_id, req.params.shift_id, req.params.pointer);
    responder(res);
});

api.post('/gooffrotation/:shift_id/:status', async (req, res) => {
    await state.goOffRotation(req.params.shift_id, req.params.status);
    responder(res);
});

api.post('/rejoin/:shift_id', async (req, res) => {
    await state.rejoin(req.params.shift_id);
    responder(res);
});

api.post('/move/:dir/:index', async (req, res) => {
    await state.moveRotation(req.params.dir, req.params.index);
    responder(res);
});

api.post('/assignpatient/:initials?', async (req, res) => {
    const initials = req.params.initials ? req.params.initials : 'Anon';
    await state.assignPatient(initials);
    responder(res);
});

api.post('/undolastassign', async (req, res) => {
    await state.undoLastAssign();
    responder(res);
});

api.post('/increment/:type/shift/:shift_id', async (req, res) => {
    await state.increment(req.params.shift_id, req.params.type);
    responder(res);
});

api.post('/decrement/:type/shift/:shift_id', async (req, res) => {
    await state.decrement(req.params.shift_id, req.params.type);
    responder(res);
});

api.post('/skip', async (req, res) => {
    state.skip();
    responder(res);
});

api.post('/goback', async (req, res) => {
    state.goback();
    responder(res);
});

api.post('/changeshiftdetails/:start_id/:shift_id', async (req,res) => {
    await state.changeShiftDetails(req.params.start_id, req.params.shift_id)
    responder(res);
});

api.post('/resetboard', async (req, res) => {
    await state.resetBoard();
    state.resetTimeline();
    responder(res);
});

api.post('/resettimeline', async (req, res) => {
    state.resetTimeline();
    responder(res);
})

export default api;
