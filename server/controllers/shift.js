import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

function make(doctor, options) {
  return {
    id: uid.rnd(),
    doctor,
    start: options.start,
    end: options.end,
    name: options.name,
    bonus: options.bonus,
    rotationId: options.rotationId,
    order: options.order,
    skip: false,
    patients: [],
    counts: {},
  };
}
function setOrder(shift, order) {
  return { ...shift, order };
}

function setRotation(shift, rotationId) {
  return { ...shift, rotationId };
}

function addPatient(shift, pt) {
  return updateCounts({ ...shift, patients: [pt, ...shift.patients] });
}

function removePatient(shift, ptId) {
  return updateCounts({
    ...shift,
    patients: shift.patients.filter((p) => p.id !== ptId),
  });
}

function updateCounts(shift) {
  const counts = shift.patients.reduce(
    (result, pt) => {
      result.total++;
      result[pt.type] = (result[pt.type] || 0) + 1;
      return result;
    },
    { total: 0 }
  );
  return { ...shift, counts };
}

function turnComplete(shift) {
  // if APP shift, toggle skip each time through
  return toggleSkip(shift);
}

function toggleSkip(shift) {
  return shift.doctor.app ? { ...shift, skip: !shift.skip } : shift;
}

export default {
  make,
  addPatient,
  removePatient,
  setOrder,
  setRotation,
  turnComplete,
  toggleSkip,
};
