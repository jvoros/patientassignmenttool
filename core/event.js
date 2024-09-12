import db from "./db.js";

const EVENT_LIMIT = 30;

// API
const addToState = async (state, type, options) => {
  const eventId = await db.addEvent(type, options);
  const newState = structuredClone(state);
  newState.events = [eventId, ...state.events.slice(0, EVENT_LIMIT - 1)];
  const updatedEventId = await db.updateEvent(eventId, newState);
  return newState;
};

// comes from board so state will be first param
// event param from front end, full event object
// event { id, event_type, shift {id}, patient {id}}
const undo = async (_state, event) => {
  const deletes = await handleDeletes(event);
  const newState = await db.getLastState();
  return newState;
};

// HELPERS
const handleDeletes = async (event) => {
  const deleteActions = {
    addShift: () => db.deleteShift(event.shift.id),
    assignPatient: () => db.deletePatient(event.patient.id),
  };

  const deleteChild = deleteActions[event.event_type]?.();
  const deleteEvent = db.deleteEvent(event.id);

  const results = await Promise.all([deleteChild, deleteEvent]);
  return results;
};

export default { EVENT_LIMIT, addToState, undo };
