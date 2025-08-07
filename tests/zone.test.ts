import { describe, expect, it, expectTypeOf, beforeEach } from "vitest";
import Zone from "../core/zone.js";
import Shift from "../core/shift.js";
import dummy from "./dummy.js";

// shifts not under test, won't be changed, can be global
const docShift1 = Shift.make({ provider: dummy.providers[0], schedule: dummy.schedules[0] });
const docShift2 = Shift.make({ provider: dummy.providers[2], schedule: dummy.schedules[2] });
const appShift1 = Shift.make({ provider: dummy.providers[1], schedule: dummy.schedules[1] });

// make test zone and shift index with three shifts
// after all shifts added, shift order:
// [doc2, doc1, app1]
// next: 0
// super: 0
const getTestZone = () => {
  const zone = Zone.make(dummy.zones[0]);
  // spread syntax to clone new shift, ids match original shifts
  const app1 = { ...appShift1 };
  const doc1 = { ...docShift1 };
  const doc2 = { ...docShift2 };
  Zone.joinZone({ zone: zone, shift: app1 });
  Zone.joinZone({ zone: zone, shift: doc1 });
  Zone.joinZone({ zone: zone, shift: doc2 });
  const shifts = {
    [app1.id]: app1,
    [doc1.id]: doc1,
    [doc2.id]: doc2,
  };
  return { testZone: zone, testShifts: shifts };
};

// add types for vitest context
declare module "vitest" {
  interface TestContext {
    zone?: Zone;
    superId?: Shift["id"];
    shifts: IndexShift;
  }
}

describe("Zone Controller", () => {
  describe("Make Zone", () => {
    it("should make Zone objects from ZoneMakeParams", () => {
      const zone = Zone.make(dummy.zones[0]);
      expectTypeOf(zone).toEqualTypeOf<Zone>();
    });
  });

  describe("Join Zones", () => {
    it("should only add shifts once", () => {
      const zoneList = Zone.make(dummy.zones[2]);
      Zone.joinZone({ zone: zoneList, shift: docShift1 });
      Zone.joinZone({ zone: zoneList, shift: docShift1 });
      expect(zoneList.shifts.length).toEqual(1);
    });
    it("List Zones: should add shift at end", () => {
      const zoneList = Zone.make(dummy.zones[2]);
      Zone.joinZone({ zone: zoneList, shift: docShift1 });
      Zone.joinZone({ zone: zoneList, shift: docShift2 });
      expect(zoneList.shifts[1]).toEqual(docShift2.id);
    });
    it("Simple Zones: should add at start", () => {
      const zoneSimple = Zone.make(dummy.zones[1]);
      Zone.joinZone({ zone: zoneSimple, shift: docShift1 });
      Zone.joinZone({ zone: zoneSimple, shift: docShift2 });
      expect(zoneSimple.shifts[0]).toEqual(docShift2.id);
    });
    it("Rotation Zone: should add at next pointer", () => {
      const zoneRotation = Zone.make(dummy.zones[3]);
      Zone.joinZone({ zone: zoneRotation, shift: docShift1 });
      Zone.joinZone({ zone: zoneRotation, shift: docShift2 });
      zoneRotation.next = 1; // manually advance pointer
      Zone.joinZone({ zone: zoneRotation, shift: appShift1 });
      expect(zoneRotation.shifts[1]).toEqual(appShift1.id);
      expect(zoneRotation.shifts.length).toEqual(3);
    });
    it("Dual Zone: should add at next pointer", () => {
      const zoneDual = Zone.make(dummy.zones[0]);
      Zone.joinZone({ zone: zoneDual, shift: docShift1 });
      Zone.joinZone({ zone: zoneDual, shift: appShift1 });
      zoneDual.next = 1; // manually advance pointer
      Zone.joinZone({ zone: zoneDual, shift: docShift2 });
      expect(zoneDual.shifts[1]).toEqual(docShift2.id);
    });
    it("Dual Zone: should only add super for first physician to join", () => {
      const zoneDual = Zone.make(dummy.zones[0]);
      Zone.joinZone({ zone: zoneDual, shift: appShift1 });
      expect(zoneDual.super).toBeNull();
      Zone.joinZone({ zone: zoneDual, shift: docShift1 });
      expect(zoneDual.super).toEqual(0);
    });
  });

  describe("Leave Zones", () => {
    it("should remove shift from Zone shifts", () => {
      const zoneSimple = Zone.make(dummy.zones[1]);
      const shifts = { [docShift1.id]: docShift1 };
      Zone.joinZone({ zone: zoneSimple, shift: docShift1 });
      Zone.leaveZone({ zone: zoneSimple, leaveShiftId: docShift1.id, shifts });
      expect(zoneSimple.shifts.length).toEqual(0);
    });
    it("should not change which shifts are pointed to when shift leaving is before pointed shift", () => {
      const { testZone, testShifts } = getTestZone();
      testZone.next = 2; // manually advance pointer
      Zone.leaveZone({ zone: testZone, leaveShiftId: docShift1.id, shifts: testShifts });
      expect(testZone.shifts[testZone.next]).toEqual(appShift1.id);
    });
    it("should not change which shifts are pointed to when shift leaving is after pointed shift", () => {
      const { testZone, testShifts } = getTestZone();
      testZone.next = 1; // manually advance pointer
      Zone.leaveZone({ zone: testZone, leaveShiftId: appShift1.id, shifts: testShifts });
      expect(testZone.shifts[testZone.next]).toEqual(docShift1.id);
    });
    it("should advance next pointer if leaving shift is next", () => {
      const { testZone, testShifts } = getTestZone();
      testZone.next = 1;
      Zone.leaveZone({ zone: testZone, leaveShiftId: docShift1.id, shifts: testShifts });
      expect(testZone.shifts[testZone.next]).toEqual(appShift1.id);
    });
    it("should advance super pointer if leaving shift is super", () => {
      const { testZone, testShifts } = getTestZone();
      testZone.next = 1;
      Zone.leaveZone({ zone: testZone, leaveShiftId: docShift1.id, shifts: testShifts });
      expect(testZone.shifts[testZone.super!]).toEqual(docShift2.id);
    });
    it("should set next to null if leaving shift is last shift", () => {
      const zoneDual = Zone.make(dummy.zones[0]);
      Zone.joinZone({ zone: zoneDual, shift: appShift1 });
      const shifts = {
        [appShift1.id]: appShift1,
      };
      zoneDual.next = 1;
      Zone.leaveZone({ zone: zoneDual, leaveShiftId: appShift1.id, shifts });
      expect(zoneDual.shifts[zoneDual.next]).toBeFalsy();
    });

    it("should set super to null if leaving shift is last super", () => {
      const zoneDual = Zone.make(dummy.zones[0]);
      Zone.joinZone({ zone: zoneDual, shift: appShift1 });
      Zone.joinZone({ zone: zoneDual, shift: docShift1 });
      const shifts = {
        [appShift1.id]: appShift1,
        [docShift1.id]: docShift1,
      };
      Zone.leaveZone({ zone: zoneDual, leaveShiftId: docShift1.id, shifts });
      expect(zoneDual.shifts[zoneDual.super!]).toBeFalsy();
    });
  });

  describe("Move Pointer", () => {
    it.todo("should only move pointer for zones that have that kind of pointer");
    it("should move pointer forward and backward, loop over ends", () => {
      const { testZone, testShifts } = getTestZone();
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: 1 });
      expect(testZone.next).toEqual(1);
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: -1 });
      expect(testZone.next).toEqual(0);
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: -1 });
      expect(testZone.next).toEqual(2);
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: 1 });
      expect(testZone.next).toEqual(0);
    });
    it("should handle skip shifts and toggle skip", () => {
      const { testZone, testShifts } = getTestZone();
      testShifts[docShift1.id].status = "skip";
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: 1 });
      expect(testZone.next).toEqual(2);
      expect(testShifts[docShift1.id].status).toEqual("active");
    });
    it("should skip paused shifts", () => {
      const { testZone, testShifts } = getTestZone();
      testShifts[docShift1.id].status = "paused";
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "next", offset: 1 });
      expect(testZone.next).toEqual(2);
      expect(testShifts[docShift1.id].status).toEqual("paused");
    });
    it("should skip apps when moving super", () => {
      const { testZone, testShifts } = getTestZone();
      testZone.super = 1;
      Zone.movePointer({ zone: testZone, shifts: testShifts, which: "super", offset: 1 });
      expect(testZone.super).toEqual(0);
    });
  });

  describe("Provide Super", (c) => {
    beforeEach((c) => {
      const { testZone, testShifts } = getTestZone();
      const superId = Zone.provideSuper({ zone: testZone, shifts: testShifts });
      c.zone = testZone;
      c.superId = superId;
      c.shifts = testShifts;
    });
    it("should yield a super ShiftId, increase super count and advance super", (c) => {
      expect(c.superId).toEqual(docShift2.id);
    });
    it("should advance super", (c) => {
      expect(c.zone!.super).toEqual(1);
    });
  });
});
