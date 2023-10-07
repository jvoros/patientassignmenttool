import { produce } from "immer"
import shift from "./controllers/shift.js"
import patient from "./controllers/patient.js"

const reducer = produce((draft, action) => {
  switch (action.type) {
      case "timeline/add-event":
        draft.timeline.push(action.payload);
        return

      case "board/new-patient":
        // ft pts to ft rotation, all others to main
        const rot = action.payload[0] === 'ft' ? 'ft' : 'main';
        const pt = patient.make(...action.payload);

        if (draft.rotations[rot].shifts.length > 0) { 
          draft.rotations[rot].addPatient(pt);
        } else {
          draft.rotations.main.addPatient(pt);
        }
        return
      
      case "rotation/add-shift":
        const new_shift = shift.make(...action.payload.args);
        draft.rotations[action.payload.rotation_name].addShift(new_shift);
        return

      case "rotation/move-shift":
        const { index, from, to } = action.payload;
        const moved_shift = draft.rotations[from].removeShift(index);
        draft.rotations[to].addShift(moved_shift)
        return


      case "renameUser":
          // OK: we modify the current state
          draft.users[action.payload.id].name = action.payload.name
          return draft // same as just 'return'
      case "loadUsers":
          // OK: we return an entirely new state
          return action.payload
      case "adduser-1":
          // NOT OK: This doesn't do change the draft nor return a new state!
          // It doesn't modify the draft (it just redeclares it)
          // In fact, this just doesn't do anything at all
          draft = {users: [...draft.users, action.payload]}
          return
      case "adduser-2":
          // NOT OK: modifying draft *and* returning a new state
          draft.userCount += 1
          return {users: [...draft.users, action.payload]}
      case "adduser-3":
          // OK: returning a new state. But, unnecessary complex and expensive
          return {
              userCount: draft.userCount + 1,
              users: [...draft.users, action.payload]
          }
      case "adduser-4":
          // OK: the immer way
          draft.userCount += 1
          draft.users.push(action.payload)
          return
  }
});

export default reducer;