import { reactive } from "vue";
import { io } from "socket.io-client";

export const socketData = reactive({
  connected: "FALSE",
  test: "test",
});

export const socket = io("/");

socket.on("connect", () => {
  socketData.connected = "TRUE";
  console.log("connected...");
});
