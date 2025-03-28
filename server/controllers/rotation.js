import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

function make(name, patientRotation = false, midlevelRotation = false) {
  return {
    id: uid.rnd(),
    name,
    cycle: {
      patient: patientRotation,
      midlevel: midlevelRotation,
    },
    next: {
      patient: null,
      midlevel: null,
    },
  };
}

function setNext(rotation, cycle, shiftId) {
  const newRot = { ...rotation };
  newRot.next[cycle] = shiftId;
  return newRot;
}

// function movePointer(rotation, offset) {
//   if (rotation.shiftCount === 0 || rotation.usePointer === false) {
//     return rotation;
//   }
//   return {
//     ...rotation,
//     pointer:
//       (rotation.pointer + offset + rotation.shiftCount) % rotation.shiftCount,
//   };
// }

// function moveAppPointer(rotation, offset) {
//   return {
//     ...rotation,
//     appPointer:
//       (rotation.appPointer + offset + rotation.shiftCount) %
//       rotation.shiftCount,
//   };
// }

export default { make, setNext };
