import Rotation from "./rotation.js";
import Shift from "./shift.js";
import event from "./event.js";
import patient from "./patient.js";

const initialState = {
  rotations: [
    Rotation.make("Main", true),
    Rotation.make("Fast Track"),
    Rotation.make("Off"),
  ],
  shifts: [],
  events: [],
};

function createBoardStore() {
  let state = initialState;

  function reset() {
    state = initialState;
    return state;
  }

  function getState() {
    return state;
  }

  function addNewShift(doctor, options) {
    addShift(Shift.make(doctor, options));
    return;
  }

  function moveRotationPointer(rotationId, offset) {
    state.rotations = modifyRotationById(
      rotationId,
      Rotation.movePointer,
      offset
    );
    return;
  }

  function addShift(newShift) {
    const rot = findRotationById(newShift.rotationId);
    newShift.order = rot.usePointer ? rot.pointer : 0;

    state.shifts = handleRotationOrder(newShift.rotationId, rot.pointer, "add");

    state.rotations = modifyById(
      state.rotations,
      newShift.rotationId,
      Rotation.addShift
    );

    state.shifts = [newShift, ...state.shifts];
    return;
  }

  function moveShiftToRotation(moveShiftId, newRotationId) {
    const moveShift = findShiftById(moveShiftId);
    // filter out the moved shift
    state.shifts = state.shifts.filter((s) => s.id !== moveShiftId);
    const newShifts = handleRotationOrder(
      moveShift.rotationId,
      moveShift.order,
      "remove"
    );
    state.shifts = newShifts;
    state.rotations = modifyRotationById(
      moveShift.rotationId,
      Rotation.removeShift,
      moveShift.order
    );

    addShift(Shift.setRotation(moveShift, newRotationId));
    return;
  }

  function moveShift(shiftId, offset) {
    const shift = findShiftById(shiftId);
    const rotationId = shift.rotationId;
    const shiftCount = findRotationById(rotationId).shiftCount;
    const oldOrder = shift.order;
    const newOrder = (shift.order + offset + shiftCount) % shiftCount;
    //early return for moving beyond bounds of rotation
    if (
      (oldOrder === 0 && offset === -1) ||
      (oldOrder === shiftCount - 1 && offset === 1)
    ) {
      return;
    }

    state.shifts = state.shifts.map((shift) =>
      shift.id === shiftId
        ? Shift.setOrder(shift, newOrder)
        : shift.rotationId !== rotationId
        ? shift
        : shift.order === newOrder
        ? Shift.setOrder(shift, oldOrder)
        : shift
    );
    return;
  }

  // helpers
  function modifyById(arr, itemId, func, ...args) {
    return arr.map((item) => {
      return item.id === itemId ? func(item, ...args) : item;
    });
  }

  function modifyRotationById(rotationId, func, ...args) {
    return modifyById(state.rotations, rotationId, func, ...args);
  }

  function findById(arr, id) {
    return arr.find((r) => r.id === id);
  }

  function findShiftById(id) {
    return findById(state.shifts, id);
  }

  function findRotationById(id) {
    return findById(state.rotations, id);
  }

  function shiftsForRotation(rotationId) {
    return state.shifts.filter((shift) => shift.rotationId === rotationId);
  }

  function handleRotationOrder(rotationId, cutoff, operation = "add") {
    const offset = operation === "add" ? 1 : -1;
    return state.shifts.map((shift) => {
      if (shift.rotationId !== rotationId) return shift;
      if (shift.order < cutoff) return shift;
      return Shift.setOrder(shift, shift.order + offset);
    });
  }

  return {
    getState,
    reset,
    addNewShift,
    moveShiftToRotation,
    moveRotationPointer,
    moveShift,
  };
}

export default createBoardStore;
