import { describe, it } from "mocha";
import { expect } from "chai";

import event from "../server/controllers/event.js";

describe("Event Object Tests", () => {
  it("should construct correctly", () => {
    const e = event.make(
      "assign",
      "main_rot",
      { last: "Voros", first: "Jeremy" },
      { message: "assigned", room: "20", ptType: "ambo" }
    );

    expect(e.time).to.exist;
    expect(e.rotation).to.equal("main_rot");
    expect(e.doctor.last).to.equal("Voros");
    expect(e.message).to.equal("assigned");
    expect(e.room).to.equal("20");
    expect(e.ptType).to.equal("ambo");
  });
});
