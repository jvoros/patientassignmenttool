import { describe, it } from "mocha"
import { expect } from "chai"

import actions from "../server/actions.js"
import createStore from "../server/store.js"

const c = {
  doctors: [
    {last: 'Voros', first: 'Jeremy'},
    {last: "Blake", first: "Kelly"},
    {last: "Kasavana", first: "Brian"}
  ],
  shifts: [
    {start: "06:00", end: "15:00", name: "6 am", bonus: 2},
    {start: "08:00", end: "17:00", name: "8 am", bonus: 2},
    {start: "10:00", end: "20:00", name: "10 am", bonus: 2}
  ]
}

describe("Reducer Tests", () => {
  const store = createStore();
  
  describe("Add & Move Shifts", () => {
    
    it("should add shifts to main, ft, off rotations", () => {
      store.dispatch(actions.addShift(c.doctors[0], c.shifts[0]))
      expect(store.getState().rotations.main.shifts.length).to.equal(1)

      store.dispatch(actions.addShift(c.doctors[1], c.shifts[1], 'ft'))
      expect(store.getState().rotations.ft.shifts.length).to.equal(1)

      store.dispatch(actions.addShift(c.doctors[2], c.shifts[2], 'off'))
      expect(store.getState().rotations.off.shifts.length).to.equal(1)
    });

    it("should move shifts from one rotation to another", () => {
      store.dispatch(actions.moveShiftFromTo(0, 'ft', 'off'));
      expect(store.getState().rotations.off.shifts.length).to.equal(2);
      expect(store.getState().rotations.ft.shifts.length).to.equal(0);
    });
  });

  describe("Patient Assignments", () => {

    it("should assign walk-in and ambo patients to main rotation", () => {
      store.dispatch(actions.newPatient('walk-in', 'Rm 20'));
      expect(store.getState().rotations.main.shifts[0].patients[0].room).to.equal('Rm 20');

      store.dispatch(actions.newPatient('ambo', 'Rm 30'));
      expect(store.getState().rotations.main.shifts[0].patients[0].room).to.equal('Rm 30');
    })

    it("should assign ft patients to main if no fasttrack shifts", () => {
      store.dispatch(actions.newPatient('ft', 'Rm TrA'));
      expect(store.getState().rotations.main.shifts[0].patients[0].room).to.equal('Rm TrA');
    })

    it("should assign ft patients to fasttrack if ft shift", () => {
      store.dispatch(actions.moveShiftFromTo(0, 'off', 'ft'));
      store.dispatch(actions.newPatient('ft', 'Rm TrB'));
      expect(store.getState().rotations.ft.shifts[0].patients[0].room).to.equal('Rm TrB');
    })
  });

  describe("Rotation Behaviors", () => {
    it("should move rotation pointer")
  });

  describe("Timeline Functionality", () => {
    it("should record patient assignments"),
    it("should record shift joining rotation"),
    it("should record shift movement between boards"),
    it("should record pointer movement within main rotation"),
    it("should undo last event")
  });

});
