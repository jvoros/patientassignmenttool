import { describe, expect, it, vi } from "vitest";
import Rotation from "../core/rotation.js";
import Event from "../core/event.js";

describe("# Rotation Module", () => {
  // mocks
  const eventSpy = vi
    .spyOn(Event, "addToState")
    .mockResolvedValue("event added to state");
  // utility to get first param sent to Event.addState, then clear it so can check again later
  const getStateParam = () => {
    const state = eventSpy.mock.calls[0][0];
    eventSpy.mockClear();
    return state;
  };

  const board = {
    state: {
      main: [1, 2, 3, 4],
      nextProvider: 1,
      nextSupervisor: 3,
    },
    store: {
      main: [
        { id: 1, type: "app" },
        { id: 2, type: "physician" },
        { id: 3, type: "physician" },
        { id: 4, type: "app" },
      ],
    },
  };

  const board2 = structuredClone(board);
  board2.state.nextProvider = 4;

  describe("getNextShiftId", () => {
    it("should get next provider id", async () => {
      const nextId = Rotation.getNextShiftId(board, "nextProvider");
      expect(nextId).toBe(2);
    });

    it("should wrap around end of list for next provider", async () => {
      const nextId = Rotation.getNextShiftId(board2, "nextProvider");
      expect(nextId).toBe(1);
    });

    it("should skip app shifts for next supervisor, and wrap around", async () => {
      const nextId = Rotation.getNextShiftId(board, "nextSupervisor");
      expect(nextId).toBe(2);
    });
  });
  describe("moveNext", () => {
    it("should move nextProvider forward and back", () => {
      const newState = Rotation.moveNext(board, "nextProvider");
      expect(getStateParam().nextProvider).toBe(2);
      const backState = Rotation.moveNext(board, "nextProvider", -1);
      expect(getStateParam().nextProvider).toBe(4);
    });

    it("should move nextSupervisor forward", () => {
      const newState = Rotation.moveNext(board, "nextSupervisor");
      expect(getStateParam().nextSupervisor).toBe(2);
    });

    it("should move nextSupervisor backward", () => {
      const newBoard = structuredClone(board);
      newBoard.state.nextSupervisor = 2;
      const backState = Rotation.moveNext(newBoard, "nextSupervisor", -1);
      expect(getStateParam().nextSupervisor).toBe(3);
    });
  });
  describe("moveShiftInRotation", () => {
    it("should move shift forward in rotation", () => {
      const newState = Rotation.moveShiftInRotation(board, 4);
      expect(getStateParam().main[0]).toBe(4);
    });
    it("should move shift backward in rotation", () => {
      console.log(board);
      const newState = Rotation.moveShiftInRotation(board, 1, -1);
      expect(getStateParam().main[3]).toBe(1);
    });
  });
});
