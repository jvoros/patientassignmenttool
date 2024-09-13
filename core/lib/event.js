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
const db_js_1 = __importDefault(require("./db.js"));
const EVENT_LIMIT = 30;
// API
const addToState = (state, options) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = yield db_js_1.default.addEvent(options);
    const newState = structuredClone(state);
    newState.events = [eventId, ...state.events.slice(0, EVENT_LIMIT - 1)];
    const updatedEventId = yield db_js_1.default.updateEvent(eventId, newState);
    return newState;
});
// comes from board so state will be first param
// event param from front end, full event object
// event { id, event_type, shift {id}, patient {id}}
const undo = (_state, event) => __awaiter(void 0, void 0, void 0, function* () {
    const deletes = yield handleDeletes(event);
    const newState = yield db_js_1.default.getLastState();
    return newState;
});
// HELPERS
const handleDeletes = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const deleteActions = {
        addShift: () => { var _a; return db_js_1.default.deleteShift((_a = event === null || event === void 0 ? void 0 : event.shift) === null || _a === void 0 ? void 0 : _a.id); },
        assignPatient: () => { var _a; return db_js_1.default.deletePatient((_a = event === null || event === void 0 ? void 0 : event.patient) === null || _a === void 0 ? void 0 : _a.id); },
    };
    const deleteChild = (_a = deleteActions[event.event_type]) === null || _a === void 0 ? void 0 : _a.call(deleteActions);
    const deleteEvent = db_js_1.default.deleteEvent(event.id);
    const results = yield Promise.all([deleteChild, deleteEvent]);
    return results;
});
exports.default = { EVENT_LIMIT, addToState, undo };
//# sourceMappingURL=event.js.map