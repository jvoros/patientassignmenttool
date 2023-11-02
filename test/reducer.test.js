import { describe, it } from "mocha";
import { expect } from "chai";

import actions from "../server/state/actions.js";
import createStore from "../server/state/store.js";

const board = createStore();
const [mainId, ftId, offId] = board.getState().rotations.map((r) => r.id);

const c = {
  doctors: [
    { last: "Voros", first: "Jeremy" },
    { last: "Blake", first: "Kelly" },
    { last: "Kasavana", first: "Brian" },
  ],
  shifts: [
    {
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      order: 0,
      rotationId: mainId,
    },
    {
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      order: 0,
      rotationId: mainId,
    },
    {
      start: "10:00",
      end: "20:00",
      name: "10 am",
      bonus: 2,
      order: 0,
      rotationId: ftId,
    },
  ],
};

describe("Reducer Tests", () => {
  describe("# Add Shifts", () => {
    it("should add shifts", () => {
      board.dispatch(actions.addShift(c.doctors[0], c.shifts[0]));
      expect(board.getState().shifts.length).to.equal(1);
      expect(board.getState().shifts[0].rotationId).to.equal(mainId);
    });
    it("should add shifts at index 0 and increment order on other shifts in rotation", () => {
      board.dispatch(actions.addShift(c.doctors[1], c.shifts[1])); // same rotation
      board.dispatch(actions.addShift(c.doctors[2], c.shifts[2])); // different rotation
      expect(board.getState().shifts[2].order).to.equal(1);
    });
    it("should add shifts at pointer and increment order on other shifts");
  });
});

//     it("should move shifts from one rotation to another", () => {
//       store.dispatch(actions.moveShiftFromTo(0, "ft", "off"));
//       expect(store.getState().rotations.off.shifts.length).to.equal(2);
//       expect(store.getState().rotations.ft.shifts.length).to.equal(0);
//     });
//   });

//   describe("# Patient Assignments", () => {
//     it("should assign walk-in and ambo patients to main rotation", () => {
//       store.dispatch(actions.newPatient("walk-in", "Rm 20"));
//       expect(
//         store.getState().rotations.main.shifts[0].patients[0].room
//       ).to.equal("Rm 20");

//       store.dispatch(actions.newPatient("ambo", "Rm 30"));
//       expect(
//         store.getState().rotations.main.shifts[0].patients[0].room
//       ).to.equal("Rm 30");
//     });

//     it("should assign ft patients to main if no fasttrack shifts", () => {
//       store.dispatch(actions.newPatient("ft", "Rm TrA"));
//       expect(
//         store.getState().rotations.main.shifts[0].patients[0].room
//       ).to.equal("Rm TrA");
//     });

//     it("should assign ft patients to fasttrack if ft shift", () => {
//       store.dispatch(actions.moveShiftFromTo(0, "off", "ft"));
//       store.dispatch(actions.newPatient("ft", "Rm TrB"));
//       expect(store.getState().rotations.ft.shifts[0].patients[0].room).to.equal(
//         "Rm TrB"
//       );
//       console.log(JSON.stringify(store.getState()));
//     });

//     it("should assign patients to any shift");
//     // use rotation name, shift index, patient room, patient type
//   });

//   describe("# Rotation Behaviors", () => {
//     it("should move rotation pointer when shifts presents", () => {
//       store.dispatch(actions.addShift(c.doctors[1], c.shifts[1], "main"));
//       store.dispatch(actions.addShift(c.doctors[2], c.shifts[2], "main"));
//       store.dispatch(actions.movePointer("main", 1));
//       expect(store.getState().rotations.main.pointer).to.equal(1);
//     });

//     it("should move shifts within rotation", () => {
//       store.dispatch(actions.moveShift("main", 1, -1));
//       expect(store.getState().rotations.main.shifts[0].doctor.last).to.equal(
//         "Blake"
//       );
//     });
//   });

//   describe("Timeline Functionality", () => {
//     const time = createStore();
//     it("should record shift joining rotation", () => {
//       time.dispatch(actions.addShift(c.doctors[0], c.shifts[0]));
//       expect(time.getState().timeline[0].action).to.equal("join");
//     }),
//       it("should record patient assignments", () => {
//         time.dispatch(actions.newPatient("walk-in", "19"));
//         expect(time.getState().timeline[0].action).to.equal("walk-in");
//         expect(time.getState().timeline.length).to.equal(2);
//       }),
//       it("should record shift movement between boards", () => {
//         time.dispatch(actions.moveShiftFromTo(0, "main", "ft"));
//         expect(time.getState().timeline.length).to.equal(3);
//       }),
//       it("should record pointer movement within main rotation", () => {
//         time.dispatch(actions.moveShiftFromTo(0, "ft", "main"));
//         time.dispatch(actions.addShift(c.doctors[1], c.shifts[1], "main"));
//         time.dispatch(actions.movePointer("main", 1));
//         expect(time.getState().timeline.length).to.equal(6);
//       }),
//       it("should record shift movements within rotation", () => {
//         time.dispatch(actions.moveShift("main", 0, 1));
//         expect(time.getState().timeline.length).to.equal(7);
//       });
//     it("should undo last event", () => {
//       //console.log(time.getState().rotations.main.shifts[0].doctor)

//       expect(time.getState().rotations.main.shifts[0].doctor.last).to.equal(
//         "Voros"
//       );
//       time.dispatch(actions.moveShift("main", 0, 1));
//       // console.log(JSON.stringify(time.getState(),null, 2))
//       expect(time.getState().rotations.main.shifts[0].doctor.last).to.equal(
//         "Blake"
//       );
//       time.dispatch(actions.undo(time.getUndo()));
//       expect(time.getState().rotations.main.shifts[0].doctor.last).to.equal(
//         "Voros"
//       );
//     });
//   });
// });
