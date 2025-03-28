import { Hono } from "hono";
import auth from "./authRoutes.js";
import board from "./boardRoutes.js";
import stream from "./streamRoutes.js";

const api = new Hono();

api.route("/auth", auth);

api.route("/board", board);

api.route("/stream", stream);

export default api;
