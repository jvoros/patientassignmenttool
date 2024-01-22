import { createApp } from "vue";

async function apiCall(url, payload, method = "POST") {
  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
    // if (response.ok) {
    //   return json;
    // } else {
    //   console.log("API CALL: !response.ok", json);
    // }
  } catch (error) {
    console.log("API CALL ERROR: ", error);
    return error;
    //throw new Error(error.message);
  }
}

createApp({
  data() {
    return {
      nurse: false,
      ui: {
        showAddShiftPopover: false,
        showAssignPopover: false,
        showAssignMini: false,
        showMovePopover: false,
        showReassignPopover: false,
      },
      forms: {
        addShift: {
          doctor: "",
          shift: "",
          rotationId: "",
        },
      },
      board: { rotations: [], shifts: [], events: [] },
      doctors: doctors, // imported js files with constants
      shiftDetails: shiftDetails, // imported js files with constants
      rooms: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "27",
        "28",
        "29",
        "30",
        "T.A",
        "T.B",
        "T.C",
        "H.A",
        "H.B",
        "H.C",
        "H.D",
        "H.E",
        "H.F",
        "Other",
      ],
    };
  },
  methods: {
    // HELPERS
    findRotationByName(name) {
      return this.board.rotations.filter((r) => r.name === name);
    },

    findShiftsByRotation(rotationId) {
      return this.board.shifts
        .filter((s) => s.rotationId === rotationId)
        .sort((a, b) => a.order - b.order);
    },

    getShiftsSortedByDoc() {
      return this.board.shifts.toSorted((a, b) => {
        const nameA = a.doctor.last.toUpperCase();
        const nameB = b.doctor.last.toUpperCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
    },

    filteredDoctors() {
      return this.doctors
        .map((doc) => `${doc.first} ${doc.last}`)
        .filter(
          (doc) =>
            !this.board.shifts
              .map((shift) => `${shift.doctor.first} ${shift.doctor.last}`)
              .includes(doc)
        );
    },

    // SERVER
    async checkLoginStatus() {
      console.log("Checking login status");
      const res = await apiCall("checklogin");
      if (res.status === "success" && res.payload) {
        //this.user = { loggedIn: true, ...res.payload };
        this.nurse = res.payload.username === "nurse" ? true : false;
      }
      if (res.status === "error") {
        this.setError(res);
      }
    },

    handleNewState(state) {
      this.board = state;
    },

    // API Calls
    addShift() {
      const f = this.forms.addShift;
      apiCall("api/addShift", {
        doctor: f.doctor,
        options: { ...f.shift, rotationId: f.rotationId },
      });
      this.toggleAddShiftPopover();
    },

    moveShift(shiftId, offset) {
      apiCall("api/moveShift", { shiftId, offset });
    },

    moveShiftToRotation(rotationId, shiftId) {
      apiCall("api/moveShiftToRotation", { rotationId, shiftId });
      this.toggleMovePopover(shiftId);
    },

    // POPOVERS
    uiTogglerByShift(flag, shiftId) {
      this.ui[flag] = !this.ui[flag] ? shiftId : false;
    },

    toggleAddShiftPopover() {
      this.ui.showAddShiftPopover = !this.ui.showAddShiftPopover;
      Object.keys(this.forms.addShift).forEach(
        (key) => (this.forms.addShift[key] = "")
      );
    },

    toggleAssign(shiftId) {
      this.uiTogglerByShift("showAssignPopover", shiftId);
    },

    assignPopoverOpen(shiftId) {
      return shiftId === this.ui.showAssignPopover;
    },

    toggleAssignMini(shiftId) {
      this.uiTogglerByShift("showAssignMini", shiftId);
    },

    assignMiniOpen(shiftId) {
      return shiftId === this.ui.showAssignMini;
    },

    toggleMovePopover(shiftId) {
      this.uiTogglerByShift("showMovePopover", shiftId);
    },

    movePopoverOpen(shiftId) {
      return shiftId === this.ui.showMovePopover;
    },

    toggleReassignPopover(eventId) {
      this.uiTogglerByShift("showReassignPopover", eventId);
    },

    reassignPopoverOpen(eventId) {
      return eventId === this.ui.showReassignPopover;
    },

    // SHIFT
    isNext(rotation, shift) {
      if (rotation.name === "Off") return false;
      return shift.order === rotation.pointer;
    },
    getShiftClasses(rotation, shift) {
      const shiftType = {
        Off: "shiftOff",
        "Fast Track": "shiftFastTrack",
        Main: "shiftMain",
      };
      const mainNext =
        this.isNext(rotation, shift) && rotation.name === "Main"
          ? "shiftNext"
          : "";
      return `${shiftType[rotation.name]} ${mainNext}`;
    },
  },

  mounted() {
    this.checkLoginStatus();
    const socket = io();
    socket.on("connect", () => {
      console.log("Socket connected");
      // establish sockets to listen
      // socket.on("new state", (state) => {
      //   this.handleState(state);
      // });
      // fire off first event after socket set up
      // this.apifetch("/api");
    });
    socket.on("new state", (state) => {
      console.log("New state received");
      this.handleNewState(state);
      //console.log(state);
    });
  },
}).mount("#app");
