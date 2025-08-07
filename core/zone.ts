import Shift from "./shift.js";

// which zone types have which rotations
// key is pointer, value is zone types that have that pointer
const POINTERS_AND_ZONE_TYPES: Record<ZonePointer, ZoneVariant[]> = {
  next: ["rotation", "dual"],
  super: ["dual"],
};

const zoneRotatesPointer = (which: ZonePointer, zone: Zone): boolean => {
  return POINTERS_AND_ZONE_TYPES[which].includes(zone.type);
};

// MAKE
const make = (params: ZoneMakeParams): Zone => {
  return {
    ...params,
    triggerSkip: params.triggerSkip ?? false,
    next: null,
    super: null,
    shifts: [],
  };
};

// JOIN ZONE

const joinZone = (params: { zone: Zone; shift: Shift }): void => {
  const { zone, shift } = params;
  // don't add more than once
  if (zone.shifts.includes(shift.id)) return;

  switch (zone.type) {
    case "dual":
      if (zone.next === null) zone.next = 0;
      zone.shifts.splice(zone.next, 0, shift.id);
      if (shift.role === "physician" && zone.super === null) {
        // first physician shift, set super pointer
        // to same index where just inserted
        zone.super = zone.next;
      }
      if (shift.role === "app" && zone.super! >= zone.next) {
        zone.super = zone.super! + 1;
      }
      break;

    case "rotation":
      if (zone.next === null) zone.next = 0;
      zone.shifts.splice(zone.next, 0, shift.id);
      break;

    case "simple":
      if (zone.next === null) zone.next = 0;
      zone.shifts.unshift(shift.id);
      break;

    case "list":
      zone.shifts.push(shift.id);
      break;
  }
};

// LEAVE ZONE

const leaveZone = (params: {
  leaveShiftId: Shift["id"];
  zone: Zone;
  shifts: IndexShift;
}): void => {
  const { leaveShiftId, zone, shifts } = params;
  const index = zone.shifts.findIndex((s) => s === leaveShiftId);
  if (index === -1) return; // shift not in zone

  // handle pointers
  const pointerKeys: ZonePointer[] = ["next", "super"];
  pointerKeys.forEach((key) => {
    if (zoneRotatesPointer(key, zone)) {
      let pointer = zone[key];
      // if leaving is next or super, advance
      // prevents edge case of removing last shift and wrapping to 0
      if (index === zone[key]) {
        movePointer({ zone, shifts, which: key, offset: 1 });
        pointer = zone[key];
      }
      // if after advance still pointer means it is last shift, clear pointer
      if (index === zone[key]) {
        zone[key] = null;
        pointer = zone[key];
      }
      // if index < pointer, need to decrement pointer
      if (pointer !== null && index < pointer) zone[key] = pointer - 1;
    }
  });

  // remove shift
  zone.shifts.splice(index, 1);
};

// MOVE POINTERS

const movePointer = (params: {
  zone: Zone;
  shifts: IndexShift;
  which: ZonePointer;
  offset: number;
}): void => {
  // don't move pointer if no pointer to move
  if (!zoneRotatesPointer(params.which, params.zone)) {
    throw Error("zone does not rotate pointer");
  }

  const { zone, shifts, which } = params;
  let offset = params.offset;
  const moreOffset = () => (offset < 0 ? offset - 1 : offset + 1);

  while (true) {
    const nextIndex = getNextIndex({ zone, which, offset });
    const nextShift = shifts[zone.shifts[nextIndex]];
    if (which === "super" && nextShift.role !== "physician") {
      offset = moreOffset();
      continue;
    }
    if (nextShift.status === "paused") {
      offset = moreOffset();
      continue;
    }
    if (nextShift.status === "skip") {
      Shift.changeStatus({ shift: nextShift, status: "active" });
      offset = moreOffset();
      continue;
    }
    zone[which] = nextIndex;
    return;
  }
};

type getNextIndexParams = {
  zone: Zone;
  which: ZonePointer;
  offset: number;
};

const getNextIndex = (params: getNextIndexParams): number => {
  const { zone, which, offset } = params;
  const current = zone[which] ?? 0;
  const arrayLength = zone.shifts.length;
  if (arrayLength === 0) return -1;
  return (current + offset + arrayLength) % arrayLength;
};

// PROVIDE SUPER

const provideSuper = (params: {
  zone: Zone;
  shifts: IndexShift;
}): Shift["id"] => {
  const { zone, shifts } = params;
  if (zone.super === null) {
    throw Error(`No zone.super set for zone: ${zone.slug}`);
  }
  const supervisorId = zone.shifts[zone.super];
  movePointer({ zone, shifts, which: "super", offset: 1 });
  return supervisorId;
};

export default {
  make,
  joinZone,
  leaveZone,
  movePointer,
  provideSuper,
};
