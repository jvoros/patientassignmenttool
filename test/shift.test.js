import { describe, it } from "mocha";
import { expect } from "chai";

import {
  makeShift,
  addPatientToShift,
  setShiftOrder,
  setShiftRotation,
} from "../server/controllers/shift.js";

describe("Shift Functions", () => {
  let shift = makeShift(
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

  let shift2 = makeShift(
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

  it("should construct correctly", () => {
    const x = [
      "id",
      "doctor",
      "start",
      "end",
      "name",
      "bonus",
      "patients",
      "counts",
      "rotationId",
      "order",
    ];
    expect(Object.keys(shift)).to.deep.equal(x);
    expect(shift.doctor.last).to.equal("Voros");
  });

  it("should add patients", () => {
    shift = addPatientToShift(shift, { type: "walk" });
    shift2 = addPatientToShift(shift2, { type: "guitar" });
    expect(shift.patients.length).to.equal(1);
    expect(shift.patients[0].type).to.equal("walk");
    expect(shift2.patients[0].type).to.equal("guitar");
  });

  it("should update order", () => {
    shift = setShiftOrder(shift, 1);
    expect(shift.order).to.equal(1);
  });

  it("should update rotation", () => {
    shift = setShiftRotation(shift, 2);
    expect(shift.rotationId).to.equal(2);
  });

  it("should count patient types", () => {
    [
      { type: "ambo" },
      { type: "ambo" },
      { type: "fasttrack" },
      { type: "fasttrack" },
      { type: "zebra" },
    ].forEach((p) => {
      shift = addPatientToShift(shift, p);
    });
    expect(shift.counts).to.deep.equal({
      total: 6,
      walk: 1,
      ambo: 2,
      fasttrack: 2,
      zebra: 1,
    });
  });
});
