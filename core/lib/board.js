"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyState = void 0;
const shift_1 = __importDefault(require("./shift"));
const rotation_1 = __importDefault(require("./rotation"));
const patient_1 = __importDefault(require("./patient"));
const event_1 = __importDefault(require("./event"));
const db_1 = __importDefault(require("./db"));
const getEmptyBoard = () => ({
    main: [],
    flex: [],
    off: [],
    events: [],
    nextFt: null,
    nextProvider: null,
    nextSupervisor: null,
});
const getEmptyState = () => {
    return {
        main: [],
        flex: [],
        off: [],
        events: [],
        nextFt: null,
        nextProvider: null,
        nextSupervisor: null,
    };
};
exports.getEmptyState = getEmptyState;
const createStore = () => {
    let state = (0, exports.getEmptyState)();
    let board = getEmptyBoard();
    // never need to get state, board is always based on state
    const get = () => board;
    const reset = () => __awaiter(void 0, void 0, void 0, function* () {
        const newState = (0, exports.getEmptyState)();
        const newStateWithEvent = yield event_1.default.addToState(newState, {
            type: "reset",
        });
        const newBoard = yield db_1.default.getBoard(newStateWithEvent);
        state = newStateWithEvent;
        board = newBoard;
    });
    // error checking here
    // should catch any error from whole program
    const withRehydrate = (fn) => (...args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            state = yield fn(state, ...args);
            board = yield db_1.default.getBoard(state);
        }
        catch (error) {
            console.error("Error during state rehydration:", error);
            throw error;
        }
    });
    return {
        get,
        reset,
        undo: withRehydrate(event_1.default.undo),
        addShift: withRehydrate(shift_1.default.addShift),
        flexOn: withRehydrate(shift_1.default.flexOn),
        flexOff: withRehydrate(shift_1.default.flexOff),
        joinFt: withRehydrate(shift_1.default.joinFt),
        leaveFt: withRehydrate(shift_1.default.leaveFt),
        signOut: withRehydrate(shift_1.default.signOut),
        rejoin: withRehydrate(shift_1.default.rejoin),
        moveNext: withRehydrate(rotation_1.default.moveNext),
        moveShiftInRotation: withRehydrate(rotation_1.default.moveShiftInRotation),
        assignPatient: withRehydrate(patient_1.default.assignPatient),
        reassignPatient: withRehydrate(patient_1.default.reassignPatient),
    };
};
exports.default = createStore;
/*
API functions all:
- take board as first argument.
- return a new state with new event

use the new state to re-hydrate board.store
*/
/*
MORE THINKING

Each event can hold: current state and pointer to last event. These don't need to be returned to client
No need to return "store" to client. Each shift knows its patients.

Board object sent to client can be deeply nested

Don't need message for each event. Can generate message based on type.
*/
//# sourceMappingURL=board.js.map