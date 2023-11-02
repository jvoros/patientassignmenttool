import { makeRotation } from "./rotation.js";
import { makeShift, setShiftRotation } from "./shift.js";

const makeBoard = () => ({
  rotations: [
    makeRotation("Main", true),
    makeRotation("Fast Track"),
    makeRotation("Off"),
  ],
  shifts: [],
  events: [],
});

const addShiftToBoard = (board, doctor, options) => ({
  ...board,
  shifts: [makeShift(doctor, options), ...board.shifts],
});

const moveShiftToRotation = (board, shiftId, newRotationId) => {
  return {
    ...board,
    shifts: modShiftWithId(
      board.shifts,
      shiftId,
      setShiftRotation,
      newRotationId
    ),
  };
};

const modShiftWithId = (shifts, shiftId, func, ...args) => {
  return shifts.map((shift) => {
    return shift.id === shiftId ? func(shift, ...args) : shift;
  });
};

export { makeBoard, addShiftToBoard, moveShiftToRotation };
