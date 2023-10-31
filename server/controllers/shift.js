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

export default { make }

