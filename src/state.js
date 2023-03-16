import db from './db.js';

// utility functions & constants
const TIMELINE_LIMIT = 20;
const FIRST_TURN_BONUS = 2;



export default {
    error: '',
    date: '',
    datestring: '',
    pointer: 0,
    shift_details: [],
    shifts: {},
    doctors: [],
    timeline: [],

    // UTILITIES
    async initialize() {
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

    // TIMELINE
    createAction(act, shift_id, msg, initials = 'Anon') {
        const time = new Date();
        return {
            action: act,
            shift_id: shift_id,
            doctor: shift_id == 0 ? {last: 'Nurse', first: 'Triage'} : this.getShiftById(shift_id).doctor,
            msg: msg,
            initials: initials,
            time: time.toLocaleString('en-US', {timeZone: "America/Denver", timeStyle: 'short'})
        }
    },

    newAction(act, shift_id, msg, initials) {
        if (this.timeline.length >= TIMELINE_LIMIT) this.timeline.pop();
        this.timeline.unshift(this.createAction(act, shift_id, msg, initials));
    },

    resetTimeline() {
        this.timeline = [];
        this.newAction('reset', 0, 'reset by');
    },
    
    // POINTER
    getPointerShift() {
        return this.shifts.on_rotation[this.pointer];
    },

    advancePointer() {
        // 3 mod 5 returns 3, 5 mod 5 returns 0
        // modulo wraps back to zero at the end
        this.pointer = (this.pointer + 1) % this.shifts.on_rotation.length;
    },

    lowerPointer() {
        this.pointer = this.pointer == 0 ? this.shifts.on_rotation.length-1 : this.pointer-1;
    },

    skip() {
        const shift = this.getPointerShift();
        this.newAction('skip', shift.id);
        this.advancePointer();
    },

    // ASSIGN
    async assignPatient(initials = 'Anon') {
        const shift = this.getPointerShift();

        // first turn
        if (shift.turn == 0 && shift.patient < FIRST_TURN_BONUS) {
            // increment just patient count
            const data = await db.incrementCount(shift, 'patient')
        } else {
        // other turns
            // increment patient count and turn and pointer
            const data = await db.incrementCount(shift, 'patient', true)
            this.advancePointer();
        }
        this.shifts = await db.getShifts();
        this.newAction('patient', shift.id, 'assigned to', initials);
        return;
    },

    async undoLastAssign() {
        const index = this.timeline.findIndex(a=>a.action == 'patient');
        if (index < 0) return;
        const undo = this.timeline.splice(index, 1)[0];
        const undoShift = this.getShiftById(undo.shift_id);
        const data = await db.decrementCount(undoShift, 'patient');
        this.lowerPointer();
        this.shifts = await db.getShifts();
        return;
    },

    // ROTATION
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

    async joinRotation(doctor_id, shift_id, pointer) {
        // increment row orders
        const orders = await db.newRowOrders(this.newRotationOrdersOnNew());

        // add the new shift
        const params = {
            doctor_id: doctor_id,
            shift_id: shift_id,
            rotation_order: pointer,
            date: this.date
        }
        const newshift = await db.newShift(params);

        // update state
        this.shifts = await db.getShifts();
        return;
    },

    async goOffRotation(shift_id, status) {
        const shiftIndex = this.shifts.on_rotation.findIndex(s=>s.id == shift_id);
        // if shift index -1, not in on_rotation, only move pointer, reorder rotation if >= 0
        if (shiftIndex >= 0) {
            // if last item in index
            if (this.pointer == shiftIndex && this.pointer == this.shifts.on_rotation.length-1) {
                this.pointer = 0;
            } else if (this.pointer > shiftIndex) { 
                this.pointer--;
            }
            const order = await db.newRowOrders(this.newRotationOrderOnOff(shiftIndex));
        }
        const off = await db.goOffRotation(shift_id, status);
        this.shifts = await db.getShifts();
        return;
    },

    async rejoin(shift_id) {
        const params = {'status_id': 1, 'rotation_order': this.pointer}
        const orders = await db.newRowOrders(this.newRotationOrdersOnNew());
        const newshift = await db.updateShift(shift_id, params);
        this.shifts = await db.getShifts();
        return;
    },

    async moveRotation(dir, index) {
        // index is index of shifts array, not shift.id
        const i = parseInt(index);
        const shift = this.shifts.on_rotation[i];
        if (dir == 'up' && i == 0) { 
            return;
        } else if (dir == 'down' && i == this.shifts.on_rotation.length-1) { 
            return;
        } else {
            const orders = await db.newRowOrders(this.moveRotationOrder(shift, dir));
            this.shifts = await db.getShifts();
            return;
        }
    },

    // SHIFTS
    getShiftById(id) {
        return Object.values(this.shifts).flat().find(s=>s.id == id) || false;
    },

    resetShiftQuery() {
        return Object.values(this.shifts).flat().map(s=>({id: s.id, status_id: 4, rotation_order: null}));
    },

    async changeShiftDetails(shift_details_id, shift_id) {
        const params = {'shift_id': shift_details_id};
        const newshift = await db.updateShift(shift_id, params);
        this.shifts = await db.getShifts();
        return;
    },

    async increment(shift_id, type) {
        const shift = this.getShiftById(shift_id);
        const data = await db.incrementCount(shift, type);
        this.shifts = await db.getShifts();
        this.newAction(type, shift_id, 'picked up by')
        return;
    },

    async decrement(shift_id, type) {
        const shift = this.getShiftById(shift_id);
        const data = await db.decrementCount(shift, type);
        this.shifts = await db.getShifts();
        return;
    },

    // RESET
    async resetBoard() {
        const data = await db.resetBoard(this.resetShiftQuery());
        await this.initialize();
        return;
    }
    
}