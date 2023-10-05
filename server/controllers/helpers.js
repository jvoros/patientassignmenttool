export function shortTimestamp() {
  const timestamp = new Date();
  return timestamp.toLocaleString("en-US", {
    timeZone: "America/Denver",
    timeStyle: "short",
  })                            // string
}