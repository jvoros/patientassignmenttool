import Shift from "./shift.js";
// MAKE
const make = (zoneParams) => {
    return { ...zoneParams, active: { patient: undefined, supervisor: undefined }, shifts: [] };
};
// JOIN
const join = (draft, zoneId, shiftId) => {
    const zone = draft.zones[zoneId];
    // already in zone?
    if (zone.shifts.includes(shiftId)) {
        return draft;
    }
    checkForNotSupervisorShiftError(draft, zoneId, shiftId);
    const insertIndex = setActivesAndGetIndex(draft, zone, shiftId);
    zone.shifts.splice(insertIndex, 0, shiftId);
    return draft;
};
const checkForNotSupervisorShiftError = (draft, zoneId, shiftId) => {
    const isSupervisorZone = draft.zones[zoneId].type.includes("super");
    const isNoDoctorInZone = noDoctorsInZone(draft, zoneId);
    const isNotDoctorShift = draft.shifts[shiftId].role !== "physician";
    if (isSupervisorZone && isNoDoctorInZone && isNotDoctorShift) {
        console.error(`[checkForNotSupervisorShiftError] Shift [${shiftId}] is not a doctor. Must be at least one doctor in zone [${zoneId}].`);
        throw new Error(`There must be at least one doctor in zone.`);
    }
};
const setActivesAndGetIndex = (draft, zone, shiftId) => {
    let index = 0;
    if (zone.type.includes("rotation")) {
        index = zone.active.patient ? findIndex(zone, zone.active.patient) : index;
        zone.active.patient = shiftId;
    }
    if (zone.type.includes("super") && draft.shifts[shiftId].role === "physician") {
        zone.active.supervisor = zone.active.supervisor ?? shiftId; // Assign if not already assigned
    }
    return index;
};
// LEAVE
const leave = (draft, zoneId, shiftId) => {
    const zone = draft.zones[zoneId];
    checkForLastSupervisorError(draft, zoneId, shiftId);
    setActivesOnLeave(draft, zoneId, shiftId);
    zone.shifts = zone.shifts.filter((id) => id !== shiftId);
    return draft;
};
const checkForLastSupervisorError = (draft, zoneId, shiftId) => {
    const { type } = draft.zones[zoneId];
    const isLastDocInSuperZone = type.includes("super") &&
        numberDoctorsInZone(draft, zoneId) < 2 &&
        draft.shifts[shiftId].role === "physician";
    if (isLastDocInSuperZone) {
        console.error(`[checkForLastSupervisorError] There must be at least one doctor in zone [${zoneId}]. Shift [${shiftId}] is last doctor in zone .`);
        throw new Error("There must be at least one doctor in this zone.");
    }
};
const setActivesOnLeave = (draft, zoneId, shiftId) => {
    const { active } = draft.zones[zoneId];
    Object.keys(active).forEach((key) => {
        if (active[key] === shiftId) {
            advanceRotation(draft, zoneId, key);
        }
    });
};
// PROVIDE SUPER
const provideSupervisor = (draft, zoneId) => {
    const zone = draft.zones[zoneId];
    const { type, active } = zone;
    if (type !== "rotation_super") {
        console.error(`[provideSupervisor]: Zone [${zoneId}] is not a Supervisor Rotation`);
        throw new Error(`Zone is not a Supervisor Rotation`);
    }
    if (!active.supervisor) {
        console.error(`[provideSupervisor]: Zone [${zoneId}] does not have an active supervisor.`);
        throw new Error(`Zone does not have an active supervisor.`);
    }
    const supervisor = active.supervisor;
    advanceRotation(draft, zoneId, "supervisor");
    return supervisor;
};
// MOVE ACTIVE
const advanceRotation = (draft, zoneId, whichRotation, direction = 1) => {
    draft.zones[zoneId].active[whichRotation] = getNext(draft, zoneId, whichRotation, direction);
    return draft;
};
// ADJUST ORDER
const adjustOrder = (draft, zoneId, shiftId, direction) => {
    const zone = draft.zones[zoneId];
    const { index, nextIndex } = findIndexAndNeighbor(zone, shiftId, direction);
    zone.shifts.splice(nextIndex, 0, zone.shifts.splice(index, 1)[0]);
    return draft;
};
// GET NEXT
const getNext = (draft, zoneId, whichActive, offset = 1) => {
    if (whichActive === "supervisor") {
        return getNextSupervisor(draft, zoneId, offset);
    }
    const zone = draft.zones[zoneId];
    const currentId = getCurrentActiveId(zone, whichActive, zoneId);
    const nextId = findNeighbor(zone, currentId, offset);
    if (nextId !== currentId) {
        const { turnOver } = Shift.startTurn(draft.shifts[nextId]);
        return turnOver ? getNext(draft, zoneId, whichActive, offset + 1) : nextId;
    }
    return nextId;
};
const getCurrentActiveId = (zone, whichActive, zoneId) => {
    let activeId;
    if (zone.type.includes("zone")) {
        activeId = zone.shifts[0];
    }
    if (zone.type.includes("rotation")) {
        activeId = zone.active.patient;
    }
    if (!activeId) {
        console.error(`[getCurrentActiveId]: No active:${whichActive} set in Zone [${zoneId}]`);
        throw new Error(`No next-${whichActive} set in Zone [${zoneId}]`);
    }
    return activeId;
};
const getNextSupervisor = (draft, zoneId, offset = 1) => {
    const zone = draft.zones[zoneId];
    checkForNoSupervisorError(draft, zoneId);
    const nextId = findNeighbor(zone, zone.active.supervisor, offset);
    if (draft.shifts[nextId].role !== "physician") {
        const newOffset = offset < 0 ? offset - 1 : offset + 1;
        return getNextSupervisor(draft, zoneId, newOffset);
    }
    return nextId;
};
const checkForNoSupervisorError = (board, zoneId) => {
    if (noDoctorsInZone(board, zoneId)) {
        console.error(`[checkForNoSupervisorError]: No doctors in zone [${zoneId}]. Can't get next supervisor. Prevent infinite recursion.`);
        throw new Error(`No doctors in zone. Can't get next supervisor.`);
    }
    if (!board.zones[zoneId].active.supervisor) {
        console.error(`[checkForNoSupervisorError]: No active supervisor in Zone [${zoneId}].`);
        throw new Error(`No active supervisor in zone.`);
    }
};
// HELPERS
const findIndex = (zone, shiftId) => {
    return zone.shifts.findIndex((id) => id === shiftId);
};
const findIndexAndNeighbor = (zone, shiftId, offset) => {
    const index = findIndex(zone, shiftId);
    if (index < 0) {
        console.error(`[findIndexAndNeighbor]: Zone does not contain shift with id: [${shiftId}]`);
        throw new Error(`Zone does not contain shift with id: [${shiftId}]`);
    }
    const length = zone.shifts.length;
    const nextIndex = (index + offset + length) % length;
    return { index, nextIndex, nextId: zone.shifts[nextIndex] };
};
const findNeighbor = (zone, shiftId, offset) => {
    const { nextId } = findIndexAndNeighbor(zone, shiftId, offset);
    return nextId;
};
const numberDoctorsInZone = (board, zoneId) => {
    const numberDocs = board.zones[zoneId].shifts.reduce((acc, shiftId) => {
        return board.shifts[shiftId].role === "physician" ? acc + 1 : acc;
    }, 0);
    return numberDocs;
};
const noDoctorsInZone = (board, zoneId) => numberDoctorsInZone(board, zoneId) === 0;
export default {
    make,
    join,
    leave,
    provideSupervisor,
    advanceRotation,
    adjustOrder,
};
