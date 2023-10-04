import express from "express";

const api = express.Router();

// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// JSON
api.get('/doctors', async (req, res) => {
  res.sendFile(getPath('./json/doctors.json'));
});

api.get('/shift_details', async (req, res) => {
  res.sendFile(getPath('./json/shift_details.json'));
});



export default api;