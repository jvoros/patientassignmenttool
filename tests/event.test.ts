import { describe, expect, it } from "vitest";
import Event from "../core/event.js";

const ev = Event.make({
  message: "test event message",
});

const patches: Patch[] = [
  {
    op: "add",
    path: [1, 2],
    value: "lorem",
  },
  {
    op: "remove",
    path: ["a"],
    value: "dolor",
  },
];

describe("Event Controller", () => {
  it("should make Events", () => {
    expect(ev.id).toBeDefined();
    expect(ev.patches).toBeDefined();
    expect(ev.time).toBeDefined();
    expect(ev.message).toBeDefined();
  });
  it("should add Reassign info", () => {
    Event.addReassign({ priorEvent: ev, newProvider: "Julius Irving" });
    expect(ev.note!.includes("Julius")).toBeTruthy();
  });
  it("should add patches", () => {
    expect(ev.patches.length).toBe(0);
    Event.addPatches({ event: ev, patches });
    expect(ev.patches.length).toBeGreaterThan(0);
  });
  it("should change rooms", () => {
    Event.changeRoom({ event: ev, newRoom: "new room" });
    expect(ev.room).toEqual("new room");
  });
});
