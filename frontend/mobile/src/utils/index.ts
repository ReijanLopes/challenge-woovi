export function useDebounce(
  func: (...args: any[]) => any,
  delay: number
): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const maskCPF = (cpf: string) => {
  return (
    cpf
      .substring(0, 14)
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") || ""
  );
};

export const maskCardNumber = (cardNumber: string) => {
  return (
    cardNumber
      .substring(0, 19)
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d)/, "$1.$2")
      .replace(/(\d{4})(\d)/, "$1.$2")
      .replace(/(\d{4})(\d)/, "$1.$2") || ""
  );
};

export const maskValidate = (validate: string) => {
  const month = Number(validate.slice(0, 2));

  if (month > 12) {
    return { error: "Data inválida" };
  }

  if (Number(validate?.[0]) > 1) {
    return `0${validate?.[0]}`;
  }

  return validate
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .substring(0, 5);
};

export const maskCVV = (cvv: string) => {
  return cvv.substring(0, 3);
};

export const formatNumberInString = (value: number) => {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatDate_DDMMYYYYHHMM = (value: number | string) => {
  const date = new Date(value);
  const dateStringOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const timeStringOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };

  const dateString = date.toLocaleDateString("pt-BR", dateStringOptions);
  const timeString = date.toLocaleTimeString("pt-BR", timeStringOptions);

  return `${dateString} - ${timeString}`;
};

export const formatExpiringInDate = (expiration: number) => {
  const data = new Date(expiration);
  const month = data.getMonth() + 1;
  const year = String(data.getFullYear()).slice(2, 4);
  const formatMonth = month < 10 ? `0${month}` : month;

  return `${formatMonth}/${year}`;
};
