// Immer patches work better with key: value objects than arrays
// - put patients, shifts, zones, events in to indexed objects
// - track position of those items on board with small arrays with just ids
// - then create a different object for the client without the indexes

// BOARD

type Board = {
  slug: string; // site slug
  date: number; // datetime
  zoneOrder: Zone["slug"][];
  timeline: BoardEvent["id"][];
  zones: IndexZone;
  shifts: IndexShift;
  events: IndexBoardEvent;
  patients: number[];
};

type IndexShift = Record<Shift["id"], Shift>;
type IndexZone = Record<Zone["slug"], Zone>;
type IndexBoardEvent = Record<BoardEvent["id"], BoardEvent>;

// ZONE

type Zone = {
  slug: string;
  name: string;
  type: ZoneVariant;
  superZone?: Zone["slug"]; // zone that provides supervisor
  triggerSkip?: boolean;
  next: number | null; // pointer
  super: number | null; // pointer
  shifts: Shift["id"][];
};

type ZoneMakeParams = {
  slug: Zone["slug"];
  name: string;
  type: ZoneVariant;
  superZone?: Zone["slug"];
  triggerSkip?: boolean;
};

// - list: just a list, new shifts added to end
// - simple: index 0 always up next
// - rotation: rotation
// - super: rotation, but for a supervisor only
// - dual: rotates assignment and super from same list
type ZoneVariant = "list" | "simple" | "rotation" | "dual";

type ZonePointer = "next" | "super";

// SHIFT

type ShiftStatus = "skip" | "paused" | "active";

type Shift = {
  id: string;
  name: string;
  last: Provider["last"];
  first: Provider["first"];
  role: Provider["role"];
  bonus: number;
  status: ShiftStatus;
  assigned: number;
  supervised: number;
};

// PROVIDER

type ProviderRoles = "physician" | "app" | "app-independent";

type Provider = {
  last: string;
  first: string;
  role: ProviderRoles;
};

// SCHEDULE

type ScheduleItem = {
  name: string;
  bonus: number;
  joins: Zone["slug"];
  reset?: boolean;
};

// PATIENT

type PatientModes = "walkin" | "ambo" | "police" | "ft";
type PatientCounts = "assigned" | "supervised";

type Patient = {
  id: string;
  room: string;
  time: number; // datetime
  mode: PatientModes;
};

// EVENT

type BoardEvent = EventMakeParams & {
  id: string;
  time: number;
  patches: Patch[];
};

type EventMakeParams = {
  message?: string;
  note?: string;
  mode?: PatientModes;
  room?: string;
  assign?: Shift["id"];
  super?: Shift["id"];
};

type Patch = {
  op: "replace" | "remove" | "add";
  path: (string | number)[];
  value?: any;
};

// LOGS

type LogItem = {
  date: number;
  site: string;
  shift: string;
  provider: string;
  assigned: number;
  supervised: number;
  bounty?: number;
};
