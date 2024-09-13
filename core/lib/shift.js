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
const rotation_1 = __importDefault(require("./rotation"));
const event_1 = __importDefault(require("./event"));
const db_1 = __importDefault(require("./db"));
// API
const addShift = (state, provider, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const newShift = yield db_1.default.addShift(provider.id, scheduleId);
    const shiftTuple = { id: newShift.id, type: newShift.type };
    const newState = joinBoard(state, shiftTuple);
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "addShift",
        shiftId: newShift.id,
    });
    return newStateWithEvent;
});
const flexOn = (state, shift) => __awaiter(void 0, void 0, void 0, function* () {
    const onMain = addToMain(state, shift);
    const offFlex = removeFromZone("flex")(onMain, shift.id);
    const newStateWithEvent = yield event_1.default.addToState(offFlex, {
        type: "flexOn",
        shiftId: shift.id,
    });
    return newStateWithEvent;
});
const flexOff = (state, shift) => __awaiter(void 0, void 0, void 0, function* () {
    const offMain = leaveMain(state, shift);
    const onFlex = addToZone("flex")(offMain, shift);
    const newStateWithEvent = yield event_1.default.addToState(onFlex, {
        type: "flexOff",
        shiftId: shift.id,
    });
    return newStateWithEvent;
});
const joinFt = (state, shiftId) => __awaiter(void 0, void 0, void 0, function* () {
    const newState = setNextFt(state, shiftId);
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "joinFt",
        shiftId,
    });
    return newStateWithEvent;
});
const leaveFt = (state, shiftId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isNextFt(state, shiftId))
        return state;
    const newState = setNextFt(state, null);
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "leaveFt",
        shiftId,
    });
    return newStateWithEvent;
});
const signOut = (state, shift) => __awaiter(void 0, void 0, void 0, function* () {
    const leftMain = leaveMain(state, shift);
    const leftApp = leaveAppZones(leftMain, shift.id);
    const addOff = addToZone("off")(leftApp, shift);
    const newStateWithEvent = event_1.default.addToState(addOff, {
        type: "signOut",
        shiftId: shift.id,
    });
    return newStateWithEvent;
});
const rejoin = (state, shift) => __awaiter(void 0, void 0, void 0, function* () {
    const takeOff = removeFromZone("off")(state, shift.id);
    const onBoard = joinBoard(takeOff, shift);
    const newStateWithEvent = event_1.default.addToState(onBoard, {
        type: "rejoin",
        shiftId: shift.id,
    });
    return newStateWithEvent;
});
// INTERNAL
// Zones
const joinBoard = (state, shift) => {
    return shift.type === "physician"
        ? addDoctorToMain(state, shift)
        : addToAppZones(state, shift);
};
const addToMain = (state, shift) => {
    // set as next
    const newNext = setNextProvider(state, shift.id);
    // add at start, if empty, or as up next
    const insertIndex = !state.nextProvider
        ? 0
        : state.main.findIndex((s) => s.id === state.nextProvider);
    const newState = structuredClone(newNext);
    newState.main.splice(insertIndex, 0, shift);
    return newState;
};
const addDoctorToMain = (state, shift) => {
    // add as super only if empty
    const stateWithSuper = state.nextSupervisor
        ? state
        : setNextSupervisor(state, shift.id);
    const newState = addToMain(stateWithSuper, shift);
    return newState;
};
const addToAppZones = (state, shift) => {
    const stateWithFlex = addToZone("flex")(state, shift);
    const newState = !state.nextFt
        ? setNextFt(stateWithFlex, shift.id)
        : stateWithFlex;
    return newState;
};
const leaveMain = (state, shift) => {
    // error checks before changes
    if (isLastDoctorOnMain(state, shift) ||
        state.main.findIndex((s) => s.id === shift.id) < 0) {
        return state;
    }
    const offNexts = handleNextsOnLeaveMain(state, shift.id);
    const newState = removeFromZone("main")(offNexts, shift.id);
    return newState;
};
const leaveAppZones = (state, shiftId) => {
    const offFlex = removeFromZone("flex")(state, shiftId);
    const newState = isNextFt(offFlex, shiftId)
        ? Object.assign(Object.assign({}, offFlex), { nextFt: null }) : offFlex;
    return newState;
};
const handleNextsOnLeaveMain = (state, shiftId) => {
    const nexts = ["nextProvider", "nextSupervisor"];
    const newState = structuredClone(state);
    nexts.forEach((next) => {
        newState[next] =
            newState[next] === shiftId
                ? rotation_1.default.getNextShiftId(state, next)
                : newState[next];
    });
    return newState;
};
// Helpers
const isLastDoctorOnMain = (state, shift) => state.main.length < 2 && shift.type === "physician";
const addToZone = (zone) => (state, shift) => {
    const newState = structuredClone(state);
    newState[zone].push(shift);
    return newState;
};
const removeFromZone = (zone) => (state, shiftId) => {
    const newState = structuredClone(state);
    newState[zone] = state[zone].filter((shift) => shift.id !== shiftId);
    return newState;
};
// Nexts
const isNextFt = (state, shiftId) => state.nextFt === shiftId;
const setNext = (whichNext, state, shiftId) => {
    const newState = structuredClone(state);
    newState[whichNext] = shiftId;
    return newState;
};
const setNextProvider = (state, shiftId) => setNext("nextProvider", state, shiftId);
const setNextSupervisor = (state, shiftId) => setNext("nextSupervisor", state, shiftId);
const setNextFt = (state, shiftId) => setNext("nextFt", state, shiftId);
exports.default = {
    addShift,
    flexOn,
    flexOff,
    joinFt,
    leaveFt,
    signOut,
    rejoin,
};
//# sourceMappingURL=shift.js.map