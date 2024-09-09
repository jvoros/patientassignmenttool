import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { logObject } from "./helper-functions.js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_LOCAL
);

// BOARD
const getLastState = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("state")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data.state;
};
const ptQuery = `
  id, room, patient_type,
  shift:shift_id(id, provider:providers(id, lname, fname)),
  supervisor:supervisor_id(id, provider:providers(id, lname, fname))
  `;

const shiftsQuery = `
  id,
  provider:providers(id, lname, fname, role),
  info:shift_details(id, name, bonus, shift_type),
  patients!shift_id(id),
  supervisor:patients!supervisor_id(id)
  `;

const eventsQuery = `
    id, message, detail, event_type, previous_event,
    shift:shift_id(id, provider:providers(id, lname, fname)),
    patient:patients(${ptQuery})
    `;

const getRecords = (table, query, ids) =>
  supabase.from(table).select(query).in("id", ids);

const hydrateIds = (ids, records) =>
  ids.map((id) => records.find((record) => record.id === id));

export const getBoardFromState = async (state) => {
  const stateShifts = [...state.main, ...state.flex, ...state.off];
  // https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
  const response = await Promise.all([
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
    next: state.next,
    super: state.super,
    ft: state.ft,
  };
};

const initialState = {
  main: [1, 3],
  flex: [2, 4],
  off: [],
  events: [1],
  ft: 2,
  next: 1,
  super: 1,
};

const lastState = await getLastState();

logObject("getBoardFromState", await getBoardFromState(lastState));
