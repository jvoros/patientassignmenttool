import db from "./db.js";

// utility functions & constants
const TIMELINE_LIMIT = 20;
const FIRST_TURN_BONUS = 2;

export default class {
  constructor() {
    this.date = new Date().toLocaleDateString("fr-CA", {
      timeZone: "America/Denver",
    });
    this.pointer = 0;
    this.timeline = [];
    this.shifts = {};
    this.shift_details = [];
    this.doctors = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized === true) return;
    this.pointer = 0;
    this.shift_details = await db.getShiftDetails();
    this.shifts = await db.getShifts();
    this.doctors = await db.getDoctors();
    this.initialized = true;
    return;
  }

  async refreshShifts() {
    this.shifts = await db.getShifts();
  }

  // TIMELINE
  newAction(
    act,
    shift_id,
    msg,
    initials = "Anon",
    pointer = false,
    turn = false
  ) {
    const time = new Date();
    const newAction = {
      action: act,
      shift_id: shift_id,
      doctor:
        shift_id == 0
          ? { last: "Nurse", first: "Triage" }
          : this.getShiftById(shift_id).doctor,
      msg: msg,
      initials: initials,
      time: time.toLocaleString("en-US", {
        timeZone: "America/Denver",
        timeStyle: "short",
      }),
      pointer: pointer,
      turn: turn,
    };
    if (this.timeline.length >= TIMELINE_LIMIT) this.timeline.pop();
    this.timeline.unshift(newAction);
  }

  resetTimeline() {
    this.timeline = [];
    this.newAction("reset", 0, "reset by");
  }

  // POINTER
  getPointerShift() {
    return this.shifts.on_rotation[this.pointer];
  }

  movePointer(dir = "up") {
    const length = this.shifts.on_rotation.length - 1;
    if (dir === "down") {
      this.pointer = this.pointer == 0 ? length : this.pointer - 1;
    } else {
      this.pointer = this.pointer == length ? 0 : this.pointer + 1;
    }
  }

  skip() {
    const shift = this.getPointerShift();
    this.newAction("skip", shift.id);
    this.movePointer("up");
  }

  goback() {
    const shift = this.getPointerShift();
    this.newAction("back", shift.id, "from");
    this.movePointer("down");
  }

  // ASSIGNING PATIENTS
  async assignPatient(initials = "Anon") {
    const shift = this.getPointerShift();
    const isOvernight = shift.shift_details.id === 7;
    const bonus = !isOvernight ? FIRST_TURN_BONUS : FIRST_TURN_BONUS - 1;
    const isTurn = shift.patient >= bonus;

    await this.increment(shift.id, "patient", initials, isTurn);
    if (isTurn) this.movePointer("up");

    return;
  }

  async undoLastAssign() {
    // const index = this.timeline.findIndex((a) => a.action == "patient");
    // // -1 if none found
    // if (index < 0) return;
    if (this.timeline.length == 0) return;
    const undo = this.timeline.shift();
    await this.decrement(undo.shift_id, undo.action, undo.turn);
    if (undo.pointer == true) this.movePointer("down");
    return;
  }

  // ROTATION ORDERS
  newRotationOrdersOnNew() {
    return this.shifts.on_rotation.map((d) => ({
      id: d.id,
      rotation_order:
        d.rotation_order < this.pointer
          ? d.rotation_order
          : d.rotation_order + 1,
    }));
  }

  newRotationOrderOnOff(order) {
    const arr = this.shifts.on_rotation.map((s) => {
      let new_order;
      if (s.rotation_order < order) {
        new_order = s.rotation_order;
      } else if (s.rotation_order == order) {
        new_order = null;
      } else {
        new_order = s.rotation_order - 1;
      }
      return { id: s.id, rotation_order: new_order };
    });
    return arr;
  }

  moveRotationOrder(shift, dir) {
    const order = shift.rotation_order;
    const neworder = dir == "up" ? order - 1 : order + 1;
    // get  displaced shift
    const moveShift = this.shifts.on_rotation[neworder];
    // update query for each shift
    return [
      { id: shift.id, rotation_order: neworder },
      { id: moveShift.id, rotation_order: order },
    ];
  }

  // MOVING AROUND ROTATION
  async moveRotation(dir, index) {
    // index is index of shifts array, not shift.id
    const i = parseInt(index);
    const shift = this.shifts.on_rotation[i];
    if (dir == "up" && i == 0) {
      return;
    } else if (dir == "down" && i == this.shifts.on_rotation.length - 1) {
      return;
    } else {
      await db.updateShifts(this.moveRotationOrder(shift, dir));
      await this.refreshShifts();
      return;
    }
  }

  async joinRotation(doctor_id, shift_id, pointer) {
    // increment row orders
    await db.updateShifts(this.newRotationOrdersOnNew());

    // add the new shift
    const params = {
      doctor_id: doctor_id,
      shift_id: shift_id,
      rotation_order: pointer,
      date: this.date,
    };
    await db.newShift(params);

    // update state
    await this.refreshShifts();
    return;
  }

  async goOffRotation(shift_id, status) {
    const shiftIndex = this.shifts.on_rotation.findIndex(
      (s) => s.id == shift_id
    );
    // if shift index -1, not in on_rotation, only move pointer and reorder rotation if >= 0
    if (shiftIndex >= 0) {
      // if last item in index
      if (
        this.pointer == shiftIndex &&
        this.pointer == this.shifts.on_rotation.length - 1
      ) {
        this.pointer = 0;
      } else if (this.pointer > shiftIndex) {
        this.pointer--;
      }
      await db.updateShifts(this.newRotationOrderOnOff(shiftIndex));
    }
    const query = { status_id: status, rotation_order: null };
    await db.updateShift(shift_id, query, "Server error going off rotation");
    this.shifts = await db.getShifts();
    return;
  }

  async rejoin(shift_id) {
    const params = { status_id: 1, rotation_order: this.pointer };
    await db.updateShifts(this.newRotationOrdersOnNew());
    await db.updateShift(shift_id, params);
    await this.refreshShifts();
    return;
  }

  // SHIFT PROPERTIES
  getShiftById(id) {
    return (
      Object.values(this.shifts)
        .flat()
        .find((s) => s.id == id) || false
    );
  }

  async changeShiftDetails(shift_details_id, shift_id) {
    const params = { shift_id: shift_details_id };
    await db.updateShift(shift_id, params);
    await this.refreshShifts();
    return;
  }

  async increment(shift_id, type, initials = "Anon", isTurn = false) {
    const shift = this.getShiftById(shift_id);
    await db.incrementCount(shift, type, isTurn);
    this.newAction(type, shift_id, "picked up by", initials, isTurn, isTurn);
    await this.refreshShifts();
    return;
  }

  async decrement(shift_id, type, turn = false) {
    const shift = this.getShiftById(shift_id);
    await db.decrementCount(shift, type, turn);
    await this.refreshShifts();
    return;
  }

  // RESET
  async resetBoard() {
    const query = Object.values(this.shifts)
      .flat()
      .map((s) => ({ id: s.id, status_id: 4, rotation_order: null }));
    await db.updateShifts(query);
    this.pointer = 0;
    this.initialized = false;
    await this.initialize();
    return;
  }
}
