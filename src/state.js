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
    shift_details: [],
    shifts: {},
    doctors: [],

    async initialize(db) {
        this.shift_details = await db.getShiftDetails();
        this.shifts = await db.getShifts();
        this.doctors = await db.getDoctors();
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
        return this.shifts.on_rotation.map(d => ({
            id: d.id,
            rotation_order: d.rotation_order < this.pointer ? d.rotation_order : d.rotation_order + 1
          }));
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
        return arr;
    },

    moveRotationOrder(shift, dir) {
        const order = shift.rotation_order;
        const neworder = (dir == 'up' ? order-1 : order+1)
        // get  displaced shift
        const moveShift = this.shifts.on_rotation[neworder];
        // update query for each shift
        return [
            { id: shift.id, rotation_order: neworder},
            { id: moveShift.id, rotation_order: order}
        ];
    },

    advancePointer() {
        // 3 mod 5 returns 3, 5 mod 5 returns 0
        // modulo wraps back to zero at the end
        this.pointer = (this.pointer + 1) % this.shifts.on_rotation.length;
    },

    getShiftById(id) {
        return Object.values(this.shifts).flat().find(s=>s.id === id) || false;
    },

    resetShiftQuery() {
        return Object.values(this.shifts).flat().map(s=>({id: s.id, status_id: 4, rotation_order: null}));
    }
    
}