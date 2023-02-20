// returns a string in the format "Sat, 31 Jan"
export function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}

export function formatUTCDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}
