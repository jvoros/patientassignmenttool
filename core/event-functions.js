const EVENT_LIMIT = 50;

const addToState = async (state, type, options) => {
  const eventId = await db.newEvent(type, options);
  const newState = {
    ...state,
    events: [newEvent, ...state.events.slice(0, EVENT_LIMIT)],
  };
  const updatedEventId = await db.updateEvent(eventId, newState);
  return newState;
};

const undo = async (board) => {};

const reset = async (board) => {};

export default { EVENT_LIMIT, addToState, undo, reset };
