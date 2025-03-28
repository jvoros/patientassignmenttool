import { reactive, onBeforeMount, onUnmounted, ref } from "vue";
import { useApi } from "./api.js";

const api = useApi();

const store = reactive({
  board: {
    date: "",
    timeline: [],
    zoneList1: [],
    zoneList2: [],
  },
  details: {
    providers: [],
    schedule: [],
  },
});

const globalError = ref();

export const useSite = () => {
  const getShifts = () => {
    const allShifts = [
      ...store.board.zoneList1.map((zone) => zone.shifts),
      ...store.board.zoneList2.map((zone) => zone.shifts),
    ].flat();
    const set = new Set(allShifts);
    return [...set];
  };

  const fetchBoard = async () => {
    const { data, error } = await api.get("/api/board/getBoard");
    if (!data) return;
    store.board = data.data;
    console.log("[site] fetched board");
  };

  const fetchDetails = async () => {
    const { data, error } = await api.get("/api/board/getSiteDetails");
    if (!data) return;
    store.details = data.data;
    console.log("[site] fetched details");
  };

  const updateBoard = (data) => {
    console.log("[stream] board: updating...");
    console.log(data);
    data.loading = false;
    store.board = data;
  };

  const setError = (message) => {
    globalError.value = { message };
  };

  // STREAM
  const useStream = () => {
    let stream;
    onBeforeMount(() => {
      stream = new EventSource("/api/stream");
      stream.onmessage = (event) => {
        console.log("[stream] message:", event.data);
      };
      stream.addEventListener("board", (event) => {
        console.log("[stream] board: new board");
        updateBoard(JSON.parse(event.data));
      });
    });

    onUnmounted(() => {
      stream.close();
    });
  };

  return {
    // top level
    store,
    fetchBoard,
    fetchDetails,
    error: globalError,
    setError,
    useStream,
    getShifts,
  };
};
