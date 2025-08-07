import db from "./index.js";
import board from "../client/mockBoard.js";

const res = await db.updateBoard("smh", board);
console.log("updateBoard res:", res);
