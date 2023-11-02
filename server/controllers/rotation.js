import { v4 as uuid } from "uuid";

const makeRotation = (name, use_pointer = false) => ({
  id: uuid(),
  name: name,
  use_pointer: use_pointer,
  pointer: 0,
});

const setRotationPointer = (rotation, pointer) => ({ ...rotation, pointer });

export { makeRotation, setRotationPointer };

//   movePointer(offset) {
//     if (offset === 0) return;
//     if (this.shifts.length == 0 || this.use_pointer == false) return;
//     const action = offset < 0 ? "reverse" : "skip";
//     const action_shift = this.shifts[this.pointer]; // identify action shift before moving pointer
//     const verb = action === "skip" ? "Skipped" : "Go Back to";
//     const message =
//       verb + " " + action_shift.doctor.first + " " + action_shift.doctor.last;
//     this.pointer =
//       (this.pointer + offset + this.shifts.length) % this.shifts.length;
//     return event.make(action, this.name, action_shift.doctor, { message });
//   },

//   addPatient(pt) {
//     const updatedShift = this.nextShift().addPatient(pt);
//     if (updatedShift.counts.total > updatedShift.bonus) this.movePointer(1);
//     const new_patient_event = event.make(
//       "assign",
//       this.name,
//       updatedShift.doctor,
//       {
//         pt_type: pt.type,
//         room: pt.room,
//         message: `${updatedShift.doctor.first} ${updatedShift.doctor.last} assigned ${pt.room}`,
//       }
//     );
//     return new_patient_event;
//   },

//   nextShift() {
//     return this.shifts[this.pointer];
//   },

//   // addShift(shift) {
//   //   this.shifts.splice(this.pointer, 0, shift);
//   //   return event.make("join", this.name, shift.doctor, {
//   //     message: `${shift.doctor.first} ${shift.doctor.last} joined ${this.name}`,
//   //   });
//   // },

//   removeShift(index) {
//     // if index > pointer, no change to pointer
//     // if index < pointer, minus pointer
//     // if index == pointer and index not last, no change to pointer
//     // if index == pointer and index is last, pointer to 0
//     if (index < this.pointer) this.pointer = this.pointer - 1;
//     if (index === this.pointer && index === this.shifts.length - 1)
//       this.pointer = 0;

//     // splice will modify shifts array in place
//     const removed_shift = this.shifts.splice(index, 1)[0];

//     return {
//       removed_shift: removed_shift,
//       removed_event: event.make("leave", this.name, removed_shift.doctor, {
//         message: `${removed_shift.doctor.first} ${removed_shift.doctor.last} left ${this.name}`,
//       }),
//     };
//   },

//   moveShift(index, offset) {
//     const newIndex =
//       (index + offset + this.shifts.length) % this.shifts.length;
//     const movedShift = this.shifts.splice(index, 1)[0];
//     const doctor_string =
//       movedShift.doctor.first + " " + movedShift.doctor.last;
//     this.shifts.splice(newIndex, 0, movedShift);
//     return event.make("move", this.name, movedShift.doctor, {
//       message: `Moved ${movedShift.doctor.first} ${movedShift.doctor.last}`,
//     });
//   },
// };

// function setPointer(r, new_pointer) {
//   if (new_pointer < 0 || new_pointer > r.shifts.length-1 || r.use_pointer == false) {
//     return r;
//   }
//   return {...r, pointer: new_pointer };
// }
