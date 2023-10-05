class Shift {

  constructor(doctor, options) {
    // options config object { name, end, start, bonus }
    this.doctor = doctor;           // doctor object
    this.start = options.start;     // string, hour
    this.end = options.end;         // string, hour
    this.name = options.name;       // string
    this.bonus = options.bonus;     // numb
    this.patients = [];             // array of patient objects
    this.counts = {};
  }

  updateCounts() {
    const counts = {
      total: this.patients.length
    }
    const types = new Set(this.patients.map(x => x.type));
    types.forEach((type) => {
      counts[type] = this.patients.filter((p) => p.type == type).length;
    });
    return counts;
  }

  get bonus_complete() {
    if (this.counts.total <= this.bonus) return false;
    return true;
  }

  addPatient(patient) {
    this.patients.splice(0, 0, patient);
    this.counts = this.updateCounts();
    return this
  }

}

export default Shift;