
export const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

export const getStartOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getDaysRemaining = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};
