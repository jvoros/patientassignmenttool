import express from 'express';
import State from './state.js';

let state = await State.initialize();
const api = express.Router();

api.get('/', async (req, res) => {
    res.send(true);
    res.io.emit('new state', state);
});

api.post('/join/:id/shift/:shift/pointer/:pointer', async (req, res) => {   
    await state.joinRotation(req.params.id, req.params.shift, req.params.pointer);
    res.io.emit('new state', state);
});

api.post('/gooffrotation/:id/:status', async (req, res) => {
    await state.goOffRotation(req.params.id, req.params.status);
    res.io.emit('new state', state);
});

api.post('/rejoin/:id', async (req, res) => {
    await state.rejoin(req.params.id);
    res.io.emit('new state', state);
});

api.post('/move/:dir/:index', async (req, res) => {
    await state.moveRotation(req.params.dir, req.params.index);
    res.io.emit('new state', state);
});

api.post('/assignpatient/:initials?', async (req, res) => {
    const initials = req.params.initials ? req.params.initials : 'Anon';
    await state.assignPatient(initials);
    res.io.emit('new state', state);
});

api.post('/undolastassign', async (req, res) => {
    await state.undoLastAssign();
    res.io.emit('new state', state);
})

api.post('/increment/:type/shift/:shift_id', async (req, res) => {
    await state.increment(req.params.shift_id, req.params.type);
    res.io.emit('new state', state);
});

api.post('/decrement/:type/shift/:shift_id', async (req, res) => {
    await state.decrement(req.params.shift_id, req.params.type);
    res.io.emit('new state', state);
});

api.post('/skip', (req, res) =>{
    state.skip();
    res.io.emit('new state', state);
});

api.post('/goback', (req, res) => {
    state.goback();
    res.io.emit('new state', state);
})

api.post('/changeshiftdetails/:start_id/:shift_id', async (req,res) => {
    await state.changeShiftDetails(req.params.start_id, req.params.shift_id)
    res.io.emit('new state', state);
});

api.post('/resetboard', async (req, res) => {
    state.resetTimeline();
    await state.resetBoard();
    res.io.emit('new state', state);
});

api.post('/resettimeline', (req, res) => {
    state.resetTimeline();
    res.io.emit('new state', state);
})

api.get('/supatest', async (req, res) => {
    res.json(state.resetShiftQuery());
});

export default api;
