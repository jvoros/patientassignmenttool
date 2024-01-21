const dummy2 = {
  rotations: [
    { id: "vGeSbH", name: "Main", usePointer: true, pointer: 3, shiftCount: 6 },
    {
      id: "gSAfP5",
      name: "Fast Track",
      usePointer: false,
      pointer: 0,
      shiftCount: 5,
    },
    { id: "XRTsWq", name: "Off", usePointer: false, pointer: 0, shiftCount: 0 },
  ],
  shifts: [
    {
      id: "aibqb7",
      doctor: { last: "Voros", first: "Jeremy" },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "XRTsWq",
      order: 0,
      patients: [],
      counts: { total: 0 },
    },
    {
      id: "aibqb5",
      doctor: { last: "Voros", first: "Jeremy" },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "gSAfP5",
      order: 0,
      patients: [],
      counts: { total: 0 },
    },
    {
      id: "0FocPX",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 3,
      patients: [{ id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" }],
      counts: { total: 1, ambo: 1 },
    },
    {
      id: "xFpTmv",
      doctor: { last: "Voros", first: "Jeremy" },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 1,
      patients: [
        { id: "M0uk2P", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        { id: "UHKdon", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        { id: "TbUMVM", time: "9:46 PM", type: "fasttrack", room: "TrA" },
      ],
      counts: { total: 3, fasttrack: 3 },
    },
    {
      id: "sfzTiR",
      doctor: { last: "Kasavana", first: "Brian" },
      start: "10:00",
      end: "20:00",
      name: "10 am",
      bonus: 2,
      rotationId: "gSAfP5",
      order: 1,
      patients: [
        { id: "oahb7b", time: "9:46 PM", type: "fasttrack", room: "TrA" },
      ],
      counts: { total: 1, fasttrack: 1 },
    },
    {
      id: "zYWsE3",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 0,
      patients: [],
      counts: {},
    },
    {
      id: "IpWA9j",
      doctor: { last: "Voros", first: "Jeremy" },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 2,
      patients: [],
      counts: {},
    },
    {
      id: "JFV6Fu",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "gSAfP5",
      order: 2,
      patients: [],
      counts: {},
    },
    {
      id: "HePTQa",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "gSAfP5",
      order: 3,
      patients: [],
      counts: {},
    },
    {
      id: "1iW5kv",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "gSAfP5",
      order: 4,
      patients: [],
      counts: {},
    },
    {
      id: "JUcKyZ",
      doctor: { last: "Blake", first: "Kelly" },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 4,
      patients: [],
      counts: {},
    },
    {
      id: "AY49T8",
      doctor: { last: "Voros", first: "Jeremy" },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "vGeSbH",
      order: 5,
      patients: [],
      counts: {},
    },
  ],
  events: [
    {
      id: "uWPqiK",
      time: "9:46 PM",
      type: "order",
      shift: {
        id: "0FocPX",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 2,
        patients: [{ id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" }],
        counts: { total: 1, ambo: 1 },
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "8QPduP",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "0FocPX",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 2,
        patients: [{ id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" }],
        counts: { total: 1, ambo: 1 },
      },
      message: "11 reassigned to Kelly Blake",
      patient: { id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" },
    },
    {
      id: "N6jocd",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "aibqb5",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [{ id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" }],
        counts: { total: 1, ambo: 1 },
      },
      message: "11 assigned to Jeremy Voros",
      patient: { id: "qjKNvH", time: "9:46 PM", type: "ambo", room: "11" },
      reassign: { last: "Blake", first: "Kelly" },
    },
    {
      id: "MWKZ4G",
      time: "9:46 PM",
      type: "move",
      shift: {
        id: "aibqb5",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros moved to Fast Track",
      patient: null,
    },
    {
      id: "znZiJ5",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "aibqb5",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 3,
        patients: [],
        counts: {},
      },
      message: "Back to Jeremy Voros",
      patient: null,
    },
    {
      id: "hQC1xf",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "aibqb5",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 3,
        patients: [],
        counts: {},
      },
      message: "Skipped Jeremy Voros",
      patient: null,
    },
    {
      id: "EMQ8Y6",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "0FocPX",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
    {
      id: "79cglz",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "0FocPX",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Main",
      patient: null,
    },
    {
      id: "rD6u8Z",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "aibqb5",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "rGUOY0",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "xFpTmv",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [
          { id: "M0uk2P", time: "9:46 PM", type: "fasttrack", room: "TrA" },
          { id: "UHKdon", time: "9:46 PM", type: "fasttrack", room: "TrA" },
          { id: "TbUMVM", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        ],
        counts: { total: 3, fasttrack: 3 },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "M0uk2P",
        time: "9:46 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "EZWX08",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "xFpTmv",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [
          { id: "UHKdon", time: "9:46 PM", type: "fasttrack", room: "TrA" },
          { id: "TbUMVM", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        ],
        counts: { total: 2, fasttrack: 2 },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "UHKdon",
        time: "9:46 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "WQqePH",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "xFpTmv",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [
          { id: "TbUMVM", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        ],
        counts: { total: 1, fasttrack: 1 },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "TbUMVM",
        time: "9:46 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "w8lKn7",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "xFpTmv",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "zoRCqi",
      time: "9:46 PM",
      type: "assign",
      shift: {
        id: "sfzTiR",
        doctor: { last: "Kasavana", first: "Brian" },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [
          { id: "oahb7b", time: "9:46 PM", type: "fasttrack", room: "TrA" },
        ],
        counts: { total: 1, fasttrack: 1 },
      },
      message: "TrA assigned to Brian Kasavana",
      patient: {
        id: "oahb7b",
        time: "9:46 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "NQ1WgT",
      time: "9:46 PM",
      type: "order",
      shift: {
        id: "zYWsE3",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "FmBq2c",
      time: "9:46 PM",
      type: "order",
      shift: {
        id: "zYWsE3",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "lexKig",
      time: "9:46 PM",
      type: "move",
      shift: {
        id: "sfzTiR",
        doctor: { last: "Kasavana", first: "Brian" },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Brian Kasavana moved to Fast Track",
      patient: null,
    },
    {
      id: "Bz45FU",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "sfzTiR",
        doctor: { last: "Kasavana", first: "Brian" },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Brian Kasavana joined Main",
      patient: null,
    },
    {
      id: "uEqnyw",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "zYWsE3",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
    {
      id: "FLVosD",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "zYWsE3",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Main",
      patient: null,
    },
    {
      id: "uMG3Nh",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "IpWA9j",
        doctor: { last: "Voros", first: "Jeremy" },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "ELbGzn",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "JFV6Fu",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "NxkL9E",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "HePTQa",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "zjPAhQ",
      time: "9:46 PM",
      type: "join",
      shift: {
        id: "1iW5kv",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "gSAfP5",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "nqQ6NS",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "JUcKyZ",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Back to Kelly Blake",
      patient: null,
    },
    {
      id: "7RpvhC",
      time: "9:46 PM",
      type: "pointer",
      shift: {
        id: "JUcKyZ",
        doctor: { last: "Blake", first: "Kelly" },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "vGeSbH",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
  ],
};
