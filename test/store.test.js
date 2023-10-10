import { describe, it } from "mocha";
import { expect } from "chai";

import createStore from '../server/state/store.js'

describe("Store Tests", () => {
  const store = createStore();
  it("should initialize correctly", () => {
    expect(store.dispatch).to.be.a('function');
    expect(store.getState).to.be.a('function');
    expect(store.getUndo).to.be.a('function');
    expect(store.getState().rotations.main).to.exist;
    expect(store.getState().rotations.ft).to.exist;
    expect(store.getState().rotations.off).to.exist;
    expect(store.getState().timeline).to.exist;
  });

  // undo functionality tests handled by reducer-test.js

});
