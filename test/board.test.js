import { describe, it } from "mocha";
import { expect } from "chai";

import Board from '../server/controllers/board.js'

describe("Board Class Tests", () => {

  describe("# lifecycle methods", () => {
    it("should initialize correctly");
    it("should be able to reset");
  });

  describe("# rotation methods", () => {
    it("should move shifts between rotations");
  });

  describe("# timeline methods", () => {
    it("should record patient assignments");
    it("should record shift additions to the board");
    it("should record shift movements between rotations");
    it("should record pointer movement within rotations");
  });
});