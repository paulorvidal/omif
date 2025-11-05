export const formatDate = (raw: string): string => {
  const date = new Date(raw);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateOnly = (raw: string): string => {
  const date = typeof raw === "string" ? new Date(raw) : raw;

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatBrazilianDateToISO = (dateString: string): string => {
  if (!dateString || dateString.length !== 10) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};
