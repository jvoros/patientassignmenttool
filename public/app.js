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
      user: { role: "none" },
      ui: { showAddDoctorPopover: false },
    };
  },
  methods: {
    async checkLoginStatus() {
      console.log("checking login status");
      const res = await apiCall("checklogin");
      if (res.status === "success" && res.payload) {
        this.user = { loggedIn: true, ...res.payload };
      }
      if (res.status === "error") {
        this.setError(res);
      }
    },
    toggleAddDoctorPopover() {
      this.ui.showAddDoctorPopover = !this.ui.showAddDoctorPopover;
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
