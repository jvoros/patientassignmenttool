const getTotalAndSupervised = (shift) => {
    const total = Object.values(shift.counts).reduce((acc, count) => acc + count, 0);
    const supervised = shift.counts.supervised || 0;
    return { total, supervised };
};
const buildLogs = (site, board) => {
    const logs = [];
    for (const shiftId in board.shifts) {
        const shift = board.shifts[shiftId];
        const { total, supervised } = getTotalAndSupervised(shift);
        const log = {
            date: board.date,
            site,
            shift: shift.name,
            provider: `${shift.provider.first} ${shift.provider.last}`,
            patients: total,
            supervised: supervised,
        };
        logs.push(log);
    }
    return logs;
};
export default buildLogs;
