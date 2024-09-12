import { afterEach, describe, expect, it, vi } from "vitest";
import Patient, { handleReassignSupervisor } from "../core/patient.js";
import Event from "../core/event.js";
import db from "../core/db.js";

describe("# Patient Module", () => {
  // mocks
  // event
  const eventSpy = vi
    .spyOn(Event, "addToState")
    .mockResolvedValue("event added to state");
  // utility to get first param sent to Event.addState, then clear it so can check again later
  const getEventState = () => {
    const state = eventSpy.mock.calls[0][0];
    eventSpy.mockClear();
    return state;
  };
  // db
  const addSpy = vi.spyOn(db, "addPatient").mockResolvedValue("newPt");
  const updateSpy = vi.spyOn(db, "updatePatient").mockResolvedValue("updatePt");
  // state
  const state = {
    main: [
      { id: 1, type: "app" },
      { id: 2, type: "physician" },
      { id: 3, type: "physician" },
      { id: 4, type: "app" },
    ],
    nextProvider: 1,
    nextSupervisor: 3,
  };

  const shiftFromClient = {
    id: 1,
    type: "app",
    info: { bonus: 0 },
    patients: { count: 2 },
  };

  afterEach(() => {
    addSpy.mockClear();
    eventSpy.mockClear();
  });

  describe("assignPatient", () => {
    it("should call db.addPatient and Event.addToState", async () => {
      const newState = await Patient.assignPatient(
        state,
        shiftFromClient,
        "walk in",
        "Tr A"
      );

      expect(addSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalled();
    });

    it("should also assign supervisor if shift is app", async () => {
      const newState = Patient.assignPatient(
        state,
        shiftFromClient,
        "walk in",
        "Tr A"
      );
      expect(addSpy.mock.calls[0][3].supervisorId).toBe(3);
    });

    it("should advance nextProvider when assigning to APP", async () => {
      const newState = await Patient.assignPatient(
        state,
        shiftFromClient,
        "walk in",
        "Tr A"
      );
      expect(getEventState().nextProvider).toBe(2);
    });

    it("should advance nextSupervisor when assigning to APP", async () => {
      const newState = await Patient.assignPatient(
        state,
        shiftFromClient,
        "walk in",
        "Tr A"
      );
      expect(getEventState().nextSupervisor).toBe(2);
    });

    it("should not advance nextPatient for doc unless count >= bonus", async () => {
      const testShift = {
        id: 2,
        type: "physician",
        info: { bonus: 2 },
        patients: { count: 0 },
      };
      const testShift2 = {
        id: 2,
        type: "physician",
        info: { bonus: 2 },
        patients: { count: 2 },
      };
      const state2 = structuredClone(state);
      state2.nextProvider = 2;
      const newState = await Patient.assignPatient(
        state2,
        testShift,
        "walk in",
        "4"
      );

      expect(getEventState().nextProvider).toBe(2);
      const newState2 = await Patient.assignPatient(
        state2,
        testShift2,
        "w",
        "4"
      );
      expect(getEventState().nextProvider).toBe(3);
    });
  });

  describe("reassignPatient", () => {
    it("should call db.updatePatient and Event.addToState", async () => {
      const newState = await Patient.reassignPatient(
        state,
        {
          shift: { provider: { id: 1, role: "app" } },
          patient: { id: 3 },
        },
        { id: 12, provider: { id: 4, role: "app" } }
      );
      expect(updateSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe("handleReassignSupervisor", () => {
    // handleReassign
    const doc1 = { id: 2, provider: { id: 3, role: "physician" } };
    const doc2 = { id: 3, provider: { id: 1, role: "physician" } };
    const app1 = { id: 1, provider: { id: 4, role: "app" } };
    const app2 = { id: 4, provider: { id: 5, role: "app" } };
    it("should handle doc to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        state,
        doc1,
        doc2
      );
      expect(newSupervisorId).toBe(state.nextSupervisor);
    });
    it("should handle app to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        state,
        app1,
        doc2
      );
      expect(newSupervisorId).toBe(state.nextSupervisor);
    });
    it("should handle app to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        state,
        doc2,
        app2
      );
      expect(newSupervisorId).toBe(doc2.id);
    });
    it("should handle app to app reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        state,
        app1,
        app2
      );
      expect(newSupervisorId).toBe(state.nextSupervisor);
    });
  });
});
