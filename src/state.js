// utility functions
function myDate() {
    const d = new Date();
    return ({
        db: d.toLocaleDateString("fr-CA", {timeZone: "America/Denver"}),
        st: d.toLocaleDateString("en-US", {timeZone: "America/Denver"}),
    })
}

export default {
    error: '',
    date: '',
    datestring: '',
    pointer: 0,
    doctors: [],
    shift_details: [],
    shifts: {},

    async initialize(db) {
        this.doctors = await db.getDoctors();
        this.shift_details = await db.getShiftDetails();
        this.shifts = await db.getShifts(this.date);
        this.newDates();
        return this;
    },

    newDates() {
        const d = new Date();
        this.date = d.toLocaleDateString("fr-CA", {timeZone: "America/Denver"});
        this.datestring = d.toLocaleDateString("en-US", {timeZone: "America/Denver"});
    },
    
    getPointerShift() {
        return this.shifts.on_rotation[this.pointer];
    },

    newRotationOrdersOnNew() {
        const arr = []
        this.shifts.on_rotation.forEach((d)=> {
            if (d.rotation_order < this.pointer) arr.push({id: d.id, rotation_order: d.rotation_order});
            if (d.rotation_order >= this.pointer) arr.push({ id: d.id, rotation_order: d.rotation_order+1});
        });
        return arr;
    },

    newRotationOrderOnOff(order) {
        const arr = this.shifts.on_rotation.map(s => {
            let new_order;
            if (s.rotation_order < order) { 
                new_order = s.rotation_order; 
            } else if (s.rotation_order == order) { 
                new_order = null; 
            } else { 
                new_order = s.rotation_order-1; 
            }
            return ({ id: s.id, rotation_order: new_order });
        });
        console.log(arr);
        return arr;
    },


    moveRotationOrder(shift, dir) {
        const order = shift.rotation_order;
        const neworder = (dir == 'up' ? order-1 : order+1)
        // get  displaced shift
        let moveShift = this.shifts.on_rotation[neworder];
        // update query for each shift
        const arr = [
            { id: shift.id, rotation_order: neworder},
            { id: moveShift.id, rotation_order: order}
        ];
        console.log(arr);
        return arr;
    },

    advancePointer() {
        if (this.pointer == this.shifts.on_rotation.length-1) {
            this.pointer = 0; 
        } else { 
            this.pointer++;
        }
    },

    getShiftById(id) {
        let index = this.shifts.on_rotation.findIndex(s=>s.id == id);
        if (index > -1) {
            return this.shifts.on_rotation[index];
        }
        index = this.shifts.off_rotation.findIndex(s=>s.id == id);
        return this.shifts.off_rotation[index]
    },

    resetDocQuery() {
        return this.doctors.map(d=>({id: d.id, working: false}));
    },

    resetShiftQuery() {
        const a = [...this.shifts.on_rotation, ...this.shifts.off_rotation]
        return a.map(s=>({id: s.id, archived: true, on_rotation: false, rotation_order: null}));
    }
}