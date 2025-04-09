const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate();

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export default formatTimestamp;
