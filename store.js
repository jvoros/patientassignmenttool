// store holds the state of the app
// the exported methods modify the store
// then return the complete store with every modification

// utility object
function Doctor(name) {
	this.name = name;
	this.turn = 0;
	this.count = 0;
}

// base state
let store = {
	pointer: 0,
	doctors: [new Doctor("Voros"), new Doctor("Stevens")],
	inactive: []
};

// data control methods
module.exports = {
    // initial state
    get() {
        return store;
    },

	loginDoctor(name) {
		// insert doctor at pointer, to avoid changing rotation
        store.doctors.splice(store.pointer, 0, new Doctor(name));
        return store;
    },
	
	logoutDoctor(i) {
        if (i == store.doctors.length - 1) store.pointer = 0;
        store.inactive.push(store.doctors[i]);
        store.doctors.splice(i, 1);
        return store;
	},
	
	moveUp(index) {
        i = parseInt(index);
        if (i == 0) return store;
        [store.doctors[i], store.doctors[i-1]] = [store.doctors[i-1], store.doctors[i]];
        return store;
	},
	
	moveDown(index) {
        // https://stackoverflow.com/questions/30475749/about-5-1-51-in-javascript-plus-and-minus-signs
        i = parseInt(index); 
        if (i == store.doctors.length - 1) return store;
        [store.doctors[i], store.doctors[i+1]] = [store.doctors[i+1], store.doctors[i]];
        return store;
	},


	takeTurn() {
		store.doctors[store.pointer].count++;
		store.doctors[store.pointer].turn++;
		store.pointer = store.pointer < store.doctors.length-1 ? store.pointer+1 : 0;
		return store;
	},
	
	assignPatient() {
        const d = store.doctors[store.pointer];
        if (d.turn === 0 && d.count < 2) {
            d.count++;
            return store;
        }
        if (d.turn === 1 && d.count < 4) {
            d.count++;
            return store;
        }
        return this.takeTurn();
	}
};
