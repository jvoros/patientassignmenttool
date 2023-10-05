import { describe, it } from "mocha";
import { expect } from "chai";

import Board from '../server/controllers/board.js'

const shift_details = [
  {
    "id": 1,
    "name": "6 am | FT 1 pm - 2 pm",
    "end": "15:00:00",
    "start": "06:00:00",
    "bonus": 2
  },
  {
    "id": 2,
    "name": "8 am | FT 4 pm - 5 pm",
    "end": "18:00:00",
    "start": "08:00:00",
    "bonus": 2
  },
  {
    "id": 3,
    "name": "10 am | FT 6 pm - 7 pm",
    "end": "20:00:00",
    "start": "10:00:00",
    "bonus": 2
  },
  {
    "id": 4,
    "name": "1:30 pm | FT 9:30 pm - 10:30 pm",
    "end": "23:30:00",
    "start": "13:30:00",
    "bonus": 2
  }
];

const board = new Board();

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