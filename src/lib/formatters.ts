const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("es-CL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("es-CL", {
  month: "long",
  year: "numeric",
});

function fromIsoDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatShortDate(date: string): string {
  return shortDateFormatter.format(fromIsoDate(date));
}

export function formatLongDate(date: Date): string {
  return longDateFormatter.format(date);
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatPercentage(value: number | null): string {
  if (value === null) return "Sin datos previos";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("es-CL", { maximumFractionDigits: 1 })}%`;
}
