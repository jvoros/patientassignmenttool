export const getMountainTime = () => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Denver",
        hour12: false,
    });
    return formatter.format(new Date());
};
export const getMountainTimeDateString = () => {
    const options = {
        timeZone: "America/Denver",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(new Date());
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    const year = parts.find((part) => part.type === "year")?.value;
    return `${month}/${day}/${year}`;
};
