import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";

import db from "../src/db.js";
import State from "../src/state.js";

describe("State Class Tests", () => {
  // setup
  sinon.stub(db, "getShiftDetails");
  db.getShiftDetails.returns([{ name: "6am" }, { name: "8am" }]);

  sinon.stub(db, "getShifts");
  db.getShifts.returns({
    on_rotation: [
      { id: 1, doctor: { last: "Watson", first: "John" } },
      { id: 2, doctor: { last: "McCoy", first: "Leonard" } },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ],
    off_rotation: [{ id: 3 }],
    ft_rotation: [{ id: 4 }],
  });

  sinon.stub(db, "getDoctors");
  db.getDoctors.returns([{ first: "Jeremy", last: "Voros" }]);

  const d = new Date();
  const state = new State();

  describe("# initialize()", () => {
    it("should initialize with appropriate properties", (done) => {
      state.initialize().then(() => {
        expect(state.timeline).to.be.empty;
        expect(state.pointer).to.be.equal(0);
        expect(state.date).to.equal(
          d.toLocaleDateString("fr-CA", { timeZone: "America/Denver" })
        );
        expect(state.shift_details[0]).to.have.keys("name");
        expect(state.shifts).to.have.keys(
          "on_rotation",
          "off_rotation",
          "ft_rotation"
        );
        expect(state.doctors[0]).to.have.keys("first", "last");
        expect(state.initialized).to.equal(true);
        done();
      });
    });
  });

  describe("# newAction()", () => {
    // setup
    const action = {
      action: "patient",
      shift_id: 0,
      msg: "message",
      initials: "AA",
      pointer: true,
      turn: true,
      doctor: { last: "Nurse", first: "Triage" },
      time: new Date().toLocaleString("en-US", {
        timeZone: "America/Denver",
        timeStyle: "short",
      }),
    };

    state.newAction("patient", 0, "message", "AA", true, true);
    const a = state.timeline[0];

    // tests
    it("should add actions to the timeline", () => {
      expect(a).to.exist;
    });

    it("should add all properties to the action", () => {
      expect(a).to.deep.equal(action);
    });

    it("should set name to Triage Nurse for shift_id 0", () => {
      expect(a.doctor).to.deep.equal(action.doctor);
    });

    it("should limit the timeline to 20 actions", () => {
      state.timeline = Array(20).fill(1);
      state.newAction("patient", 0, "length test", "AA", true, true);

      expect(state.timeline.length).to.equal(20);
    });

    it("should put the new action at the start of the timeline", () => {
      expect(state.timeline[0].msg).to.equal("length test");
    });

    it("should get doctor name from getShiftById", () => {
      state.newAction("patient", 1, "length test", "AA", true, true);
      expect(state.timeline[0].doctor).to.deep.equal({
        last: "Watson",
        first: "John",
      });
    });
    state.timeline = [];
  });

  describe("# resetTimeline()", () => {
    it("should clear timeline and add reset action", () => {
      state.timeline = Array(20).fill(1);
      state.resetTimeline();

      expect(state.timeline.length).to.equal(1);
      expect(state.timeline[0].action).to.equal("reset");

      state.timeline = [];
    });
  });

  describe("# getPointerShift()", () => {
    it("should return on_rotation item with index == pointer", () => {
      expect(state.getPointerShift().id).to.equal(1);
      state.pointer = 1;
      expect(state.getPointerShift().id).to.equal(2);
    });
  });

  describe("# movePointer()", () => {
    it("should increment pointer if not pointing to last item", () => {
      state.pointer = 2;
      state.movePointer("up");
      expect(state.pointer).to.equal(3);
    });

    it("should increment pointer to 0 if pointing at last item", () => {
      state.pointer = 4;
      state.movePointer("up");
      expect(state.pointer).to.equal(0);
    });

    it("should decrement pointer to last item if pointing to first item", () => {
      state.pointer = 0;
      state.movePointer("down");
      expect(state.pointer).to.equal(4);
    });

    it("should decrement pointer if not pointing at first item", () => {
      state.pointer = 4;
      state.movePointer("down");
      expect(state.pointer).to.equal(3);
    });
  });

  describe("# skip()", () => {
    it("should get the shift at the pointer", () => {});
    it("should add a 'skip' action to timeline for that shift's doctor", () => {});
    it("should advance the pointer", () => {});
  });

  describe("# goback()", () => {
    it("should get the shift at the pointer", () => {});
    it("should add a 'skip' action to timeline for that shift's doctor", () => {});
    it("should lower the pointer", () => {});
  });
});
