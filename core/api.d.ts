// API Interface
// Interface for the whole project
// Should export object with these functions

interface PatientAssignmentToolApi {
  reset: (board: Board) => Board;

  signIn: (params: { board: Board; provider: Provider; schedule: ScheduleItem }) => Board;

  signOut: (params: { board: Board; shiftId: Shift["id"] }) => Board;

  deleteShift: (params: { board: Board; shiftId: Shift["id"] }) => Board;

  joinZone: (params: { board: Board; zoneId: Zone["slug"]; shiftId: Shift["id"] }) => Board;

  leaveZone: (params: { board: Board; zoneId: Zone["slug"]; shiftId: Shift["id"] }) => Board;

  switchZone: (params: {
    board: Board;
    leaveZoneId: Zone["slug"];
    joinZoneId: Zone["slug"];
    shiftId: Shift["id"];
  }) => Board;

  advanceRotation: (params: {
    board: Board;
    zoneId: Zone["slug"];
    which: string;
    direction: number;
  }) => Board;

  //changePosition: () => Board;

  pauseShift: (params: { board: Board; shiftId: Shift["id"] }) => Board;

  unpauseShift: (params: { board: Board; shiftId: Shift["id"] }) => Board;

  assignToShift: (params: {
    draft: Board;
    zoneId: Zone["slug"];
    shiftId: Shift["id"];
    patient: Patient;
  }) => Board;

  assignToZone: (params: { draft: Board; zoneId: Zone["slug"]; patient: Patient }) => Board;

  reassignPatient: (params: {
    draft: Board;
    eventId: BoardEvent["id"];
    newShiftId: Shift["id"];
  }) => Board;

  changeRoom: (params: { board: Board; eventId: BoardEvent["id"]; newRoom: string }) => Board;
}

// export default {

//   undo: Undo.undo,
//   changePosition,
//   buildLogs,
//   hydrate,
// };
