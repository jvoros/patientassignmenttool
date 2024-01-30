import { describe, it } from "mocha";
import { expect } from "chai";

import Shift from "../server/controllers/shift.js";

describe("Shift Functions", () => {
  let shift1 = Shift.make(
    { first: "Jeremy", last: "Voros" },
    {
      start: "06:00",
      end: "15:00",
      name: "6am Shift",
      bonus: 2,
      rotationId: 1,
      order: 0,
    }
  );

  let shift2 = Shift.make(
    { first: "David", last: "Crosby" },
    {
      start: "06:00",
      end: "15:00",
      name: "6am Shift",
      bonus: 2,
      rotationId: 1,
      order: 0,
    }
  );

  let shift3 = Shift.make(
    { first: "Emily", last: "Pierson", app: true },
    {
      start: "10:00",
      end: "22:00",
      name: "APP Shift",
      bonus: 0,
      rotationId: 1,
      order: 0,
    }
  );

  it("should construct correctly", () => {
    const x = [
      "id",
      "doctor",
      "start",
      "end",
      "name",
      "bonus",
      "rotationId",
      "order",
      "skip",
      "patients",
      "counts",
    ];
    expect(Object.keys(shift1)).to.deep.equal(x);
    expect(shift1.doctor.last).to.equal("Voros");
  });

  it("should add patients", () => {
    shift1 = Shift.addPatient(shift1, { type: "walk" });
    shift2 = Shift.addPatient(shift2, { type: "guitar" });
    expect(shift1.patients.length).to.equal(1);
    expect(shift1.patients[0].type).to.equal("walk");
    expect(shift2.patients[0].type).to.equal("guitar");
  });

  it("should remove patients", () => {
    shift2 = Shift.removePatient(shift2, shift2.patients[0].id);
    expect(shift2.patients.length).to.equal(0);
  });

  it("should update order", () => {
    shift1 = Shift.setOrder(shift1, 1);
    expect(shift1.order).to.equal(1);
  });

  it("should update rotation", () => {
    shift1 = Shift.setRotation(shift1, 2);
    expect(shift1.rotationId).to.equal(2);
  });

  it("should count patient types", () => {
    [
      { type: "ambo" },
      { type: "ambo" },
      { type: "fasttrack" },
      { type: "fasttrack" },
      { type: "zebra" },
    ].forEach((p) => {
      shift1 = Shift.addPatient(shift1, p);
    });
    expect(shift1.counts).to.deep.equal({
      total: 6,
      walk: 1,
      ambo: 2,
      fasttrack: 2,
      zebra: 1,
    });

    it("should toggle skip flag for app shifts", () => {
      expect(shift3.skip).to.equal(false);
      shift3 = Shift.turnComplete(shift3);
      expect(shift3.skip).to.equal(true);
      shift3 = Shift.turnComplete(shift3);
      expect(shift3.skip).to.equal(false);
    });

    it("should not toggle skip flag for non-app shifts", () => {
      expect(shift1.skip).to.equal(false);
      shift1 = Shift.turnComplete(shift1);
      expect(shift1.skip).to.equal(false);
    });
  });
});
