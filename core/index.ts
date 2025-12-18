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
    siteConfig?: SiteConfig;
  },
): CoreResponse => {
  if (params.schedule.reset) {
    const logs = Board.buildLogs(board.slug, board);
    const resetBoard = Board.reset(board, {
      siteConfig: params.siteConfig,
    });

    // signIn withUndo() returns the signed in board, but 'oldboard' is just the empty reset board
    // that emtpy reset board is just an intermediate, we don't need to return that as prior state
    // override that return and instead return the original board that was sent at start of function call
    const { board: signedInBoard, error } = withUndo(Board.signIn)(
      resetBoard,
      params,
    );

    return {
      board: signedInBoard,
      oldboard: board,
      error: error,
      logs: logs,
    };
  }
  return withUndo(Board.signIn)(board, params);
};

export default {
  build: Board.make,
  signIn: signInCheckReset,
  signOut: withUndo(Board.signOut),
  joinZone: withUndo(Board.joinZone),
  leaveZone: withUndo(Board.leaveZone),
  switchZone: withUndo(Board.switchZone),
  deleteShift: withUndo(Board.deleteShift),
  adjustRotation: withUndo(Board.adjustRotation),
  togglePause: withUndo(Board.togglePause),
  addTriage: withUndo(Board.addTriage),
  assignToShift: withUndo(Assign.toShift),
  assignToZone: withUndo(Assign.toZone),
  reassign: withUndo(Assign.reassign),
  changeRoom: withUndo(Assign.changeRoom),
} as Record<string, Function>;
