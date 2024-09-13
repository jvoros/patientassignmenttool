import { describe, expect, it, vi } from "vitest";
import Event from "../core/event";
import db from "../core/db.js";

describe("# Event Module", () => {
  // mocks
  const dbMocks = {
    addSpy: vi.spyOn(db, "addEvent").mockResolvedValue(1234),
    updateSpy: vi.spyOn(db, "updateEvent").mockResolvedValue(4321),
    deleteSpy: vi.spyOn(db, "deleteEvent").mockResolvedValue(0),
    deletePtSpy: vi.spyOn(db, "deletePatient").mockResolvedValue(0),
    deleteShiftSpy: vi.spyOn(db, "deleteShift").mockResolvedValue(0),
    getLastStateSpy: vi
      .spyOn(db, "getLastState")
      .mockResolvedValue("new state"),
  };
  const testState = {
    main: [],
    flex: [],
    off: [],
    nextFt: 1,
    nextProvider: 1,
    nextSupervisor: 1,
    events: [...Array(50).keys()],
  };

  describe("addToState", () => {
    it("adds new eventId to start of event array and limits to 30 items", async () => {
      const stateWithEvent = await Event.addToState(testState, {
        type: "test",
        shiftId: 1,
        patientId: 4,
      });
      expect(stateWithEvent.events[0]).toEqual(1234);
      expect(stateWithEvent.events.length).toBe(30);
    });

    it("calls addEvent and updateEvent with appropriate params", async () => {
      const stateWithEvent = await Event.addToState(testState, {
        type: "test",
      });
      expect(dbMocks.addSpy).toHaveBeenCalledWith({ type: "test" });
      expect(dbMocks.updateSpy).toHaveBeenCalledWith(1234, stateWithEvent);
    });
  });

  describe("undo", () => {
    it("deletes the event and then gets last state", async () => {
      const event = { id: 1, event_type: "board" };
      const stateAfterDelete = await Event.undo(testState, event);
      expect(dbMocks.deleteSpy).toBeCalled();
      expect(stateAfterDelete).toBe("new state");
    });

    it("also deletes patient for assignPatient types", async () => {
      const event = { id: 1, event_type: "assignPatient", patient: { id: 1 } };
      const stateAfterDelete = await Event.undo(testState, event);
      expect(dbMocks.deletePtSpy).toBeCalled();
    });

    it("also deletes shift for addShift types", async () => {
      const event = { id: 1, event_type: "addShift", shift: { id: 1 } };
      const stateAfterDelete = await Event.undo(testState, event);
      expect(dbMocks.deletePtSpy).toBeCalled();
    });
  });
});
