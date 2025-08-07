import { ref } from "vue";
//import mockBoard from "../mockBoard.js";

// error handling
export const error = ref(null);

const catchError = (err) => {
  if (typeof err === "string") {
    console.error(err);
    error.value = err;
  } else {
    console.error(err.stack);
    error.value = err.message;
  }
  setTimeout(() => {
    error.value = null;
  }, 3000);
  return false;
};

// socket
export const socketConnected = ref(null);

// board & site
export const board = ref(null);

const getBoard = async () => {
  const { data } = await post("/api/core/board");
  board.value = JSON.parse(data.board);
};

export const updateBoard = (newBoard) => {
  board.value = newBoard;
};

export const site = ref(null);

const getSite = async () => {
  const { data } = await post("/api/core/site");
  site.value = JSON.parse(data.site);
};

const getBoardAndSite = async () => {
  await getBoard();
  await getSite();
};

// api handlers
const post = async (url, payload = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) {
      catchError(new Error(json.message));
    }
    if (json.error) {
      catchError(`API ERROR: ${json.error}`);
    }
    return json;
  } catch (error) {
    catchError(error);
  }
};

export const dispatch = (boardMethod, payload = {}) =>
  post("/api/core/action", { type: boardMethod, payload });

// auth
export const token = ref(null);

const setToken = (newToken) => {
  token.value = newToken;
};

export const login = async (payload) => {
  const res = await post("/api/auth/login", payload);
  if (res) {
    setToken(res);
    getBoardAndSite();
  }
};

export const checkLogin = async () => {
  const res = await post("/api/auth/checklogin");
  if (res.status === "noauth") {
    console.log("[checkLogin] noauth");
    setToken(null);
  } else {
    setToken(res);
    getBoardAndSite();
    console.log("[checkLogin] success");
  }
};

export const logout = async () => {
  const res = await post("/api/auth/logout");
  if (res.status === "success") setToken(null);
};

// time util
export const formatTime = (epoch) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Denver",
    hour12: false,
  });

  return formatter.format(new Date(epoch));
};

// ordered shifts
export const getShiftIdsAlphabetized = () => {
  const shifts = [];
  Object.keys(board.value.shifts).forEach((shiftId) =>
    shifts.push(board.value.shifts[shiftId]),
  );
  const sortedShifts = shifts.sort((a, b) => {
    if (a.last < b.last) return -1;
    if (a.last > b.last) return 1;
    return 0;
  });
  return sortedShifts.map((shift) => shift.id);
};
