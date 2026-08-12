type BoardHandler = (data: unknown) => void;

// Creates a singleton WebSocket connection for a site.
// Handles keepalive pings, automatic reconnect, and cleanup.
export const createSocket = (slug: string, boardHandler: BoardHandler) => {
  let ws: WebSocket | null = null;
  let reconnectDelay = 1000;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let keepAliveLoop: ReturnType<typeof setInterval> | null = null;
  let intentionallyClosed = false;

  const connected = ref<boolean>(false);

  const clearKeepAliveLoop = () => {
    if (keepAliveLoop) {
      clearInterval(keepAliveLoop);
      keepAliveLoop = null;
    }
  };

  const startKeepAliveLoop = () => {
    clearKeepAliveLoop();
    keepAliveLoop = setInterval(() => {
      ws?.send(JSON.stringify({ action: "ping" }));
    }, 25000);
  };

  const attemptReconnect = () => {
    reconnectTimer = setTimeout(() => connect(), reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  };

  const connect = () => {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${protocol}://${location.host}/ws/${slug}`);

    ws.addEventListener("open", () => {
      console.log("[websocket] connected");
      connected.value = true;
      reconnectDelay = 1000;
      startKeepAliveLoop();
    });

    ws.addEventListener("close", () => {
      connected.value = false;
      clearKeepAliveLoop();
      if (!intentionallyClosed) {
        console.error(
          "[websocket] closed, reconnecting in",
          reconnectDelay,
          "ms",
        );
        attemptReconnect();
      }
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg?.action === "pong") return;
        if (msg?.board) {
          boardHandler(msg);
          return;
        }
        console.log("[websocket] message:", event.data);
      } catch {
        console.error("[websocket] failed to parse message:", event.data);
      }
    });
  };

  const send = (data: unknown) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  // INIT
  connect();

  window.addEventListener("beforeunload", () => {
    intentionallyClosed = true;
    clearKeepAliveLoop();
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
  });

  return { send, connected };
};
