import { EVENT_LIMIT } from "./board.js";

function createHistoryStore() {
  let state = [];

  function getState() {
    return state;
  }

  function save(board) {
    return [JSON.stringify(board), ...state.slice(0, EVENT_LIMIT)];
  }

  function undo() {
    // shift() removes and returns first array item
    return JSON.parse(state.shift());
  }

  return { getState, save, undo };
}

export default createHistoryStore;
