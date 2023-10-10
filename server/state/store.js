import { enablePatches } from "immer"
import rotation from "../controllers/rotation.js"
import r from "./reducer.js"

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
  
  // https://techinscribed.com/implementing-undo-redo-functionality-in-redux-using-immer/
  // patches belong to the store, not the reducer
  // reducer is just a function that returns state
  
  const undoes = {
    PATCH_LIMIT: 50,
    patches: [],
    addUndo(_patches, inversePatches) {
      this.patches = [inversePatches, ...this.patches.slice(0, this.PATCH_LIMIT)];
    },
    getLastUndo() {
      // shift() will pull off first array of undoPatches
      // leaving undoes.patches one event shorter
      return this.patches.shift();
    }
  }

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action, undoes);
  }

  return { getState, dispatch };
}

export default createStore;
