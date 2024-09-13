import { afterEach, describe, expect, it, vi } from "vitest";
import Shift from "../core/src/shift";
import Event from "../core/src/event";
import db from "../core/src/db";

describe("# Shift Module", () => {
  // MOCKS
  const emptyState = {
    main: [],
    flex: [],
    off: [],
    events: [],
    nextFt: null,
    nextProvider: null,
    nextSupervisor: null,
  };

  const fullState = {
    main: [
      { id: 9, type: "physician" },
      { id: 10, type: "physician" },
      { id: 20, type: "app" },
    ],
    flex: [{ id: 21, type: "app" }],
    off: [],
    events: [],
    nextFt: 21,
    nextProvider: 10,
    nextSupervisor: 9,
  };

  const newProvider = {
    id: 1,
    lname: "Voros",
    fname: "Jeremy",
    role: "physician",
  };

  const newApp = {
    id: 2,
    lname: "Cheever",
    fname: "Shelley",
    role: "app",
  };

  const mockShifts = [
    {
      id: 326,
      type: "physician",
      info: { bonus: 2 },
      provider: newProvider,
      patients: { count: 0 },
    },
    {
      id: 3827,
      type: "app",
      info: { bonus: 0 },
      provider: newApp,
      patients: { count: 0 },
    },
    {
      id: 326,
      type: "physician",
      info: { bonus: 2 },
      provider: newProvider,
      patients: { count: 2 },
    },
  ];
  const myMocks = {
    // use scheduleId as flag for mocking to decide which test shift to return
    // not at all how real db implementation will work
    addShift: vi
      .spyOn(db, "addShift")
      .mockImplementation(
        async (providerId, scheduleId) => mockShifts[scheduleId]
      ),
    // rather than add event, just return the newState that was passed to this final function
    addEvent: vi
      .spyOn(Event, "addToState")
      .mockImplementation(async (state, options) => state),
  };

  describe("addShift()", () => {
    it("should set provider to next on add", async () => {
      // uses db.addShift mock to return specified shift
      const newState = await Shift.addShift(emptyState, newProvider, 0);
      expect(newState.nextProvider).toBe(326);
    });
    it("should add doc to start if main is empty", async () => {
      const newState = await Shift.addShift(emptyState, newProvider, 0);
      expect(newState.main[0].id).toBe(326);
    });
    it("should add doc at nextProvider index if main is not empty", async () => {
      const newState = await Shift.addShift(fullState, newProvider, 0);
      expect(newState.main[1].id).toBe(326);
    });
    it("should add APP to flex zone", async () => {
      const newState = await Shift.addShift(emptyState, newApp, 1);
      expect(newState.flex[0].id).toBe(3827);
    });
    it("should add APP to FT only if FT empty", async () => {
      const newState = await Shift.addShift(emptyState, newApp, 1);
      expect(newState.nextFt).toBe(3827);
      const final = await Shift.addShift(fullState, newApp, 1);
      expect(final.nextFt).toBe(21);
    });
  });
  describe("flexOn()", () => {
    it("should remove from flex and add to main at nextProvider index", async () => {
      const newState = await Shift.flexOn(fullState, { id: 21, type: "app" });
      expect(newState.flex.length).toBe(0);
      expect(newState.main[1].id).toBe(21);
    });
    it("should set provider to nextProvider", async () => {
      const newState = await Shift.flexOn(fullState, { id: 21, type: "app" });
      expect(newState.nextProvider).toBe(21);
    });
  });
  describe("flexOff()", () => {
    it("should remove from main and add to flex", async () => {
      const newState = await Shift.flexOff(fullState, { id: 20, type: "app" });
      expect(newState.main.length).toBe(2);
      expect(newState.flex.length).toBe(2);
    });
    it("should advance nextProvider if leaving APP is up next", async () => {
      const fullState2 = { ...fullState, nextProvider: 20 };
      const newState = await Shift.flexOff(fullState2, { id: 20, type: "app" });
      expect(newState.nextProvider).not.toBe(20);
    });
  });
  describe("joinFt()", () => {
    it("should only add to FT if FT empty", async () => {
      const newState = await Shift.joinFt(fullState, 20);
      expect(newState.nextFt).toBe(20);
    });
    it("should leave APP on Flex", async () => {
      const state = { ...fullState, nextFt: null };
      const newState = await Shift.joinFt(state, 21);
      expect(newState.flex[0].id).toBe(21);
    });
  });
  describe("leaveFt()", () => {
    it("should remove APP from FT", async () => {
      const newState = await Shift.leaveFt(fullState, 21);
      expect(newState.nextFt).toBeNull();
    });
  });
  describe("signOut()", () => {
    it("should not remove last doctor", async () => {
      const newState = await Shift.addShift(emptyState, newProvider, 0);
      const final = await Shift.signOut(newState, {
        id: 326,
        type: "physician",
      });
      expect(newState.main[0].id).toBe(326);
    });
    it("should move doc off main and to off", async () => {
      const newState = await Shift.signOut(fullState, {
        id: 9,
        type: "physician",
      });
      expect(newState.off[0].id).toBe(9);
      expect(newState.main.length).toBe(2);
    });
    it("should not advance nexts if leaving provider isn't next", async () => {
      const newState = await Shift.signOut(fullState, {
        id: 9,
        type: "physician",
      });
      expect(newState.nextProvider).toBe(10);
    });
    it("should advance nextProvider and nextSupervisor if leaving doc is next", async () => {
      const testState = { ...fullState, nextProvider: 9 };
      const newState = await Shift.signOut(testState, {
        id: 9,
        type: "physician",
      });
      expect(newState.nextProvider).not.toBe(9);
      expect(newState.nextSupervisor).not.toBe(9);
    });
    it("should remove APP from main, flex, ft", async () => {
      const newState = await Shift.signOut(fullState, { id: 20, type: "app" });
      expect(newState.off.length).toBe(1);
      const final = await Shift.signOut(newState, { id: 21, type: "app" });
      expect(final.off.length).toBe(2);
      expect(final.nextFt).toBeNull();
    });
    it("should only advance nextProvider if APP leaving", async () => {
      const testState = { ...fullState, nextProvider: 20 };
      const newState = await Shift.signOut(testState, { id: 20, type: "app" });
      expect(newState.nextProvider).not.toBe(20);
    });
  });
  describe("rejoin()", () => {
    it("should move doctor from off to main", async () => {
      const off = await Shift.signOut(fullState, { id: 9, type: "physician" });
      expect(off.off.length).toBe(1);
      const state = await Shift.rejoin(off, { id: 9, type: "physician" });
      expect(state.main.length).toBe(3);
    });
    it("should move app from off to flex and/or ft", async () => {
      const off = await Shift.signOut(fullState, { id: 21, type: "app" });
      expect(off.flex.length).toBe(0);
      const state = await Shift.rejoin(off, { id: 21, type: "app" });
      expect(state.flex.length).toBe(1);
    });
  });
});
