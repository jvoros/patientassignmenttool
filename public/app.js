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
        showAddDoctorPopover: false,
        showAssignPopover: false,
        showAssignMini: false,
        showMovePopover: false,
      },
      board: dummy2,
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

    // AUTH
    async checkLoginStatus() {
      console.log("checking login status");
      const res = await apiCall("checklogin");
      if (res.status === "success" && res.payload) {
        //this.user = { loggedIn: true, ...res.payload };
        this.nurse = res.payload.username === "nurse" ? true : false;
      }
      if (res.status === "error") {
        this.setError(res);
      }
    },
    // POPOVERS
    uiTogglerByShift(flag, shiftId) {
      this.ui[flag] = !this.ui[flag] ? shiftId : false;
    },

    toggleAddDoctorPopover() {
      this.ui.showAddDoctorPopover = !this.ui.showAddDoctorPopover;
    },

    toggleAssign(shiftId) {
      this.uiTogglerByShift("showAssignPopover", shiftId);
    },

    assignOpen(shiftId) {
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
  onBeforeMounted() {
    console.log("onBeforeMounted fired");
  },
  mounted() {
    console.log("Vue mounted");
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
  },
}).mount("#app");
