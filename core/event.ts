import uid from "./uid.js";

const make = (options: EventMakeParams): BoardEvent => {
  return { id: uid(), time: Date.now(), patches: [], ...options };
};

const addReassign = (params: { priorEvent: BoardEvent; newProvider: string }): void => {
  const { priorEvent, newProvider } = params;
  priorEvent.note = `Reassigned to: ${newProvider}`;
};

const addPatches = (params: { event: BoardEvent; patches: Patch[] }): void => {
  const { event, patches } = params;
  event.patches = patches;
};

const changeRoom = (params: { event: BoardEvent; newRoom: string }): void => {
  const { event, newRoom } = params;
  event.room = newRoom;
};

export default {
  make,
  addReassign,
  addPatches,
  changeRoom,
};
