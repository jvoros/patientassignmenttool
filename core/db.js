import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { logObject } from "./helper-functions.js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_LOCAL
);

// STATE
export const getState = async () => {
  const { data, error } = await supabase
    .from("state")
    .select()
    .eq("id", 1)
    .limit(1)
    .single();
  return data.current;
};

export const updateState = async (newState) => {
  const { data, error } = await supabase
    .from("state")
    .update({ current: newState })
    .eq("id", 1)
    .select();
  return { data: data[0].current, error };
};

// STORE
const PT_QUERY = `
  id, room, patient_type,
  shift:shift_id(id, provider:providers(id, lname, fname)),
  supervisor:supervisor_id(id, provider:providers(id, lname, fname))
  `;

const SHIFT_QUERY = `
  id,
  provider:providers(id, lname, fname, role),
  info:shift_details(id, name, bonus, shift_type),
  patients!shift_id(id),
  supervisor:patients!supervisor_id(id)
  `;

const EVENT_QUERY = `
    id, message, detail, event_type,
    shift:shift_id(id, provider:providers(id, lname, fname)),
    patient:patients(${PT_QUERY})
    `;

const getShifts = (includeIds) =>
  supabase.from("shifts").select(SHIFT_QUERY).in("id", includeIds);

const getPatients = (includeIds) =>
  supabase.from("patients").select(PT_QUERY).in("id", includeIds);

const getEvents = (includeIds) =>
  supabase.from("events").select(EVENT_QUERY).in("id", includeIds);

export const getStore = async (state) => {
  const stateShifts = [...state.main, ...state.flex, ...state.off];
  // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
  const response = await Promise.all([
    getShifts(stateShifts),
    getPatients(state.patients),
    getEvents(state.events),
  ]);
  return {
    shifts: response[0].data,
    patients: response[1].data,
    events: response[2].data,
  };
};

export const updateStateAndGetBoard = async (newState) => {
  const { data, error } = await updateState(newState);
  if (error) {
    return error;
  }
  const store = await getStore(newState);

  return { state: data, store };
};

const state = await getState();
const newState = { ...state, nextPatient: "" };

logObject("updateStateAndGetBoard", await updateStateAndGetBoard(newState));

/*
MORE THINKING

Each event can hold: current state and pointer to last event. These don't need to be returned to client
No need to return "store" to client. Each shift knows its patients. 

Board object sent to client can be deeply nested
*/
