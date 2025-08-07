import {
  produce,
  produceWithPatches,
  enablePatches,
  applyPatches,
} from "immer";
import Board from "./board.js";
import Assign from "./assign.js";
enablePatches();

type CoreResponse = {
  board?: Board;
  error?: unknown;
  logs?: LogItem[];
};

type BoardFn<T> = (board: Board, params: T) => void;

const withUndo = <T>(fn: BoardFn<T>) => {
  return (board: Board, params: T): CoreResponse => {
    let error: unknown;
    let returnBoard = board;
    try {
      const [newBoard, _patches, inversePatches] = produceWithPatches(
        board,
        (draftBoard) => {
          fn(draftBoard, params);
        },
      );
      // return from immer is immutable
      // use produce() to modify
      const newBoardWithPatches = produce(newBoard, (draft) => {
        draft.events[draft.timeline[0]].patches = inversePatches;
      });
      returnBoard = newBoardWithPatches;
    } catch (err: unknown) {
      error = err;
    }
    return { board: returnBoard, error };
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

const reset = (board: Board): CoreResponse => {
  const logs = Board.buildLogs(board.slug, board);
  const res = withUndo(Board.reset)(board, null);
  res.logs = logs;
  return res;
};

const undo = (board: Board): CoreResponse => {
  let error: unknown;
  let returnBoard = board;
  try {
    const patches = board.events[board.timeline[0]].patches;
    returnBoard = applyPatches(board, patches);
  } catch (err) {
    error = err;
  }
  return { board: returnBoard, error };
};

export default {
  build: Board.make,
  reset,
  undo,
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
