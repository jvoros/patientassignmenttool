import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

function make(provider, options) {
  return {
    id: uid.rnd(),
    provider,
    name: options.name,
    bonus: options.bonus,
    app: options.app,
    patients: [],
    counts: {},
  };
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

export default {
  make,
  addPatient,
  removePatient,
};
