export const getInitials = (name: string | undefined): string => {
  if (!name) return "?";
  const names = name.split(" ");
  const firstInitial = names[0][0];
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const maskCurrency = (value?: string): string => {
  if (!value) return "";

  let digitsOnly = value.replace(/\D/g, "");

  digitsOnly = digitsOnly.replace(/^0+/, "");

  if (digitsOnly.length === 0) return "";

  const paddedValue = digitsOnly.padStart(3, "0");
  let formattedValue = paddedValue.slice(0, -2) + "," + paddedValue.slice(-2);

  const integerPart = formattedValue.split(",")[0];
  const decimalPart = formattedValue.split(",")[1];
  const withThousandsSeparator = integerPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    "$1.",
  );

  return withThousandsSeparator + "," + decimalPart;
};

export const formatCPF = (value: string | undefined): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const formatPhone = (value: string | undefined): string => {
  if (!value) return "";
  const v = value.replace(/\D/g, "");
  if (v.length === 11) {
    return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1)$2-$3");
  }
  return v.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1)$2-$3");
};

export const unmask = (value: string | undefined): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};
