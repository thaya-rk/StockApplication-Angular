export function isMarketOpen(): boolean {
  const now = new Date();

  // Optional: convert to Indian Standard Time (IST) if needed
  const istOffset = 5.5 * 60; // UTC+5:30
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istNow = new Date(utc + istOffset * 60000);

  const currentHour = istNow.getHours();
  const currentMinute = istNow.getMinutes();

  const openHour = 9, openMinute = 15;
  const closeHour = 15, closeMinute = 30;

  const minutesSinceMidnight = currentHour * 60 + currentMinute;
  return (
    minutesSinceMidnight >= (openHour * 60 + openMinute) &&
    minutesSinceMidnight <= (closeHour * 60 + closeMinute)
  );
}
