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
      "name": "main",
      "use_pointer": true,
      "pointer": 1,
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
          "patients": [],
          "counts": {}
        },
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
              "time": "3:46 PM",
              "type": "walk-in",
              "room": "19"
            }
          ],
          "counts": {
            "total": 1,
            "walk-in": 1
          }
        }
      ]
    },
    "ft": {
      "name": "ft",
      "use_pointer": false,
      "pointer": 0,
      "shifts": []
    },
    "off": {
      "name": "off",
      "use_pointer": false,
      "pointer": 0,
      "shifts": []
    }
  },
  "timeline": [
    {
      "time": "3:46 PM",
      "action": "skip",
      "rotation": "main",
      "doctor": {
        "last": "Blake",
        "first": "Kelly"
      },
      "message": "skip"
    },
    {
      "time": "3:46 PM",
      "action": "join",
      "rotation": "main",
      "doctor": {
        "last": "Blake",
        "first": "Kelly"
      },
      "message": "Joined main"
    },
    {
      "time": "3:46 PM",
      "action": "move",
      "rotation": "main",
      "doctor": {
        "last": "Voros",
        "first": "Jeremy"
      },
      "message": "Left ft and joined main"
    },
    {
      "time": "3:46 PM",
      "action": "move",
      "rotation": "ft",
      "doctor": {
        "last": "Voros",
        "first": "Jeremy"
      },
      "message": "Left main and joined ft"
    },
    {
      "time": "3:46 PM",
      "action": "walk-in",
      "rotation": "main",
      "doctor": {
        "last": "Voros",
        "first": "Jeremy"
      },
      "message": "Room 19"
    },
    {
      "time": "3:46 PM",
      "action": "ft",
      "rotation": "main",
      "doctor": {
        "last": "Blake",
        "first": "Kelly"
      },
      "message": "Room 17"
    },
    {
      "time": "3:46 PM",
      "action": "ambo",
      "rotation": "main",
      "doctor": {
        "last": "Voros",
        "first": "Jeremy"
      },
      "message": "Room 30"
    },
    {
      "time": "3:46 PM",
      "action": "ft",
      "rotation": "main",
      "doctor": {
        "last": "Carmack",
        "first": "Brian"
      },
      "message": "TR A"
    },
    {
      "time": "3:46 PM",
      "action": "join",
      "rotation": "main",
      "doctor": {
        "last": "Voros",
        "first": "Jeremy"
      },
      "message": "Joined main"
    }
  ]
}