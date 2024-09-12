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
  // board
  const board = {
    state: {
      main: [1, 2, 3, 4],
      nextProvider: 1,
      nextSupervisor: 3,
    },
    store: {
      main: [
        {
          id: 1,
          type: "app",
          provider: { id: 2, lname: "Cheever", role: "app" },
          info: { bonus: 0 },
          counts: { total: 0 },
        },
        {
          id: 2,
          type: "physician",
          provider: { id: 1, lname: "Voros", role: "physician" },
          info: { bonus: 0 },
          counts: { total: 0 },
        },
        {
          id: 3,
          type: "physician",
          provider: { id: 3, lname: "Blake", role: "physician" },
        },
        {
          id: 4,
          type: "app",
          provider: { id: 2, lname: "Kasavana", role: "app" },
        },
      ],
    },
  };

  afterEach(() => {
    addSpy.mockClear();
    eventSpy.mockClear();
  });

  describe("assignPatient", () => {
    it("should call db.addPatient and Event.addToState", async () => {
      const newState = await Patient.assignPatient(
        board,
        board.store.main[0],
        "walk in",
        "Tr A"
      );

      expect(addSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalled();
    });

    it("should also assign supervisor if shift is app", async () => {
      const newState = Patient.assignPatient(
        board,
        board.store.main[0],
        "walk in",
        "Tr A"
      );
      expect(addSpy.mock.calls[0][3].supervisorId).toBe(3);
    });

    it("should advance nextProvider when assigning to APP", async () => {
      const newState = await Patient.assignPatient(
        board,
        board.store.main[0],
        "walk in",
        "Tr A"
      );
      expect(getEventState().nextProvider).toBe(2);
    });

    it("should advance nextSupervisor when assigning to APP", async () => {
      const newState = await Patient.assignPatient(
        board,
        board.store.main[0],
        "walk in",
        "Tr A"
      );
      expect(getEventState().nextSupervisor).toBe(2);
    });

    it("should not advance nextPatient for doc unless count >= bonus", async () => {
      const shift = {
        id: 2,
        type: "physician",
        info: { bonus: 2 },
        counts: { total: 0 },
      };
      const shift2 = {
        id: 2,
        type: "physician",
        info: { bonus: 2 },
        counts: { total: 2 },
      };
      const board2 = structuredClone(board);
      board2.state.nextProvider = 2;
      const newState = await Patient.assignPatient(
        board2,
        shift,
        "walk in",
        "4"
      );

      expect(getEventState().nextProvider).toBe(2);
      const newState2 = await Patient.assignPatient(board2, shift2, "w", "4");
      expect(getEventState().nextProvider).toBe(3);
    });
  });

  describe("handleReassignSupervisor", () => {
    // handleReassign
    const doc1 = board.store.main[1];
    const doc2 = board.store.main[2];
    const app1 = board.store.main[0];
    const app2 = board.store.main[3];
    it("should handle doc to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        board,
        doc1,
        doc2
      );
      expect(newState.supervisorId).toBe(board.state.supervisorId);
    });
    it("should handle app to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        board,
        app1,
        doc2
      );
      expect(newState.supervisorId).toBe(board.state.supervisorId);
    });
    it("should handle app to doc reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        board,
        doc2,
        app2
      );
      expect(newSupervisorId).toBe(doc2.id);
    });
    it("should handle app to app reassign", () => {
      const { newSupervisorId, newState } = handleReassignSupervisor(
        board,
        app1,
        app2
      );
      expect(newSupervisorId).toBe(board.state.nextSupervisor);
    });
  });

  describe("reassignPatient", () => {
    it("should call db.updatePatient", async () => {
      const newState = await Patient.reassignPatient(
        board,
        { shift: { provider: { id: 1, role: "app" } }, patient: { id: 3 } },
        board.store.main[0]
      );
      expect(updateSpy).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalled();
    });
  });
});
