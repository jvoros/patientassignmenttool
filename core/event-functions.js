const EVENT_LIMIT = 50;

// API
const addToState = async (state, type, options) => {
  const eventId = await db.addEvent(type, options);
  const newState = {
    ...state,
    events: [newEvent, ...state.events.slice(0, EVENT_LIMIT)],
  };
  const updatedEventId = await db.updateEvent(eventId, newState);
  return newState;
};

const undoEvent = async (_board, event) => {
  const deletes = await handleDeletes(event);
  const newState = await db.getLastState(previous.id);
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

export default { EVENT_LIMIT, addToState, undoEvent, reset };
