import rotation from "../controllers/rotation.js"
import r from "./reducer.js"

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
  
  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
  }

  return { getState, dispatch };
}

export default createStore;
