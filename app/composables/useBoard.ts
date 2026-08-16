import type { Board, SiteConfig } from "../../server/core/types";
import type { ActionMessage } from "../../server/utils/dispatch";

type SendResult = { ok: true; board: Board } | { ok: false; error: string };
type SendFn = (action: ActionMessage) => Promise<SendResult>;

// Module-level so all useBoard() calls share the same state and socket
const board = ref<Board | null>(null);
const config = ref<SiteConfig | null>(null);
let socket: ReturnType<typeof createSocket> | null = null;
const connected = computed(() => socket?.connected.value ?? false);

// Holds the resolve/reject for the in-flight send.
// Resolves on the next message received — if a broadcast from another client
// arrives first, it settles early which is fine: the board is already updated.
let pendingSend: {
  resolve: (result: SendResult) => void;
  reject: (reason: unknown) => void;
} | null = null;

const useBoard = () => {
  const initializeBoard = () => {
    // Get initial board data
    const { session } = useUserSession();
    const slug = session.value?.user?.slug;

    if (!slug) {
      throw new Error("useBoard().init() called without an active session");
    }

    $fetch(`/api/board/${slug}`)
      .then((data) => {
        board.value = data.board;
        config.value = data.config;
      })
      .catch((err) => console.error("[api] failed to fetch board:", err));

    // Set up websocket connection
    const boardHandler = (msg: unknown) => {
      const result = msg as SendResult;
      if (result.ok) {
        board.value = result.board;
      } else {
        console.error("[board] action error:", result.error);
      }
      // resolves the promise started by send() whenever a board is received
      pendingSend?.resolve(result);
      pendingSend = null;
    };

    // Disconnect any existing socket before creating a new one
    socket?.disconnect();
    socket = createSocket(slug, boardHandler);
  };

  const send = (action: ActionMessage): Promise<SendResult> => {
    return new Promise((resolve, reject) => {
      if (!socket?.connected.value) {
        reject(new Error("WebSocket is not connected"));
        return;
      }
      // starts the promise that is resolved when the socket receives board
      // see boardHandler for resolution
      pendingSend = { resolve, reject };
      socket.send(action);
    });
  };

  const updateConfig = async (
    slug: string,
    newConfig: SiteConfig,
  ): Promise<void> => {
    try {
      await $fetch(`/api/config/${slug}`, {
        method: "POST",
        body: { slug, config: newConfig },
      });
      const data = await $fetch(`/api/board/${slug}`);
      board.value = data.board;
      config.value = data.config;
    } catch (err) {
      console.error(err);
    }
  };

  const getShiftName = (id: string): string => {
    const shift = board.value?.shifts[id];
    return shift ? `${shift.first} ${shift.last}` : "(unknown)";
  };

  const getShiftsAlphabetically = (): string[] => {
    if (!board.value) return [];
    const shifts = Object.values(board.value.shifts);
    return shifts.sort((a, b) => a.last.localeCompare(b.last)).map((s) => s.id);
  };

  const disconnect = () => {
    socket?.disconnect();
    socket = null;
  };

  return {
    board,
    config,
    connected,
    initializeBoard,
    disconnect,
    send,
    updateConfig,
    getShiftName,
    getShiftsAlphabetically,
  };
};

export default useBoard;
