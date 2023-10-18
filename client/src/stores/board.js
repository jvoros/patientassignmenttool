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
      user: { loggedIn: false },
      error: null,
      board: null
    }
  },
  
  actions: {

    setError(err) {
      this.error = err;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },

    async login(roleAndPassword) {
      const res = await apiCall('api/login', roleAndPassword);
      if (res.type === 'success') {
        this.user = { loggedIn: true, ...res.payload };
      } else {
        this.setError(res);
      }
    },

    logout() {
      this.user = { loggedIn: false }
    }

  }
});