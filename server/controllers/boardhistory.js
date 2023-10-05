class BoardHistory {
  constructor(board) {
    this.snapshots = [];
  }

  save(board) {
    // LIMIT TO 10 UNDOS
    if (this.snapshots.length >= 10) this.snapshots.pop();
    this.snapshots.unshift(JSON.stringify(board));
  }

  revert() {
    return JSON.parse(this.snapshots.shift());
  }

}

export default BoardHistory;