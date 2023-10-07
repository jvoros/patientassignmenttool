function make(doctor, options) {
  return {
    doctor,
    start: options.start,
    end: options.end,
    name: options.name,
    bonus: options.bonus,
    patients: [],
    counts: {},
    addPatient(pt) { 
      this.patients.unshift(pt);
      this.updateCounts();
      return this;
    },
    updateCounts() {
      this.counts = this.patients.reduce((result, pt) => {
        result.total++;
        result[pt.type] = (result[pt.type] || 0) + 1;
        return result;
      }, { total: 0 });
    },
  }
}

// function updateCounts(shift) {
//   const counts = shift.patients.reduce((result, patient) => {
//     result.total++;
//     result[patient.type] = (result[patient.type] || 0) + 1;
//     return result;
//   }, { total: 0 });
  
//   return {...shift, counts};
// }

function addPatient(shift, patient) {
  // return updateCounts({
  //   ...shift,
  //   patients: [patient, ...shift.patients],
  // });
}

export default { make, addPatient }
