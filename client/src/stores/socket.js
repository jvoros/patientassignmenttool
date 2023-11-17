import { reactive } from "vue";
import { io } from "socket.io-client";
import apiCall from "./apiCall.js";

export const socketData = reactive({
  connected: false,
  // set default for UI to render
  board: {
    rotations: {
      main: { shifts: [] },
      fasttrack: { shifts: [] },
      off: { shifts: [] },
    },
    events: {},
  },
});

export const socket = io("/");

socket.on("connect", () => {
  console.log("Socket connected...");
  socketData.connected = true;
  apiCall("api/board");
});

socket.on("new state", (state) => {
  console.log("New state received...");
  console.log(state);
  socketData.board = state;
});
