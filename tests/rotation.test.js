import { describe, expect, it, vi } from "vitest";
import Rotation from "../core/rotation.js";
import Event from "../core/event.js";

describe("# Rotation Module", () => {
  // mocks
  const eventSpy = vi
    .spyOn(Event, "addToState")
    .mockImplementation((state) => state);

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
    it("should move next");
  });
  describe("moveShiftInRotation", () => {
    it("should move shift in rotation");
  });
});
