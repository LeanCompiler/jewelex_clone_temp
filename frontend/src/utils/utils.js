export const formatDate = (date) => {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  return `${pad(date.getUTCDate())}-${pad(
    date.getUTCMonth() + 1
  )}-${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(
    date.getUTCMinutes()
  )}:${pad(date.getUTCSeconds())} UTC`;
};

// export const parseUTCDate = (dateString) => {
//   // convert "27-01-2025 07:45:31 UTC" to "2025-01-27T07:45:31Z"
//   const parts = dateString.split(" ");
//   const [day, month, year] = parts[0].split("-");
//   const time = parts[1];

//   // convert "2025-01-27T07:45:31Z" to Date
//   return new Date(`${year}-${month}-${day}T${time}Z`);
// };

export const parseUTCDate = (dateString) => {
  // DEV
  // console.log({
  //   dateString: dateString,
  //   type: typeof dateString,
  // });

  if (!dateString || typeof dateString !== "string") {
    console.warn("Received invalid dateString to format");
    return null;
  }

  // Split into date and time+tz parts
  const [datePart, timePart, tz] = dateString.split(" ");
  if (!datePart || !timePart) {
    console.warn("Unable to split dateString as required.");
    return null;
  }

  // Split date and time parts further
  const [day, month, year] = datePart.split("-");
  const [hour, minute, second] = timePart.split(":");

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // DEV
  // console.log({
  //   dateObject: date.toUTCString(),
  //   type: typeof date,
  // });

  return date;
};
