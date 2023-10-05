import express from "express";

import Board from "./controllers/board.js"
import BoardHistory from "./controllers/boardhistory.js"

const api = express.Router();

// Board serves as state for the whole application
// Site actions will update board and WebSocket will transmit the new board
let board = new Board();
const history = new BoardHistory();

// save snapshot before making change to board, then can always undo
history.save(board);
board.addShiftToRotation("Main", {last: "Voros", first: "Jeremy"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
history.save(board);
board.moveShiftBetweenRotations(0, "Main", "Off")
history.save(board);
board.addShiftToRotation("Main", {last: "Carmack", first: "Brian"}, {start: "08:00", end: "18:00", name: "8 am", bonus: 2})


// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// JSON
api.get('/board', (req, res) => {
  res.json({ board });
});

api.get('/backintime', (req, res) => {
  board = history.revert();
  res.json({ board });
})

api.get('/doctors', async (req, res) => {
  res.sendFile(getPath('./json/doctors.json'));
});

api.get('/shift_details', async (req, res) => {
  res.sendFile(getPath('./json/shift_details.json'));
});

export default api;