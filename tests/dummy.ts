import Board from "../core/board.js";

type Dummy = {
  patients: { room: string; mode: PatientModes }[];
  schedules: { name: string; bonus: number; joins: string }[];
  providers: Provider[];
  zones: ZoneMakeParams[];
};

const dummy: Dummy = {
  patients: [
    { room: "Tr A", mode: "ft" },
    { room: "1", mode: "ambo" },
    { room: "Tr A", mode: "police" },
    { room: "Tr A", mode: "walkin" },
  ],

  schedules: [
    {
      name: "6a-3p",
      bonus: 2,
      joins: "main",
    },
    {
      name: "6a-3p APP",
      bonus: 0,
      joins: "main",
    },
    {
      name: "8a-6p",
      bonus: 2,
      joins: "main",
    },
  ],

  providers: [
    {
      last: "Voros",
      first: "Jeremy",
      role: "physician",
    },
    {
      last: "Kasvana",
      first: "Brian",
      role: "app",
    },
    {
      last: "Blake",
      first: "Kelly",
      role: "physician",
    },
  ],

  zones: [
    {
      slug: "main",
      name: "Main Rotation",
      type: "dual",
      superZone: "main",
    },
    {
      slug: "ft",
      name: "Fast Track",
      type: "simple",
      superZone: "main",
      triggerSkip: true,
    },
    {
      slug: "off",
      name: "Off Rotation",
      type: "list",
      superZone: "",
    },
    {
      slug: "trauma",
      name: "Trauma Rotation",
      type: "rotation",
      superZone: "trauma",
    },
  ],
};

export const makeBoard = (): Board => {
  const board = Board.make({ slug: "smh", zoneConfig: dummy.zones });
  Board.signIn(board, { provider: dummy.providers[0], schedule: dummy.schedules[0] });
  return board;
};

export const lastEvent = (board: Board): BoardEvent => board.events[board.timeline[0]];

export default dummy;
