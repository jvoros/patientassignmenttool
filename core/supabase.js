import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "http://localhost:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
);

const testState = {
  state: {
    main: [1],
    flex: [2],
    patients: [1, 2],
  },
};

const getShifts = () =>
  supabase
    .from("shifts")
    .select(
      `id,
  provider:providers(id, lname, fname, role),
  info:shift_details(id, name, bonus, type),
  patients!shift_id(id),
  supervisor:patients!supervisor_id(id)
  `
    )
    .in("id", [...testState.state.main, ...testState.state.flex]);

const getPatients = () =>
  supabase
    .from("patients")
    .select(
      `
    id, room, type,
    shift:shift_id(id, provider:providers(id, lname, fname)),
    supervisor:supervisor_id(id, provider:providers(id, lname, fname))`
    )
    .in("id", [...testState.state.patients]);

const [shiftResponse, patientResponse] = await Promise.all([
  getShifts(),
  getPatients(),
]);

console.dir(patientResponse.data, { depth: 99 });
// if (error) {
//   console.log("ERROR:");
//   console.log(error);
// }
