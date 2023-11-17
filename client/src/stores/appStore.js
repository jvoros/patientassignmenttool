import { defineStore } from "pinia";

import apiCall from "./apiCall";

export const useAppStore = defineStore("board", {
  state: () => {
    return {
      user: { loggedIn: false }, //default state
      doctors: {},
      shift_details: {},
      error: "", //{ text: 'Test Error'},
      loginError: "", //{ text: 'loginError' },
    };
  },

  actions: {
    // async apiCall(url, payload) {
    //   console.log("actions apiCall...");
    //   try {
    //     const response = await fetch(url, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(payload),
    //     });
    //     const res = await response.json();
    //     console.log(response);
    //     if (response.status === 200) return res;
    //     this.error = res.message;
    //   } catch (err) {
    //     console.log(err);
    //     this.error = err;
    //   }
    // },

    setError(err) {
      this.error = err;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },

    async login(roleAndPassword) {
      this.loginError = null;
      const res = await apiCall("api/login", roleAndPassword);
      if (res.status === "success") {
        this.user = { loggedIn: true, ...res.payload };
      } else {
        this.loginError = res;
      }
    },

    async logout() {
      const res = await apiCall("api/logout");
      if (res.status === "success") {
        this.user = { loggedIn: false };
      } else {
        this.setError(res);
      }
    },

    async checkLoginStatus() {
      const res = await apiCall("api/checklogin");
      if (res.status === "success" && res.payload) {
        this.user = { loggedIn: true, ...res.payload };
      }
      if (res.status === "error") {
        this.setError(res);
      }
    },

    async getDoctors() {
      const res = await apiCall("api/doctors");
      if (res) this.doctors = res.doctors;
    },

    async getShifts() {
      const res = await apiCall("api/shifts");
      if (res) this.shift_details = res.shift_details;
    },

    getDoctorsAndShifts() {
      this.getDoctors();
      this.getShifts();
    },

    async getBoard() {
      apiCall("api/board");
    },

    async addShift(doctor, shift) {
      apiCall("api/addShift", { doctor, options: shift });
    },

    async moveShift(shiftId, offset) {
      apiCall("api/moveShift", { shiftId, offset });
    },

    async undo() {
      apiCall("api/undo");
    },
  },
});

const boardDummy = {
  rotations: {
    main: {
      name: "Main",
      use_pointer: true,
      pointer: 1,
      shifts: [
        {
          doctor: {
            last: "Voros",
            first: "Jeremy",
          },
          start: "06:00",
          end: "15:00",
          name: "6 am",
          bonus: 2,
          patients: [
            {
              time: "8:42 AM",
              type: "ft",
              room: "Rm TrA",
            },
            {
              time: "8:42 AM",
              type: "ambo",
              room: "Rm 30",
            },
            {
              time: "8:42 AM",
              type: "walk-in",
              room: "Rm 20",
            },
          ],
          counts: {
            total: 3,
            ft: 1,
            ambo: 1,
            "walk-in": 1,
          },
        },
        {
          doctor: {
            last: "Blake",
            first: "Kelly",
          },
          start: "06:00",
          end: "15:00",
          name: "6 am",
          bonus: 2,
          patients: [
            {
              time: "8:42 AM",
              type: "ft",
              room: "Rm TrA",
            },
            {
              time: "8:42 AM",
              type: "ambo",
              room: "Rm 30",
            },
            {
              time: "8:42 AM",
              type: "walk-in",
              room: "Rm 20",
            },
          ],
          counts: {
            total: 3,
            ft: 1,
            ambo: 1,
            "walk-in": 1,
          },
        },
      ],
    },
    ft: {
      name: "Fast Track",
      use_pointer: false,
      pointer: 0,
      shifts: [
        {
          doctor: {
            last: "Blake",
            first: "Kelly",
          },
          start: "08:00",
          end: "17:00",
          name: "8 am",
          bonus: 2,
          patients: [
            {
              time: "8:42 AM",
              type: "ft",
              room: "Rm TrB",
            },
          ],
          counts: {
            total: 1,
            ft: 1,
          },
        },
      ],
    },
    off: {
      name: "Off",
      use_pointer: false,
      pointer: 0,
      shifts: [
        {
          doctor: {
            last: "Kasavana",
            first: "Brian",
          },
          start: "10:00",
          end: "20:00",
          name: "10 am",
          bonus: 2,
          patients: [],
          counts: {},
        },
      ],
    },
  },
  timeline: [
    {
      time: "8:42 AM",
      action: "assign",
      rotation: "FT",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      message: "Kelly Blake assigned Rm TrB",
      room: "Rm TrB",
      pt_type: "ft",
    },
    {
      time: "8:42 AM",
      action: "move",
      rotation: "FT",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      message: "Kelly Blake moved to FT",
      room: "",
      pt_type: "",
    },
    {
      time: "8:42 AM",
      action: "assign",
      rotation: "Main",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      message: "Jeremy Voros assigned Rm TrA",
      room: "Rm TrA",
      pt_type: "ft",
    },
    {
      time: "8:42 AM",
      action: "assign",
      rotation: "Main",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      message: "Jeremy Voros assigned Rm 30",
      room: "Rm 30",
      pt_type: "ambo",
    },
    {
      time: "8:42 AM",
      action: "assign",
      rotation: "Main",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      message: "Jeremy Voros assigned Rm 20",
      room: "Rm 20",
      pt_type: "walk-in",
    },
    {
      time: "8:42 AM",
      action: "move",
      rotation: "Off",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      message: "Kelly Blake moved to Off",
      room: "",
      pt_type: "",
    },
    {
      time: "8:42 AM",
      action: "join",
      rotation: "Off",
      doctor: {
        last: "Kasavana",
        first: "Brian",
      },
      message: "Brian Kasavana joined Off",
      room: "",
      pt_type: "",
    },
    {
      time: "8:42 AM",
      action: "join",
      rotation: "FT",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      message: "Kelly Blake joined FT",
      room: "",
      pt_type: "",
    },
    {
      time: "8:42 AM",
      action: "join",
      rotation: "Main",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      message: "Jeremy Voros joined Main",
      room: "",
      pt_type: "",
    },
  ],
};

const boardDummy2 = {
  rotations: [
    {
      id: "FLckh9",
      name: "Main",
      usePointer: true,
      pointer: 3,
      shiftCount: 6,
    },
    {
      id: "bqcu03",
      name: "Fast Track",
      usePointer: false,
      pointer: 0,
      shiftCount: 5,
    },
    {
      id: "6cd2bg",
      name: "Off",
      usePointer: false,
      pointer: 0,
      shiftCount: 0,
    },
  ],
  shifts: [
    {
      id: "VmP1PY",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "bqcu03",
      order: 0,
      patients: [],
      counts: {
        total: 0,
      },
    },
    {
      id: "r8Sb4f",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 3,
      patients: [
        {
          id: "aaKo8A",
          time: "7:50 PM",
          type: "ambo",
          room: "11",
        },
      ],
      counts: {
        total: 1,
        ambo: 1,
      },
    },
    {
      id: "t6l9Ez",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 1,
      patients: [
        {
          id: "DOmj08",
          time: "7:50 PM",
          type: "fasttrack",
          room: "TrA",
        },
        {
          id: "u5yjZe",
          time: "7:50 PM",
          type: "fasttrack",
          room: "TrA",
        },
        {
          id: "EJTVZl",
          time: "7:50 PM",
          type: "fasttrack",
          room: "TrA",
        },
      ],
      counts: {
        total: 3,
        fasttrack: 3,
      },
    },
    {
      id: "8Bp95H",
      doctor: {
        last: "Kasavana",
        first: "Brian",
      },
      start: "10:00",
      end: "20:00",
      name: "10 am",
      bonus: 2,
      rotationId: "bqcu03",
      order: 1,
      patients: [
        {
          id: "WhhTFO",
          time: "7:50 PM",
          type: "fasttrack",
          room: "TrA",
        },
      ],
      counts: {
        total: 1,
        fasttrack: 1,
      },
    },
    {
      id: "xmb69y",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 0,
      patients: [],
      counts: {},
    },
    {
      id: "z98p12",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 2,
      patients: [],
      counts: {},
    },
    {
      id: "Cd7hrj",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "bqcu03",
      order: 2,
      patients: [],
      counts: {},
    },
    {
      id: "0tq3sa",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "bqcu03",
      order: 3,
      patients: [],
      counts: {},
    },
    {
      id: "8Dl2uI",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "bqcu03",
      order: 4,
      patients: [],
      counts: {},
    },
    {
      id: "TVBRqv",
      doctor: {
        last: "Blake",
        first: "Kelly",
      },
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 4,
      patients: [],
      counts: {},
    },
    {
      id: "nDCQ1G",
      doctor: {
        last: "Voros",
        first: "Jeremy",
      },
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
      rotationId: "FLckh9",
      order: 5,
      patients: [],
      counts: {},
    },
  ],
  events: [
    {
      id: "4QNIKi",
      time: "7:50 PM",
      type: "order",
      shift: {
        id: "r8Sb4f",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 2,
        patients: [
          {
            id: "aaKo8A",
            time: "7:50 PM",
            type: "ambo",
            room: "11",
          },
        ],
        counts: {
          total: 1,
          ambo: 1,
        },
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "A38aFS",
      time: "7:50 PM",
      type: "assign",
      shift: {
        id: "VmP1PY",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [
          {
            id: "aaKo8A",
            time: "7:50 PM",
            type: "ambo",
            room: "11",
          },
        ],
        counts: {
          total: 1,
          ambo: 1,
        },
      },
      message: "11 assigned to Jeremy Voros",
      patient: {
        id: "aaKo8A",
        time: "7:50 PM",
        type: "ambo",
        room: "11",
      },
      reassign: {
        last: "Blake",
        first: "Kelly",
      },
    },
    {
      id: "E3DLHp",
      time: "7:50 PM",
      type: "move",
      shift: {
        id: "VmP1PY",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros moved to Fast Track",
      patient: null,
    },
    {
      id: "iSrq7G",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "VmP1PY",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 3,
        patients: [],
        counts: {},
      },
      message: "Back to Jeremy Voros",
      patient: null,
    },
    {
      id: "E0ChHK",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "VmP1PY",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 3,
        patients: [],
        counts: {},
      },
      message: "Skipped Jeremy Voros",
      patient: null,
    },
    {
      id: "0ZNsXk",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "r8Sb4f",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
    {
      id: "A3a5A9",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "r8Sb4f",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Main",
      patient: null,
    },
    {
      id: "HPbz0k",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "VmP1PY",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 2,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "WnGYVP",
      time: "7:50 PM",
      type: "assign",
      shift: {
        id: "t6l9Ez",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [
          {
            id: "DOmj08",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
          {
            id: "u5yjZe",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
          {
            id: "EJTVZl",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
        ],
        counts: {
          total: 3,
          fasttrack: 3,
        },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "DOmj08",
        time: "7:50 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "wxNpcb",
      time: "7:50 PM",
      type: "assign",
      shift: {
        id: "t6l9Ez",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [
          {
            id: "u5yjZe",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
          {
            id: "EJTVZl",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
        ],
        counts: {
          total: 2,
          fasttrack: 2,
        },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "u5yjZe",
        time: "7:50 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "ck41gP",
      time: "7:50 PM",
      type: "assign",
      shift: {
        id: "t6l9Ez",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [
          {
            id: "EJTVZl",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
        ],
        counts: {
          total: 1,
          fasttrack: 1,
        },
      },
      message: "TrA assigned to Jeremy Voros",
      patient: {
        id: "EJTVZl",
        time: "7:50 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "oo3dCK",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "t6l9Ez",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "AhibgL",
      time: "7:50 PM",
      type: "assign",
      shift: {
        id: "8Bp95H",
        doctor: {
          last: "Kasavana",
          first: "Brian",
        },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [
          {
            id: "WhhTFO",
            time: "7:50 PM",
            type: "fasttrack",
            room: "TrA",
          },
        ],
        counts: {
          total: 1,
          fasttrack: 1,
        },
      },
      message: "TrA assigned to Brian Kasavana",
      patient: {
        id: "WhhTFO",
        time: "7:50 PM",
        type: "fasttrack",
        room: "TrA",
      },
    },
    {
      id: "9LHVp2",
      time: "7:50 PM",
      type: "order",
      shift: {
        id: "xmb69y",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "SehSpw",
      time: "7:50 PM",
      type: "order",
      shift: {
        id: "xmb69y",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake changed position",
      patient: null,
    },
    {
      id: "BIEVSr",
      time: "7:50 PM",
      type: "move",
      shift: {
        id: "8Bp95H",
        doctor: {
          last: "Kasavana",
          first: "Brian",
        },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Brian Kasavana moved to Fast Track",
      patient: null,
    },
    {
      id: "BRF8kK",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "8Bp95H",
        doctor: {
          last: "Kasavana",
          first: "Brian",
        },
        start: "10:00",
        end: "20:00",
        name: "10 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 1,
        patients: [],
        counts: {},
      },
      message: "Brian Kasavana joined Main",
      patient: null,
    },
    {
      id: "PIo3uR",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "xmb69y",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
    {
      id: "rBfwVZ",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "xmb69y",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Main",
      patient: null,
    },
    {
      id: "5pG66J",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "z98p12",
        doctor: {
          last: "Voros",
          first: "Jeremy",
        },
        start: "06:00",
        end: "15:00",
        name: "6 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Jeremy Voros joined Main",
      patient: null,
    },
    {
      id: "nDNc7G",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "Cd7hrj",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "ybBX2w",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "0tq3sa",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "BGDjcF",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "8Dl2uI",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "bqcu03",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Fast Track",
      patient: null,
    },
    {
      id: "1PngNS",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "TVBRqv",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Back to Kelly Blake",
      patient: null,
    },
    {
      id: "sfwAPS",
      time: "7:50 PM",
      type: "pointer",
      shift: {
        id: "TVBRqv",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Skipped Kelly Blake",
      patient: null,
    },
    {
      id: "jRjxt8",
      time: "7:50 PM",
      type: "join",
      shift: {
        id: "TVBRqv",
        doctor: {
          last: "Blake",
          first: "Kelly",
        },
        start: "08:00",
        end: "17:00",
        name: "8 am",
        bonus: 2,
        rotationId: "FLckh9",
        order: 0,
        patients: [],
        counts: {},
      },
      message: "Kelly Blake joined Main",
      patient: null,
    },
  ],
};
