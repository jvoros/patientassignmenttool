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
const event_1 = __importDefault(require("./event"));
// API
const getNextShiftId = (state, whichNext, offset = 1) => {
    const directionMultiplier = offset < 1 ? -1 : 1; // will keep recursion going correct direction
    const neighborShift = getNeighborShift(state, whichNext, offset);
    const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
        ? getNextShiftId(state, whichNext, offset + 1 * directionMultiplier)
        : neighborShift.id;
    return nextShiftId;
};
const moveNext = (state_1, whichNext_1, ...args_1) => __awaiter(void 0, [state_1, whichNext_1, ...args_1], void 0, function* (state, whichNext, offset = 1) {
    const nextShiftId = getNextShiftId(state, whichNext, offset);
    const newState = structuredClone(state);
    newState[whichNext] = nextShiftId;
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: `move-${whichNext}`,
        shiftId: nextShiftId,
    });
    return newStateWithEvent;
});
const moveShiftInRotation = (state_1, shiftId_1, ...args_1) => __awaiter(void 0, [state_1, shiftId_1, ...args_1], void 0, function* (state, shiftId, offset = 1) {
    const newState = structuredClone(state);
    const rotation = newState.main;
    const { index, nextIndex, nextShift } = findIndexAndNeighbor(state, shiftId, offset);
    rotation.splice(nextIndex, 0, rotation.splice(index, 1)[0]);
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "adjustRotation",
        shiftId,
    });
    return newStateWithEvent;
});
// HELPERS
const getNeighborShift = (state, whichNext, offset) => findIndexAndNeighbor(state, state[whichNext], offset).nextShift;
const findIndexAndNeighbor = (state, shiftId, offset) => {
    const index = state.main.findIndex((shift) => shift.id === shiftId);
    const length = state.main.length;
    const nextIndex = (index + offset + length) % length;
    return { index, nextIndex, nextShift: state.main[nextIndex] };
};
const shouldRecurseForNextSupervisor = (whichNext, neighborShift) => {
    return neighborShift.type === "app" && whichNext === "nextSupervisor";
};
exports.default = {
    getNextShiftId,
    moveNext,
    moveShiftInRotation,
};
//# sourceMappingURL=rotation.js.map