import { v4 as uuid } from "uuid";

// factory pattern
// just a function that returns a plain object
// no need for 'this', can just reference variables by name
// handles all shift related tasks, could be modified to work with database

const makeShift = (doctor, options) => ({
  id: uuid(),
  doctor,
  start: options.start,
  end: options.end,
  name: options.name,
  bonus: options.bonus,
  patients: [],
  counts: {},
  rotationId: options.rotationId,
  order: options.order,
});

const addPatientToShift = (shift, pt) =>
  updateCounts({ ...shift, patients: [pt, ...shift.patients] });

const setShiftOrder = (shift, o) => ({ ...shift, order: o });

const setShiftRotation = (shift, r) => ({ ...shift, rotationId: r });

const updateCounts = (shift) => {
  return {
    ...shift,
    counts: shift.patients.reduce(
      (result, pt) => {
        result.total++;
        result[pt.type] = (result[pt.type] || 0) + 1;
        return result;
      },
      { total: 0 }
    ),
  };
};

export { makeShift, addPatientToShift, setShiftOrder, setShiftRotation };
