import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

function make(name, usePointer = false) {
  return {
    id: uid.rnd(),
    name,
    usePointer,
    pointer: 0,
    shiftCount: 0,
  };
}

function movePointer(rotation, offset) {
  if (rotation.shiftCount === 0 || rotation.usePointer === false) {
    return rotation;
  }
  return {
    ...rotation,
    pointer:
      (rotation.pointer + offset + rotation.shiftCount) % rotation.shiftCount,
  };
}

function addShift(rotation) {
  return adjustShiftCount(rotation, 1);
}

function removeShift(rotation, shiftOrder) {
  // if order > pointer, no change to pointer
  // if order < pointer, minus pointer
  // if order == pointer and order not last, no change to pointer
  // if order == pointer and order is last, pointer to 0
  const pointer =
    shiftOrder < rotation.pointer
      ? rotation.pointer - 1
      : shiftOrder == rotation.pointer && shiftOrder == rotation.shiftCount - 1
      ? 0
      : rotation.pointer;
  return adjustShiftCount({ ...rotation, pointer }, -1);
}

// can't be less than zero
function adjustShiftCount(rotation, offset) {
  return {
    ...rotation,
    shiftCount: Math.max(rotation.shiftCount + offset, 0),
  };
}

export default { make, movePointer, addShift, removeShift };
