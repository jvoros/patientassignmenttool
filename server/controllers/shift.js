class Shift {

  constructor(doctor, options) {
    // options config object { name, end, start, bonus }
    this.doctor = doctor;           // doctor object
    this.start = options.start;     // string, hour
    this.end = options.end;         // string, hour
    this.name = options.name;       // string
    this.bonus = options.bonus;     // numb
    this.patients = [];             // array of patient objects
  }

  get counts() {
    const counts = {
      total: this.patients.length
    }
    const types = new Set(this.patients.map(x => x.type));
    types.forEach((t) => {
      counts[t] = this.patients.filter((p) => p.type == t).length;
    });
    return counts;
  }

  get in_bonus() {
    if (this.counts.total <= this.bonus) return true;
    return false;
  }

  addPatient(patient) {
    this.patients.splice(0, 0, patient);
    return this;
  }

}

export default Shift;