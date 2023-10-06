import express from "express";

import board from "./controllers/board.js"
import history from "./controllers/history.js"

const api = express.Router();

// Board serves as state for the whole application
// Site actions will update board and WebSocket will transmit the new board
let main = board.make();
let hx = [];

// save snapshot before making change to board, then can always undo
hx = history.save(hx, main);
main = board.addShiftToBoard(main, "Main", {last: "Voros", first: "Jeremy"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2} )
hx = history.save(hx, main);
main = board.moveShiftFromRotationToRotation(main, 0, "Main", "Off")
hx = history.save(hx, main);
main = board.addShiftToBoard(main, "Main", {last: "Carmack", first: "Brian"}, {start: "08:00", end: "18:00", name: "8 am", bonus: 2})


// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// JSON
api.get('/board', (req, res) => {
  res.json({ main });
});

api.get('/backintime', (req, res) => {
  const { new_board, new_history } = history.revert(hx);
  main = new_board;
  hx = new_history;
  board.addShiftToBoard(main, "Main", {last: "Blake", first: "Kelly"}, {start: "08:00", end: "18:00", name: "8 am", bonus: 2})

  res.json({ main });
})

api.get('/doctors', async (req, res) => {
  res.sendFile(getPath('./json/doctors.json'));
});

api.get('/shift_details', async (req, res) => {
  res.sendFile(getPath('./json/shift_details.json'));
});

export default api;