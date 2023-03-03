// Hitting the route modifies the state,
// then returns complete state
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const api = express.Router();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

// utility functions
function myDate() {
    const d = new Date();
    return d.toLocaleDateString("fr-CA", {timeZone: "America/Denver"});
}
function Doctor(name, shift) {
	this.name = name;
    this.shift = shift;
    this.date = myDate();
	this.turn = 0;
	this.count = 0;
    this.patients = [];
}

// utility base state
let basestate = {
	pointer: 0,
	doctors: [new Doctor("Nicolai", "6a"), new Doctor("Stevens", "8a")],
	inactive: [],
    error: ''
};

// current state
let state = await supabase
    .from('state_table')
    .select("*")
    .eq('id', 2)
    .limit(1)
    .then((res) => {
        if (res.error) return ({ error: res.error});
        else return res.data[0].state;
    })
    .catch(console.error);

// utility to update state
async function updateState(newState) {
    const {data, error} = await supabase
        .from('state_table')
        .update({ state: newState })
        .eq('id', 2)
        .select()
    if (data) return data[0].state;
    return ({ error: error.message });
}

// state modification functions
// take state as parameter
// modifies then returns state
function loginDoctor(state, name, shift) {
    state.doctors.splice(state.pointer, 0, new Doctor(name, shift));
    return state;
}

function logoutDoctor(state, i) {
    if (i == state.doctors.length - 1) state.pointer = 0;
    state.inactive.push(state.doctors[i]);
    state.doctors.splice(i, 1);
    return state;
}

function moveUp(state, index) {
    const i = parseInt(index);
    console.log('move up: ', i);
    if (i == 0) return state;
    [state.doctors[i], state.doctors[i-1]] = [state.doctors[i-1], state.doctors[i]];
    return state;
}

function moveDown(state, index) {
    // https://stackoverflow.com/questions/30475749/about-5-1-51-in-javascript-plus-and-minus-signs
    const i = parseInt(index); 
    if (i == state.doctors.length - 1) return state;
    [state.doctors[i], state.doctors[i+1]] = [state.doctors[i+1], state.doctors[i]];
    return state;
}

function takeTurn(state) {
    state.doctors[state.pointer].count++;
    state.doctors[state.pointer].turn++;
    state.pointer = state.pointer < state.doctors.length-1 ? state.pointer+1 : 0;
    return state;
}

// handles different process for first and second turns
function assignPatient(state) {
    const d = state.doctors[state.pointer];
    if (d.turn === 0 && d.count < 2) {
        d.count++;
        return state;
    }
    if (d.turn === 1 && d.count < 4) {
        d.count++;
        return state;
    }
    return takeTurn(state);
}

// utility to handle all the state mod functions and responses
// first update supabase
// then update local state
// then send updated state back to client
async function newStateRespond(newState, res) {
    state = await updateState(newState);
    res.json({ state: state });
}

// routes
api.get('/', async (req, res) => {
    // reset to base state 
     //newStateRespond(basestate, res)
    res.json({ state: state });
});

api.post('/logindoctor/:name/shift/:shift', async (req, res) => {
    newStateRespond(loginDoctor(state, req.params.name, req.params.shift), res);
});

api.post('/logoutdoctor/:id', async (req, res) => {
    newStateRespond(logoutDoctor(state, req.params.id), res);
});

api.post('/move/:updown/:i', async (req, res) => {
    if (req.params.updown == 'up') {
        newStateRespond(moveUp(state, req.params.i), res);
    } else {
        newStateRespond(moveDown(state, req.params.i), res);
    }
});

api.post('/assignpatient', async (req, res) => {
    newStateRespond(assignPatient(state), res);
});

api.get('/devreset', async (req, res) => {
    newStateRespond(basestate, res);
});

// api.get('/databasefill', async(req, res) => {
//     for (let i=1; i<100; i++) {
//         const { error } = await supabase
//             .from('state_table')
//             .insert({state: basestate})
//         i++;
//     }
// });

export default api;
