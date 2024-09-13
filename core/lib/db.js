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
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
// Helper
// https://dev.to/atomikjaye/styling-consolelog-in-the-terminal-25c1
const logObject = (text, obj) => {
    console.log(`\x1b[33m#### ${text} ####\x1b[0m`);
    console.log(" ");
    console.dir(obj, { depth: 99 });
    console.log(" ");
};
// Create a single supabase client for interacting with your database
const supabase = (0, supabase_js_1.createClient)("http://localhost:54321", process.env.SUPABASE_LOCAL);
// QUERIES
const providersQuery = `providers(id, lname, fname, role)`;
const ptQuery = `
  id, room, patient_type,
  shift:shift_id(id, provider:${providersQuery}),
  supervisorShift:supervisor_id(id, provider:${providersQuery})
  `;
const shiftsQuery = `
  id,
  provider:${providersQuery},
  info:shift_details(id, name, bonus, shift_type),
  patients!shift_id({ count: 'exact', head: true }),
  supervisor:patients!supervisor_id({ count: 'exact', head: true })
  `;
const eventsQuery = `
    id, message, detail, event_type, previous_event,
    shift:shift_id(id, provider:${providersQuery}),
    patient:patients(${ptQuery})
    `;
// BOARD
const getLastState = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase
        .from("events")
        .select("state")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    return data.state;
});
const getRecords = (table, query, ids) => supabase.from(table).select(query).in("id", ids);
const hydrateIds = (ids, records) => ids.map((id) => records.find((record) => record.id === id));
const getBoard = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const stateShifts = [...state.main, ...state.flex, ...state.off];
    const response = yield Promise.all([
        getRecords("shifts", shiftsQuery, stateShifts),
        getRecords("events", eventsQuery, state.events),
    ]);
    const shifts = response[0].data;
    const events = response[1].data;
    return {
        main: hydrateIds(state.main, shifts),
        flex: hydrateIds(state.flex, shifts),
        off: hydrateIds(state.off, shifts),
        events: hydrateIds(state.events, events),
        nextProvider: state.nextProvider,
        nextSupervisor: state.nextSupervisor,
        nextFt: state.nextFt,
    };
});
// SHIFT
const addShift = (providerId, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        id: null,
        type: "physician",
        info: { bonus: null },
        provider: { id: null, lname: "", fname: "", role: "" },
        patients: { count: null },
    };
});
const deleteShift = (shiftId) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
// Patient db calls
const addPatient = (options) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
const updatePatient = (patientId, options) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
const deletePatient = (shiftId) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
// Event db calls
const addEvent = (options) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
const updateEvent = (eventId, state) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
const deleteEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    return 3;
});
// const initialState = {
//   main: [1, 3],
//   flex: [2, 4],
//   off: [],
//   events: [1],
//   ft: 2,
//   next: 1,
//   super: 1,
// };
// const lastState = await getLastState();
// logObject("getStoreFromState", await getStoreFromState(lastState));
exports.default = {
    getLastState,
    getBoard,
    addEvent,
    updateEvent,
    deleteEvent,
    addPatient,
    updatePatient,
    deletePatient,
    addShift,
    deleteShift,
};
//# sourceMappingURL=db.js.map