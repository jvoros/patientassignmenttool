import express from 'express';

import State from './state.js';
import db from './db.js';

let state = await State.initialize(db);
const api = express.Router();

api.get('/', async (req, res) => {
    res.send(true);
    res.io.emit('new state', state);

});

// new shift
api.post('/join/:id/shift/:shift/pointer/:pointer', async (req, res) => {   
    // increment row orders
    const orders = await db.newRowOrders(state.newRotationOrdersOnNew());

    // add the new shift
    const params = {
        doctor_id: req.params.id,
        shift_id: req.params.shift,
        rotation_order: req.params.pointer,
        date: state.date
    }
    const newshift = await db.newShift(params);

    // update state
    state.shifts = await db.getShifts();
    
    // send back new state
    res.send(true);
    res.io.emit('new state', state);
});

// off rotation
api.post('/gooffrotation/:id/:status', async (req, res) => {
    const shift_id = req.params.id;
    const shiftIndex = state.shifts.on_rotation.findIndex(s=>s.id == shift_id);
    // if shift index -1, not in on_rotation, only move pointer and reorder rotation if >= 0
    if (shiftIndex >= 0) {
        // if last item in index
        if (state.pointer == shiftIndex && state.pointer == state.shifts.on_rotation.length-1) {
            state.pointer = 0;
        } else if (state.pointer > shiftIndex) { 
            state.pointer--;
        }
        const order = await db.newRowOrders(state.newRotationOrderOnOff(shiftIndex));
    }
    const off = await db.goOffRotation(shift_id, req.params.status);
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// rejoin rotation
api.post('/rejoin/:id', async (req, res) => {
    const params = {'status_id': 1, 'rotation_order': state.pointer}
    const orders = await db.newRowOrders(state.newRotationOrdersOnNew());
    const newshift = await db.updateShift(req.params.id, params);
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// move shift up and down
api.post('/move/:dir/:i', async (req, res) => {
    // i is index of shifts array, not shift.id
    const i = parseInt(req.params.i);
    const shift = state.shifts.on_rotation[i];
    if (req.params.dir == 'up' && i == 0) { 
        res.send(true);
    } else if (req.params.dir == 'down' && i == state.shifts.on_rotation.length-1) { 
        res.send(true)
    } else {
        const orders = await db.newRowOrders(state.moveRotationOrder(shift, req.params.dir));
        state.shifts = await db.getShifts();
        res.send(true);
        res.io.emit('new state', state);
    }
});

// assign patient
api.post('/assignpatient', async (req, res) => {
    const shift = state.getPointerShift();

    // first turn
    if (shift.turn == 0 && shift.patient < 2) {
        // increment just patient count
        const data = await db.incrementCount(shift, 'patient')
    } else {
    // other turns
        // increment patient count and turn and pointer
        const data = await db.incrementCount(shift, 'patient', true)
        state.advancePointer();
    }
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// increment other patient types
api.post('/increment/:type/shift/:shift_id', async (req, res) => {
    const shift = state.getShiftById(req.params.shift_id);
    const data = await db.incrementCount(shift, req.params.type);
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// decrement other patient types
api.post('/decrement/:type/shift/:shift_id', async (req, res) => {
    const shift = state.getShiftById(req.params.shift_id);
    const data = await db.decrementCount(shift, req.params.type);
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// skip patient assignment
api.post('/skip', (req, res) =>{
    state.advancePointer();
    res.send(true);
    res.io.emit('new state', state);
});

api.post('/changeshiftstart/:start_id/:shift_id', async (req,res) => {
    const params = {'shift_id': req.params.start_id};
    const newshift = await db.updateShift(req.params.shift_id, params);
    state.shifts = await db.getShifts();
    res.send(true);
    res.io.emit('new state', state);
});

// reset board
api.post('/resetboard', async (req, res) => {
    const data = await db.resetBoard(state.resetShiftQuery());
    state = await state.initialize(db);
    res.send(true);
    res.io.emit('new state', state);
});

api.get('/supatest', async (req, res) => {
    res.json(await db.getShifts());
});

export default api;
