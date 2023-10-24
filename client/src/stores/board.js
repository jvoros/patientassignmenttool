import { defineStore } from 'pinia'

async function apiCall(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  return await response.json();
}

export const useBoardStore = defineStore('board', {
  state: () => {
    return {
      user: { loggedIn: false }, //default state
      doctors: {},
      shift_details: {},
      error: { text: 'Test Error'},
      loginError: '', //{ text: 'loginError' },
      board: boardDummy
    }
  },
  
  actions: {
    async apiCall(url, payload) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      return await response.json();
    },

    setError(err) {
      this.error = err;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },

    async login(roleAndPassword) {
      this.loginError = null;
      const res = await apiCall('api/login', roleAndPassword);
      if (res.status === 'success') {
        this.user = { loggedIn: true, ...res.payload };
      } else {
        this.loginError = res;
      }
    },

    async logout() {
      const res = await apiCall('api/logout');
      if (res.status === 'success') {
        this.user = { loggedIn: false };
      } else {
        this.setError(res);
      }
    }, 
    
    async checkLoginStatus() {
      const res = await apiCall('api/checklogin');
      if (res.status === 'success' && res.payload) {
        this.user = { loggedIn: true, ...res.payload };
      } 
      if (res.status === 'error') {
        this.setError(res);
      }
    },

    async getDoctors() {
      const res = await apiCall('api/doctors');
      if (res) this.doctors = res.doctors;
    },

    async getShifts() {
      const res = await apiCall('api/shifts');
      if (res) this.shift_details = res.shift_details;
    },

    getDoctorsAndShifts() {
      this.getDoctors();
      this.getShifts();
    }

  }
});

const boardDummy = {
  "rotations": {
      "main": {
          "name": "Main",
          "use_pointer": true,
          "pointer": 0,
          "shifts": [
              {
                  "doctor": {
                      "last": "Voros",
                      "first": "Jeremy"
                  },
                  "start": "06:00",
                  "end": "15:00",
                  "name": "6 am",
                  "bonus": 2,
                  "patients": [
                      {
                          "time": "8:42 AM",
                          "type": "ft",
                          "room": "Rm TrA"
                      },
                      {
                          "time": "8:42 AM",
                          "type": "ambo",
                          "room": "Rm 30"
                      },
                      {
                          "time": "8:42 AM",
                          "type": "walk-in",
                          "room": "Rm 20"
                      }
                  ],
                  "counts": {
                      "total": 3,
                      "ft": 1,
                      "ambo": 1,
                      "walk-in": 1
                  }
              }
          ]
      },
      "ft": {
          "name": "FT",
          "use_pointer": false,
          "pointer": 0,
          "shifts": [
              {
                  "doctor": {
                      "last": "Blake",
                      "first": "Kelly"
                  },
                  "start": "08:00",
                  "end": "17:00",
                  "name": "8 am",
                  "bonus": 2,
                  "patients": [
                      {
                          "time": "8:42 AM",
                          "type": "ft",
                          "room": "Rm TrB"
                      }
                  ],
                  "counts": {
                      "total": 1,
                      "ft": 1
                  }
              }
          ]
      },
      "off": {
          "name": "Off",
          "use_pointer": false,
          "pointer": 0,
          "shifts": [
              {
                  "doctor": {
                      "last": "Kasavana",
                      "first": "Brian"
                  },
                  "start": "10:00",
                  "end": "20:00",
                  "name": "10 am",
                  "bonus": 2,
                  "patients": [],
                  "counts": {}
              }
          ]
      }
  },
  "timeline": [
      {
          "time": "8:42 AM",
          "action": "assign",
          "rotation": "FT",
          "doctor": {
              "last": "Blake",
              "first": "Kelly"
          },
          "message": "Kelly Blake assigned Rm TrB",
          "room": "Rm TrB",
          "pt_type": "ft"
      },
      {
          "time": "8:42 AM",
          "action": "move",
          "rotation": "FT",
          "doctor": {
              "last": "Blake",
              "first": "Kelly"
          },
          "message": "Kelly Blake moved to FT",
          "room": "",
          "pt_type": ""
      },
      {
          "time": "8:42 AM",
          "action": "assign",
          "rotation": "Main",
          "doctor": {
              "last": "Voros",
              "first": "Jeremy"
          },
          "message": "Jeremy Voros assigned Rm TrA",
          "room": "Rm TrA",
          "pt_type": "ft"
      },
      {
          "time": "8:42 AM",
          "action": "assign",
          "rotation": "Main",
          "doctor": {
              "last": "Voros",
              "first": "Jeremy"
          },
          "message": "Jeremy Voros assigned Rm 30",
          "room": "Rm 30",
          "pt_type": "ambo"
      },
      {
          "time": "8:42 AM",
          "action": "assign",
          "rotation": "Main",
          "doctor": {
              "last": "Voros",
              "first": "Jeremy"
          },
          "message": "Jeremy Voros assigned Rm 20",
          "room": "Rm 20",
          "pt_type": "walk-in"
      },
      {
          "time": "8:42 AM",
          "action": "move",
          "rotation": "Off",
          "doctor": {
              "last": "Blake",
              "first": "Kelly"
          },
          "message": "Kelly Blake moved to Off",
          "room": "",
          "pt_type": ""
      },
      {
          "time": "8:42 AM",
          "action": "join",
          "rotation": "Off",
          "doctor": {
              "last": "Kasavana",
              "first": "Brian"
          },
          "message": "Brian Kasavana joined Off",
          "room": "",
          "pt_type": ""
      },
      {
          "time": "8:42 AM",
          "action": "join",
          "rotation": "FT",
          "doctor": {
              "last": "Blake",
              "first": "Kelly"
          },
          "message": "Kelly Blake joined FT",
          "room": "",
          "pt_type": ""
      },
      {
          "time": "8:42 AM",
          "action": "join",
          "rotation": "Main",
          "doctor": {
              "last": "Voros",
              "first": "Jeremy"
          },
          "message": "Jeremy Voros joined Main",
          "room": "",
          "pt_type": ""
      }
  ]
}