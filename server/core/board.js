import Shift from "./shift.js";
import Zone from "./zone.js";
import Undo from "./undo.js";
import Assign from "./assign.js";
import hydrate from "./hydrate.js";
import buildLogs from "./logs.js";
import { getMountainTimeDateString } from "./dates.js";
const reset = Undo.produce((draft) => {
    draft.date = getMountainTimeDateString();
    draft.shifts = {};
    draft.timeline = [];
    draft.events = {};
    for (const zoneId in draft.zones) {
        draft.zones[zoneId] = {
            ...draft.zones[zoneId],
            active: { patient: undefined, supervisor: undefined },
            shifts: [],
        };
    }
    // event
    const eventParams = { type: "reset", message: "Board Reset" };
    return eventParams;
});
const signIn = Undo.produce((draft, provider, schedule) => {
    const shiftId = Shift.addToBoard(draft, provider, schedule);
    schedule.joinZones.forEach((zone) => {
        Zone.join(draft, zone, shiftId);
    });
    // event
    const eventParams = {
        type: "signIn",
        shift: shiftId,
        message: `${provider.first} ${provider.last} signed in.`,
    };
    return eventParams;
});
const signOut = Undo.produce((draft, shiftId) => {
    const inZone = Object.keys(draft.zones).filter((zoneId) => draft.zones[zoneId].shifts.includes(shiftId) && zoneId !== "off");
    inZone.forEach((zoneId) => {
        Zone.leave(draft, zoneId, shiftId);
    });
    Zone.join(draft, "off", shiftId);
    // event
    const { first, last } = draft.shifts[shiftId].provider;
    const eventParams = {
        type: "signOut",
        shift: shiftId,
        message: `${first} ${last} signed out.`,
    };
    return eventParams;
});
const deleteShift = Undo.produce((draft, shiftId) => {
    // Error if patients are assigned
    const shift = draft.shifts[shiftId];
    if (Object.keys(shift.counts).length > 0) {
        console.error(`[deleteShift] Shift [${shiftId}] has patients assigned.`);
        throw new Error(`Shift has patients assigned. Cannot be deleted.`);
    }
    // leave all zones, using Zone.leave will handle rotations
    const inZone = Object.keys(draft.zones).filter((zoneId) => draft.zones[zoneId].shifts.includes(shiftId));
    inZone.forEach((zoneId) => {
        Zone.leave(draft, zoneId, shiftId);
    });
    // remove shift
    delete draft.shifts[shiftId];
    // event
    const eventParams = {
        type: "deleteShift",
        shift: shiftId,
        message: `Shift: ${shift.name} (${shift.provider.first} ${shift.provider.last}) was deleted.`,
    };
    return eventParams;
});
const joinZone = Undo.produce((draft, zoneId, shiftId) => {
    const zone = draft.zones[zoneId];
    const { last, first } = draft.shifts[shiftId].provider;
    Zone.join(draft, zoneId, shiftId);
    // event
    const eventParams = {
        type: "join",
        shift: shiftId,
        message: `${first} ${last} joined ${zone.name}.`,
    };
    return eventParams;
});
const leaveZone = Undo.produce((draft, zoneId, shiftId) => {
    const zone = draft.zones[zoneId];
    const { last, first } = draft.shifts[shiftId].provider;
    Zone.leave(draft, zoneId, shiftId);
    // event
    const eventParams = {
        type: "leave",
        shift: shiftId,
        message: `${first} ${last} left ${zone.name}.`,
    };
    return eventParams;
});
const switchZone = Undo.produce((draft, leaveZoneId, joinZoneId, shiftId) => {
    const leaveZone = draft.zones[leaveZoneId];
    const joinZone = draft.zones[joinZoneId];
    const { last, first } = draft.shifts[shiftId].provider;
    Zone.leave(draft, leaveZoneId, shiftId);
    Zone.join(draft, joinZoneId, shiftId);
    // event
    const eventParams = {
        type: "switched",
        shift: shiftId,
        message: `${first} ${last} left ${leaveZone.name} to join ${joinZone.name}.`,
    };
    return eventParams;
});
const advanceRotation = Undo.produce((draft, zoneId, whichActive, direction) => {
    Zone.advanceRotation(draft, zoneId, whichActive, direction);
    // event
    const dir = direction === 1 ? "forward to" : "back to";
    const active = getActiveMessage(whichActive);
    const affectedShiftId = draft.zones[zoneId].active[whichActive];
    const { last, first } = draft.shifts[affectedShiftId].provider;
    const eventParams = {
        type: "advanceRotation",
        message: `${active} moved ${dir} ${first} ${last}.`,
    };
    return eventParams;
});
const getActiveMessage = (whichActive) => {
    return whichActive === "supervisor"
        ? "Supervisor"
        : whichActive === "patient"
            ? "Next Patient"
            : whichActive;
};
const changePosition = Undo.produce((draft, zoneId, shiftId, dir) => {
    Zone.adjustOrder(draft, zoneId, shiftId, dir);
    // event
    const direction = dir === 1 ? "down" : "up";
    const zoneName = draft.zones[zoneId].name;
    const { last, first } = draft.shifts[shiftId].provider;
    const eventParams = {
        type: "changePosition",
        shift: shiftId,
        message: `${first} ${last} moved ${direction} in ${zoneName}`,
    };
    return eventParams;
});
const pauseShift = Undo.produce((draft, shiftId) => {
    const shift = draft.shifts[shiftId];
    Shift.pauseTurn(shift);
    // event
    const { last, first } = shift.provider;
    const eventParams = {
        type: "pauseShift",
        shift: shiftId,
        message: `${first} ${last} paused.`,
    };
    return eventParams;
});
const unpauseShift = Undo.produce((draft, shiftId) => {
    const shift = draft.shifts[shiftId];
    Shift.resumeTurn(shift);
    // event
    const { last, first } = shift.provider;
    const eventParams = {
        type: "unpauseShift",
        shift: shiftId,
        message: `${first} ${last} unpaused.`,
    };
    return eventParams;
});
// LOGS
export default {
    reset,
    undo: Undo.undo,
    signIn,
    signOut,
    deleteShift,
    joinZone,
    leaveZone,
    switchZone,
    advanceRotation,
    changePosition,
    pauseShift,
    unpauseShift,
    assignToShift: Assign.assignToShift,
    assignToZone: Assign.assignToZone,
    reassignPatient: Assign.reassignPatient,
    changeRoom: Assign.changeRoom,
    buildLogs,
    hydrate,
};
