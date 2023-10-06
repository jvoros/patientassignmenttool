function save(history, board) {
  return [
    JSON.stringify(board),
    ...history.splice(0, 10)
  ]
}

function revert(history) {
  return {
    new_board: JSON.parse(history[0]),
    new_history: history.slice(1)
  }
}

export default { save, revert }
