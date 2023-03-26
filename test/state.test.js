import { describe, it, before, after, beforeEach } from "mocha";
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
      {
        id: 1,
        doctor: { last: "Watson", first: "John" },
        shift_details: { id: 1 },
        rotation_order: 0,
        turn: 0,
        patient: 1,
      },
      {
        id: 2,
        doctor: { last: "McCoy", first: "Leonard" },
        shift_details: { id: 2 },
        rotation_order: 1,
        turn: 0,
        patient: 2,
      },
      {
        id: 3,
        doctor: { last: "Blake", first: "Kelly" },
        shift_details: { id: 7 },
        rotation_order: 2,
        turn: 0,
        patient: 0,
      },
      {
        id: 4,
        doctor: { last: "Nicolai", first: "Rocki" },
        shift_details: { id: 7 },
        rotation_order: 3,
        turn: 0,
        patient: 1,
      },
      { id: 5, rotation_order: 4 },
    ],
    off_rotation: [{ id: 3 }],
    ft_rotation: [{ id: 4 }],
  });

  sinon.stub(db, "getDoctors");
  db.getDoctors.returns([{ first: "Jeremy", last: "Voros" }]);

  const d = new Date();
  const state = new State();

  describe("# initialize()", () => {
    it("should initialize with appropriate starting properties", async () => {
      // db calls returning mocked values
      const shape = {
        timeline: [],
        pointer: 0,
        date: d.toLocaleDateString("fr-CA", { timeZone: "America/Denver" }),
        shift_details: db.getShiftDetails(),
        shifts: db.getShifts(),
        doctors: db.getDoctors(),
        initialized: true,
      };
      await state.initialize();
      expect(state).to.deep.equal(shape);
    });
  });

  describe("# refreshShifts", () => {
    it("should update state.shifts", async () => {
      state.shifts = {};
      await state.refreshShifts();
      expect(state.shifts).to.deep.equal(db.getShifts());
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

    it("should get doctor name for shift != 0", () => {
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
    it("should add a 'skip' action to timeline with pointer shift and doctor", () => {
      state.pointer = 1;
      state.skip();
      expect(state.timeline[0].action).to.equal("skip");
      expect(state.timeline[0].shift_id).to.equal(2);
      expect(state.timeline[0].doctor).to.deep.equal({
        last: "McCoy",
        first: "Leonard",
      });
    });

    it("should advance the pointer", () => {
      expect(state.pointer).to.equal(2);
    });
  });

  describe("# goback()", () => {
    it("should add a 'back' action to timeline with pointer shift and doctor", () => {
      state.pointer = 0;
      state.goback();
      expect(state.timeline[0].action).to.equal("back");
      expect(state.timeline[0].shift_id).to.equal(1);
      expect(state.timeline[0].doctor).to.deep.equal({
        last: "Watson",
        first: "John",
      });
    });

    it("should lower the pointer", () => {
      expect(state.pointer).to.equal(4);
    });
  });

  describe("# assignPatient", async () => {
    before(() => {
      // sinon.stub(state, "newAction");
      // sinon.stub(state, "refreshShifts");
      sinon.stub(state, "increment");
    });

    after(() => {
      // state.newAction.restore();
      // state.refreshShifts.restore();
      state.increment.restore();
    });

    it("should call increment", async () => {
      state.pointer = 0;
      await state.assignPatient("JJ");
      expect(state.increment.calledOnce).to.be.true;
    });

    it("should not have moved pointer if day shift bonus < 2", () => {
      expect(state.pointer).to.equal(0);
    });

    it("should move pointer if day shift bonus >=2", async () => {
      state.pointer = 1;
      await state.assignPatient("JJ");
      expect(state.pointer).to.equal(2);
    });

    it("should not move pointer if night shift bonus < 1", async () => {
      state.pointer = 2;
      await state.assignPatient();
      expect(state.pointer).to.equal(2);
    });

    it("should move pointer if night shift bonus >= 1", async () => {
      state.pointer = 3;
      await state.assignPatient();
      expect(state.pointer).to.equal(4);
    });
  });

  describe("# undoLastAssign", () => {
    before(async () => {
      sinon.stub(state, "decrement");
      state.pointer = 2;
      state.timeline = [
        { action: "pit", message: "pit" },
        {
          action: "patient",
          message: "patient1",
          shift_id: 1,
          turn: true,
          pointer: true,
        },
        { action: "patient", message: "patient2" },
      ];
      await state.undoLastAssign();
      return;
    });

    after(() => {
      state.decrement.restore();
    });

    it("should remove the earliest patient assignment from timeline", async () => {
      expect(state.timeline.length).to.equal(2);
      expect(state.timeline[1].message).to.equal("patient2");
    });

    it("should call decrement with shift_id, patient, and turn", () => {
      expect(state.decrement.calledOnceWith(1, "patient", true)).to.be.true;
    });

    it("should decrement pointer only if pointer flag", () => {
      expect(state.pointer).to.equal(1);
      state.undoLastAssign();
      expect(state.pointer).to.equal(1);
    });
  });

  describe("newRotationOrdersOnNew", () => {
    beforeEach(() => {
      state.shifts = db.getShifts();
      state.pointer = 2;
    });

    after(() => {
      state.shifts = db.getShifts();
      state.pointer = 0;
    });

    it("should return an array of objects with id and rotation_order", () => {
      const newOrder = state.newRotationOrdersOnNew();
      const keyCheck = newOrder.every(
        (s) =>
          JSON.stringify(Object.keys(s)) ==
          JSON.stringify(["id", "rotation_order"])
      );
      expect(keyCheck).to.be.true;
    });

    it("should only increase rotation_order if >= pointer", () => {
      const newOrder = state.newRotationOrdersOnNew();
      const orderCheck = newOrder.map((s) => s.rotation_order);
      expect(JSON.stringify(orderCheck)).to.equal(
        JSON.stringify([0, 1, 3, 4, 5])
      );
    });
  });
});
