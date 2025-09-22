export const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    const names = name.split(' ');
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
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
  const withThousandsSeparator = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  return withThousandsSeparator + "," + decimalPart;
};

