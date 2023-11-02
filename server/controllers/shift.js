import { v4 as uuid } from "uuid";

function make(doctor, options) {
  return {
    id: uuid(),
    doctor,
    start: options.start,
    end: options.end,
    name: options.name,
    bonus: options.bonus,
    rotationId: options.rotationId,
    order: options.order,
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

export default { make, addPatient, setOrder, setRotation };
