import express from "express"

import createStore from "./state/store.js"
import actions from "./state/actions.js"

const api = express.Router();
const store = createStore();

// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// MIDDLEWARE
// if 'nurse' then admin actions at bottom
const confirmRole = (requiredRole) => (req, res, next) => {
  if (!req.role || req.role !== requiredRole) {
    return res.status(401).json({ message: 'Unauthorized Request' });
  }
  return next();
}

// JSON
api.get('/board', (req, res) => {
  store.dispatch(actions.addShift({last: "Blake", first: "Kelly"}, {start: "08:00", end: "18:00", name: "8 am", bonus: 2}, 'main'))
  res.json(store.getState());
});

api.get('/doctors', async (req, res) => {
  res.sendFile(getPath('./json/doctors.json'));
});

api.get('/shift_details', async (req, res) => {
  res.sendFile(getPath('./json/shift_details.json'));
});


// PROTECTED ADMIN ACTIONS
api.use(confirmRole('nurse'));

api.get('/backintime', (req, res) => {

})

export default api;