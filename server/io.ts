import { Server } from "socket.io";
import { verifyToken } from "./auth.js";

const useSocket = (honoServer: any): any => {
  const io = new Server(honoServer);

  io.on("connection", async (socket) => {
    const token = socket.handshake.auth.token;
    const { isAuth, payload } = await verifyToken(token);
    if (!isAuth) {
      socket.disconnect();
      return;
    }
    socket.join(payload!.site as string);
    console.log(`[socket][${payload!.site}] new connection: ${socket.id}`);
    console.log("[socket] total connections: ", io.of("/").sockets.size);
  });

  return io;
};

export default useSocket;
