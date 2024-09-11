export const getAllShifts = (state) => [
  ...state.main,
  ...state.flex,
  ...state.off,
];

// https://dev.to/atomikjaye/styling-consolelog-in-the-terminal-25c1
export const logObject = (text, obj) => {
  console.log(`\x1b[33m#### ${text} ####\x1b[0m`);
  console.log(" ");
  console.dir(obj, { depth: 99 });
  console.log(" ");
};
