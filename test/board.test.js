// import { describe, it } from "mocha";
// import { expect } from "chai";

// import Board from '../server/controllers/board.js'

// const board = new Board();

// describe("Board Class Tests", () => {

//   describe("# lifecycle methods", () => {
//     it("should initialize correctly", () => {
//       expect(Object.keys(board.rotations)).to.deep.equal(['Main', 'Fast Track', 'Off']);
//       expect(board.timeline).to.exist;
//     });
//     it("should be able to reset rotations", () => {
//       board.rotations['Main'].addShift({shift: 'test'});
//       board.reset();
//       expect(board.rotations['Main'].shifts.length).to.equal(0)
//     });
//     it("should be able to reset with Timeline");
//   });

//   describe("# rotation methods", () => {
//     it("should add shifts", () => {
//       board.addShiftToRotation("Main", {last: "Voros", first: "Jeremy"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
//       expect(board.rotations['Main'].shifts[0].doctor.last).to.equal("Voros");
//     });

//     it("should move shifts between rotations", () => {
//       board.rotations['Main'].addShift({shift: 'test'});
//       board.moveShiftBetweenRotations(0, "Main", "Off");
//       expect(board.rotations['Main'].shifts.length).to.equal(1);
//       expect(board.rotations['Off'].shifts.length).to.equal(1);
//     });

//     it("should assign patients to main, fasttrack, or fasttrack to main if no fasttrack shift", () => {
//       board.assignPatient('Fast Track', 20);
//       expect(board.rotations['Main'].shifts[0].counts['Fast Track']).to.equal(1);
      
//       board.assignPatient('Walk-In', 4);
//       expect(board.rotations['Main'].shifts[0].counts["Walk-In"]).to.equal(1);

//       board.addShiftToRotation("Fast Track", {last: "Kasavana", first: "Brian"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
//       board.assignPatient('Fast Track', 21);
//       expect(board.rotations['Fast Track'].shifts[0].counts['Fast Track']).to.equal(1);
//     })
//   });

//   describe("# timeline methods", () => {
//     it("should record patient assignments");
//     it("should record shift additions to the board");
//     it("should record shift movements between rotations");
//     it("should record pointer movement within rotations");
//   });
// });