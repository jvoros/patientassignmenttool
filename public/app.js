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
      ui: { showAddDoctorPopover: false },
      board: dummy2,
    };
  },
  methods: {
    // HELPERS
    findRotationById(id) {
      const result = [];
      Object.keys(this.board.rotations).forEach((key) => {
        if (this.board.rotations[key].id === id) {
          result.push(this.board.rotations[key]);
        }
      });
      return result[0];
    },

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
    toggleAddDoctorPopover() {
      this.ui.showAddDoctorPopover = !this.ui.showAddDoctorPopover;
    },
    // SHIFT
    isNext(rotation, shift) {
      if (rotation.name === "Off") return false;
      return shift.order === rotation.pointer;
    },
    isMainNext(rotation, shift) {
      return this.isNext(rotation, shift) && rotation.name === "Main";
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
