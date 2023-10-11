import express from "express"

import createStore from "./state/store.js"
import actions from "./state/actions.js"

const api = express.Router();
const store = createStore();

// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// JSON
api.get('/board', (req, res) => {
  store.dispatch(actions.addShift({last: "Blake", first: "Kelly"}, {start: "08:00", end: "18:00", name: "8 am", bonus: 2}, 'main'))
  res.json(store.getState());
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