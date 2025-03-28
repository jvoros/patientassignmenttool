const getShift = (board, shiftId) => {
    return board.shifts[shiftId];
};
const hydrateZone = (board, zone) => {
    return {
        ...zone,
        shifts: zone.shifts.map((shiftId) => getShift(board, shiftId)),
    };
};
const getZoneList = (zones, list) => {
    const filteredZones = Object.values(zones).filter((zone) => zone.order >= list * 10 && zone.order < list * 10 + 10);
    return filteredZones.sort((a, b) => a.order - b.order);
};
const hydrateZoneList = (board, list) => {
    return getZoneList(board.zones, list).map((zone) => hydrateZone(board, zone));
};
const getEvent = (board, eventId) => {
    return board.events[eventId];
};
const trimEvent = (event) => {
    const { inversePatches, ...trimmedEvent } = event;
    return trimmedEvent;
};
const getEventShifts = (board, event) => {
    return {
        ...event,
        shift: getShift(board, event.shift),
        supervisorShift: event.supervisorShift ? getShift(board, event.supervisorShift) : null,
    };
};
const hydrateTimeline = (board) => {
    return board.timeline
        .map((id) => getEvent(board, id))
        .map(trimEvent)
        .map((event) => getEventShifts(board, event));
};
export default (board) => {
    return {
        date: board.date,
        zoneList1: hydrateZoneList(board, 1),
        zoneList2: hydrateZoneList(board, 2),
        timeline: hydrateTimeline(board),
    };
};
