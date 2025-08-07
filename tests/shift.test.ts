import { describe, expect, it, expectTypeOf } from "vitest";
import Shift from "../core/shift.js";
import dummy from "./dummy.js";

const schedule = dummy.schedules[0];
const provider = dummy.providers[0];
const testshift = Shift.make({ schedule, provider });

describe("Shift Controller", () => {
  describe("Make", () => {
    it("should make Shift objects from ScheduleItems and Providers", () => {
      expect(testshift).toBeDefined();
    });
    it("should make Shifts with an id", () => {
      expect(testshift.id).toBeDefined();
    });
    it("should make Shifts with a shift name", () => {
      expect(testshift.name).toBeDefined();
    });
    it("should make Shifts with a provider first and last name", () => {
      expect(testshift.first).toBeDefined();
      expect(testshift.last).toBeDefined();
    });
  });

  describe("Add and Remove Patients", () => {
    it("should add and remove assigned patients", () => {
      Shift.adjustCount({ shift: testshift, type: "assigned", amount: 1 });
      expect(testshift.assigned).toEqual(1);
      Shift.adjustCount({ shift: testshift, type: "assigned", amount: -1 });
      expect(testshift.assigned).toEqual(0);
    });
    it("should add and remove supervised patients", () => {
      Shift.adjustCount({ shift: testshift, type: "supervised", amount: 1 });
      expect(testshift.supervised).toEqual(1);
      Shift.adjustCount({ shift: testshift, type: "supervised", amount: -1 });
      expect(testshift.supervised).toEqual(0);
    });
  });

  describe("Adjust Status", () => {
    it("should pause and unpause", () => {
      Shift.changeStatus({ shift: testshift, status: "paused" });
      expect(testshift.status).toBe("paused");
      Shift.changeStatus({ shift: testshift, status: "active" });
      expect(testshift.status).toBe("active");
    });
    it("should set and unset skip", () => {
      Shift.changeStatus({ shift: testshift, status: "skip" });
      expect(testshift.status).toBe("skip");
      Shift.changeStatus({ shift: testshift, status: "active" });
      expect(testshift.status).toBe("active");
    });
  });

  describe("Handle Bonus", () => {
    it("should have starting bonus", () => {
      expect(testshift.bonus).toEqual(2);
    });
    it("should not decrease bonus below 0", () => {
      Shift.decrementBonus(testshift);
      expect(testshift.bonus).toEqual(1);
      Shift.decrementBonus(testshift);
      Shift.decrementBonus(testshift);
      Shift.decrementBonus(testshift);
      expect(testshift.bonus).toEqual(0);
    });
  });
});
