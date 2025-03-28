import Shift from "./shift.js";
import Zone from "./zone.js";
import Undo from "./undo.js";
const assignToShift = Undo.produce((draft, zoneId, shiftId, patient) => {
    const shift = draft.shifts[shiftId];
    Shift.addPatient(shift, patient);
    const supervisorId = assignSupervisorIfNeeded(draft, zoneId, shift.role);
    return createAssignEventParams(shift, supervisorId, patient);
});
const createAssignEventParams = (shift, superShiftId, patient) => {
    const { last, first } = shift.provider;
    return {
        type: "assign",
        shift: shift.id,
        supervisorShift: superShiftId,
        patient,
        message: `Room ${patient.room} assigned to ${first} ${last}`,
    };
};
const assignSupervisorIfNeeded = (draft, zoneId, role) => {
    if (role !== "physician") {
        const zone = draft.zones[zoneId];
        const { superZoneId, superShiftId } = getSuperZoneAndShift(draft, zone);
        Shift.addSupervisor(draft.shifts[superShiftId]);
        Zone.advanceRotation(draft, superZoneId, "supervisor");
        return superShiftId;
    }
    return undefined;
};
const getSuperZoneAndShift = (draft, zone) => {
    if (!zone.superFrom && !zone.active.supervisor) {
        console.error(`[getSuperZoneAndShift]: zoneId [${zone.id}] has no 'superFrom:' property and no active.supervisor is set.`);
        throw new Error(`Zone has no 'superFrom:' property and no active.supervisor is set.`);
    }
    // use ! non-null assertion because already checked at least one exists
    const superShiftId = zone.superFrom
        ? draft.zones[zone.superFrom].active.supervisor
        : zone.active.supervisor;
    const superZoneId = zone.superFrom ?? zone.id;
    return { superShiftId, superZoneId };
};
const assignToZone = Undo.produce((draft, zoneId, patient) => {
    const zone = draft.zones[zoneId];
    const shift = getActiveShift(draft, zoneId);
    const { turnOver } = Shift.addPatientOnTurn(shift, patient);
    if (turnOver) {
        handleTurnOver(draft, zoneId);
    }
    handleTriggerSkip(zone, shift);
    const supervisorId = assignSupervisorIfNeeded(draft, zoneId, shift.role);
    return createAssignEventParams(shift, supervisorId, patient);
});
const getActiveShift = (draft, zoneId) => {
    const zone = draft.zones[zoneId];
    const shiftId = zone.type.includes("rotation") ? zone.active.patient : zone.shifts[0];
    if (!shiftId) {
        console.error(`[getActiveShift]: No shift in zone or active.patient for zone [${zoneId}]`);
        throw new Error(`No shift in zone or next-patient for zone`);
    }
    return draft.shifts[shiftId];
};
const handleTurnOver = (draft, zoneId) => {
    Zone.advanceRotation(draft, zoneId, "patient");
};
const handleTriggerSkip = (zone, shift) => {
    if (zone.triggerSkip && zone.triggerSkip.includes(shift.role)) {
        Shift.skipNextTurn(shift);
    }
};
const reassignPatient = Undo.produce((draft, eventId, newShiftId) => {
    const event = draft.events[eventId];
    validateEvent(event);
    const newShift = draft.shifts[newShiftId];
    Shift.addPatient(newShift, event.patient);
    const shift = draft.shifts[event.shift];
    Shift.removePatient(shift, event.patient);
    updateEventTypeAndMessage(event, newShift);
    const supervisorShift = handleSupervisorOnReassign(newShift, shift, event);
    return createAssignEventParams(newShift, supervisorShift, event.patient);
});
function validateEvent(event) {
    if (!event.patient) {
        console.error(`[validateEvent]: Event [${event.id}] has no patient property.`);
        throw new Error(`Event [${event.id}] has no patient property.`);
    }
    if (!event.shift) {
        console.error(`[validateEvent]: Event [${event.id}] has no shift property.`);
        throw new Error(`Event [${event.id}] has no shift property.`);
    }
}
const updateEventTypeAndMessage = (event, newShift) => {
    const newProvider = newShift.provider;
    event.type = "reassign";
    event.message = `Reassigned to: ${newProvider.first} ${newProvider.last}`;
};
const handleSupervisorOnReassign = (newShift, shift, event) => {
    if (newShift.role !== "physician" && shift.role === "physician") {
        Shift.addSupervisor(shift);
        return shift.id;
    }
    if (newShift.role !== "physician" && shift.role !== "physician") {
        return event.supervisorShift;
    }
    return undefined;
};
const changeRoom = Undo.produce((draft, eventId, newRoom) => {
    const event = draft.events[eventId];
    validateEvent(event);
    const oldRoom = event.patient.room;
    event.patient.room = newRoom;
    event.type = "reassign";
    event.message = `Changed room from ${oldRoom}`;
    // event
    const eventParams = {
        type: "changeRoom",
        shift: event.shift,
        message: `Room changed from ${oldRoom} to ${newRoom}`,
    };
    return eventParams;
});
export default {
    assignToShift,
    assignToZone,
    reassignPatient,
    changeRoom,
};
