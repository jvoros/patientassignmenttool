import { enablePatches } from "immer"
import rotation from "../controllers/rotation.js"
import r from "./reducer.js"

// https://techinscribed.com/implementing-undo-redo-functionality-in-redux-using-immer/
// patches belong to the store, not the reducer
// reducer is just a function that returns state
enablePatches();

const initial_state = {
  rotations: {
    main: rotation.make('main', true),
    ft: rotation.make('ft'),
    off: rotation.make('off')
  },
  timeline: [],
}

function createStore(reducer = r, initialState = initial_state) {

  let state = initialState;
  let undoes = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action, addUndo);
  }

  function addUndo(_patches, inversePatches) {
    const PATCH_LIMIT = 50;
    undoes = [inversePatches, ...undoes.slice(0, PATCH_LIMIT)]
  }

  function revert() {
    return undoes.shift();
  }

  return { getState, dispatch, revert };
}

export default createStore;
