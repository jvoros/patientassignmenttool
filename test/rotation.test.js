import { describe, it } from "mocha";
import { expect } from "chai";

import rotation from "../server/controllers/rotation.js";

let main = rotation.make("Main", true, true);
let ft = rotation.make("Fast Track");

describe("Rotation Functions", () => {
  it("should be created with default properties", () => {
    const comp = ["id", "name", "cycle", "next"];
    expect(Object.keys(main)).to.deep.equal(comp);
  });

  it("should be created with patient and midlevel rotations true if flagged", () => {
    expect(main.cycle.patient).to.equal(true);
    expect(main.cycle.midlevel).to.equal(true);
  });

  it("should be created without patient or midlevel rotations if not flagged", () => {
    expect(ft.cycle.patient).to.equal(false);
    expect(ft.cycle.midlevel).to.equal(false);
  });

  it("should set next shift for patient and midlevel rotations", () => {
    main = rotation.setNext(main, "patient", "123");
    expect(main.next.patient).to.equal("123");
    main = rotation.setNext(main, "midlevel", "abc");
    expect(main.next.midlevel).to.equal("abc");
  });
});
