type Board = {
  main: Shift[];
  flex: Shift[];
  off: Shift[];
  events: BoardEvent[];
  nextFt: number;
  nextProvider: number;
  nextSupervisor: number;
};

type State = {
  main: ShiftTuple[];
  flex: ShiftTuple[];
  off: ShiftTuple[];
  events: number[];
  nextFt: number;
  nextProvider: number;
  nextSupervisor: number;
};

type ShiftTuple = {
  id: number;
  type: string;
};

type Shift = {
  id: number;
  type: string;
  info: { bonus: number };
  provider: Provider;
  patients: { count: number };
};

type Provider = {
  id: number;
  lname: string;
  fname: string;
  role: string;
};

type Patient = {
  id: number;
  type: string;
  room: string;
  shiftId?: number;
  supervisorId?: number;
};

// EVENTS

type BoardEvent = {
  id: number;
  event_type: string;
  shift?: Shift;
  patient?: Patient;
};

type EventOptions = {
  type: string;
  shiftId?: number;
  patientId?: number;
};

// ROTATION
type Next = string;
type IndexAndNeighbor = {
  index: number;
  nextIndex: number;
  nextShift: ShiftTuple;
};

// PATIENT
type AddPatientOptions = {
  type: string;
  room: string;
};

type AddPatientOptionsDB = {
  type: string;
  room: string;
  shiftId: number;
  supervisorId?: number;
};

type UpdatePatientOptions = {
  shiftId: number;
  supervisorId?: number;
};
