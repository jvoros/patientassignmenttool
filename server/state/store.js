// import { enablePatches } from "immer";
// import r from "./reducer.js";
// import rotation from "../controllers/rotation.js";

// // https://techinscribed.com/implementing-undo-redo-functionality-in-redux-using-immer/
// // patches belong to the store, not the reducer
// // reducer is just a function that returns state
// enablePatches();

// const initial_state = {
//   rotations: [
//     makeRotation("Main", true),
//     makeRotation("Fast Track"),
//     makeRotation("Off"),
//   ],
//   shifts: [],
//   timeline: [],
// };

// // basically a class with all private attributes
// // only some exposed functions
// // eliminates 'this'

// function createStore(reducer = r, initialState = initial_state) {
//   let state = initialState;
//   let undoes = [];

//   function getState() {
//     return state;
//   }

//   function dispatch(action) {
//     state = reducer(state, action, addUndo);
//   }

//   function addUndo(_patches, inversePatches) {
//     const PATCH_LIMIT = 50;
//     undoes = [inversePatches, ...undoes.slice(0, PATCH_LIMIT)];
//   }

//   function getUndo() {
//     return undoes.shift();
//   }

//   return { getState, dispatch, getUndo };
// }

// export default createStore;
