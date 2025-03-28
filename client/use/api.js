import { ref } from "vue";
import { useFetch } from "./fetch.js";

const globalError = ref("no error");

export const useApi = () => {
  const baseApi = async (endpoint, payload = {}, method) => {
    const { data, error } = await useFetch(endpoint, payload, method);
    if (error) {
      console.error("[api] error:", error);
      globalError.value = { message: error, time: Date.now() };
    }
    return { data, error };
  };

  const post = (endpoint, payload = {}) => {
    return baseApi(endpoint, payload, "POST");
  };

  const get = (endpoint) => {
    return baseApi(endpoint, null, "GET");
  };

  // SHIFT
  const pauseShift = ({ shiftId }) => {
    return post("/api/board/pauseShift", { shiftId });
  };

  const unpauseShift = ({ shiftId }) => {
    return post("/api/board/unpauseShift", { shiftId });
  };

  const leaveZone = ({ leaveZoneId, shiftId }) => {
    return post("/api/board/leaveZone", {
      leaveZoneId,
      shiftId,
    });
  };

  const switchZone = ({ leaveZoneId, joinZoneId, shiftId }) => {
    return post("/api/board/switchZone", {
      leaveZoneId,
      joinZoneId,
      shiftId,
    });
  };

  const joinZone = ({ joinZoneId, shiftId }) => {
    return post("/api/board/joinZone", {
      joinZoneId,
      shiftId,
    });
  };

  const deleteShift = ({ shiftId }) => {
    return post("/api/board/deleteShift", { shiftId });
  };

  // ZONE
  const advanceRotation = ({ zoneId, whichActive, direction }) =>
    post("/api/board/advanceRotation", {
      zoneId,
      whichActive,
      direction,
    });

  // TIMELINE
  const undo = () => {
    return post("/api/board/undo");
  };

  const reassign = ({ eventId, newShiftId }) => {
    return post("/api/board/reassignPatient", { eventId, newShiftId });
  };

  const changeRoom = ({ eventId, newRoom }) => {
    return post("/api/board/changeRoom", { eventId, newRoom });
  };

  // ASSIGN
  const assignToZone = ({ zoneId, patient: { mode, room } }) => {
    return post("/api/board/assignToZone", {
      zoneId,
      patient: { mode, room },
    });
  };

  const assignToShift = ({ zoneId, shiftId, patient: { mode, room } }) => {
    return post("/api/board/assignToShift", {
      zoneId,
      shiftId,
      patient: { mode, room },
    });
  };

  return {
    error: globalError,
    post,
    get,
    pauseShift,
    unpauseShift,
    leaveZone,
    switchZone,
    joinZone,
    deleteShift,
    advanceRotation,
    undo,
    reassign,
    changeRoom,
    assignToZone,
    assignToShift,
  };
};
