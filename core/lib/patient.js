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
exports.handleReassignSupervisor = void 0;
const rotation_1 = __importDefault(require("./rotation"));
const event_1 = __importDefault(require("./event"));
const db_1 = __importDefault(require("./db"));
// API
// shift and pt come hydrated from client
const assignPatient = (state_1, shift_1, pt_1, ...args_1) => __awaiter(void 0, [state_1, shift_1, pt_1, ...args_1], void 0, function* (state, shift, pt, advance = true) {
    const supervisorId = withSupervisor(state, shift);
    const newPtId = yield db_1.default.addPatient({
        type: pt.type,
        room: pt.room,
        shiftId: shift.id,
        supervisorId: supervisorId,
    });
    const newState = handleNexts(state, shift, supervisorId, advance);
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "addPatient",
        shiftId: shift.id,
        patientId: newPtId,
    });
    return newStateWithEvent;
});
// event from client
const reassignPatient = (state, event, newShift) => __awaiter(void 0, void 0, void 0, function* () {
    const { newSupervisorId, newState } = (0, exports.handleReassignSupervisor)(state, event.shift.provider, newShift.provider);
    const updatedPt = yield db_1.default.updatePatient(event.patient.id, {
        shiftId: newShift.id,
        supervisorId: newSupervisorId,
    });
    const newStateWithEvent = yield event_1.default.addToState(newState, {
        type: "reassign",
        patientId: event.patient.id,
        shiftId: newShift.id,
    });
    return newStateWithEvent;
});
// INTERNAL
const withSupervisor = (state, shift) => {
    return shift.type === "app" ? state.nextSupervisor : null;
};
const handleNexts = (state, shift, supervisorId, advance) => {
    const nextSupervisor = getNextSupervisor(state, supervisorId);
    const nextProvider = getNextProvider(state, shift, advance);
    return Object.assign(Object.assign({}, state), { nextSupervisor, nextProvider });
};
const getNextSupervisor = (state, supervisorId) => {
    return supervisorId
        ? rotation_1.default.getNextShiftId(state, "nextSupervisor")
        : state.nextSupervisor;
};
const getNextProvider = (state, shift, advance) => {
    return shouldAdvance(shift, advance)
        ? rotation_1.default.getNextShiftId(state, "nextProvider")
        : state.nextProvider;
};
const shouldAdvance = (shift, advance) => shift.patients.count >= shift.info.bonus && advance;
const handleReassignSupervisor = (state, currentProvider, newProvider) => {
    const currentSupervisorId = state.nextSupervisor;
    let newSupervisorId = null;
    let newState = structuredClone(state);
    // if new = doc and current = doc
    // if new = doc and current = app
    if (newProvider.role === "physician") {
        newSupervisorId = currentSupervisorId;
    }
    else if (currentProvider.role === "physician") {
        // if new = app and current = physician
        newSupervisorId = currentProvider.id;
    }
    else {
        // if new = app and current = app
        newSupervisorId = state.nextSupervisor;
        newState.nextSupervisor = rotation_1.default.getNextShiftId(state, "nextSupervisor");
    }
    return { newSupervisorId, newState };
};
exports.handleReassignSupervisor = handleReassignSupervisor;
exports.default = { assignPatient, reassignPatient };
//# sourceMappingURL=patient.js.map