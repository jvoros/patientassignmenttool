import { describe, expect, it, vi } from "vitest";
import Event from "../core/event.js";
import db from "../core/db.js";

describe("# Event Module", () => {
  // mocks
  const dbMocks = {
    addSpy: vi.spyOn(db, "addEvent").mockResolvedValue("newEventId"),
    updateSpy: vi.spyOn(db, "updateEvent").mockResolvedValue("newEventId"),
    deleteSpy: vi.spyOn(db, "deleteEvent").mockResolvedValue("deletedId"),
    deletePtSpy: vi.spyOn(db, "deletePatient").mockResolvedValue("deleted pt"),
    deleteShiftSpy: vi
      .spyOn(db, "deleteShift")
      .mockResolvedValue("deleted shift"),
    getLastStateSpy: vi
      .spyOn(db, "getLastState")
      .mockResolvedValue("new state"),
  };
  const testState = { events: [...Array(50).keys()] };

  describe("addToState", () => {
    it("adds new eventId to start of event array and limits to 30 items", async () => {
      const stateWithEvent = await Event.addToState(testState, "test", {
        shiftId: 1,
        patientId: 4,
      });
      expect(stateWithEvent.events[0]).toEqual("newEventId");
      expect(stateWithEvent.events.length).toBe(30);
    });

    it("calls addEvent and updateEvent with appropriate params", async () => {
      const stateWithEvent = await Event.addToState(testState, "test", {
        test: "test",
      });
      expect(dbMocks.addSpy).toHaveBeenCalledWith("test", { test: "test" });
      expect(dbMocks.updateSpy).toHaveBeenCalledWith(
        "newEventId",
        stateWithEvent
      );
    });
  });

  describe("undo", () => {
    it("deletes the event and then gets last state", async () => {
      const event = { id: 1, event_type: "board" };
      const stateAfterDelete = await Event.undo({}, event);
      expect(dbMocks.deleteSpy).toBeCalled();
      expect(stateAfterDelete).toBe("new state");
    });

    it("also deletes patient for assignPatient types", async () => {
      const event = { id: 1, event_type: "assignPatient", patient: { id: 1 } };

      const stateAfterDelete = await Event.undo({}, event);
      expect(dbMocks.deletePtSpy).toBeCalled();
    });

    it("also deletes shift for addShift types", async () => {
      const event = { id: 1, event_type: "addShift", shift: { id: 1 } };
      const stateAfterDelete = await Event.undo({}, event);
      expect(dbMocks.deletePtSpy).toBeCalled();
    });
  });
});
