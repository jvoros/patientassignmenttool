import { produce } from "immer";
import Board from "./board.js";
import Assign from "./assign.js";

type CoreResponse = {
  board?: Board;
  oldboard?: Board;
  error?: unknown;
  logs?: LogItem[];
};

type BoardFn<T> = (board: Board, params: T) => void;

// withUndo takes a board and returns board: newBoard, oldboard: startingBoard, error: error }
const withUndo = <T>(fn: BoardFn<T>) => {
  return (board: Board, params: T): CoreResponse => {
    let error: unknown;
    let returnBoard = board;
    try {
      const newBoard = produce(board, (draftBoard) => {
        fn(draftBoard, params);
      });
      returnBoard = newBoard;
    } catch (err: unknown) {
      error = err;
    }
    return { board: returnBoard, oldboard: board, error };
  };
};

const signInCheckReset = (
  board: Board,
  params: {
    provider: Provider;
    schedule: ScheduleItem;
  },
): CoreResponse => {
  if (params.schedule.reset) {
    const logs = Board.buildLogs(board.slug, board);
    const resetRes = withUndo(Board.reset)(board, null);
    const res = withUndo(Board.signIn)(resetRes.board!, params);
    res.logs = logs;
    return res;
  }
  return withUndo(Board.signIn)(board, params);
};

export default {
  build: Board.make,
  // signIn: withUndo(Board.signIn),
  signIn: signInCheckReset,
  signOut: withUndo(Board.signOut),
  joinZone: withUndo(Board.joinZone),
  leaveZone: withUndo(Board.leaveZone),
  switchZone: withUndo(Board.switchZone),
  deleteShift: withUndo(Board.deleteShift),
  adjustRotation: withUndo(Board.adjustRotation),
  togglePause: withUndo(Board.togglePause),
  assignToShift: withUndo(Assign.toShift),
  assignToZone: withUndo(Assign.toZone),
  reassign: withUndo(Assign.reassign),
  changeRoom: withUndo(Assign.changeRoom),
} as Record<string, Function>;
