function make(doctor, options) {
  return {
    doctor,
    start: options.start,
    end: options.end,
    name: options.name,
    bonus: options.bonus,
    bonus_complete: false,
    patients: [],
    counts: {}
  }
}

function updateCounts(shift) {
  const counts = {}
  counts.total = shift.patients.length;
  const types = new Set(shift.patients.map(p => p.type));
  types.forEach((type) => {
    counts[type] = shift.patients.filter((p) => p.type == type).length;
  });
  shift.counts = counts;
  return shift;
}

function addPatient(shift, patient) {
  shift.patients.unshift(patient);
  shift.bonus_complete = (shift.counts.total >= shift.bonus);
  return updateCounts(shift);
}

export default { make, addPatient }
