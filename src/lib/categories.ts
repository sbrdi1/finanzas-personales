export type Category = {
  name: string;
  color: string;
};

export const expenseCategories = [
  { name: "Alimentación", color: "#6c5ce7" },
  { name: "Servicios", color: "#20bf9f" },
  { name: "Transporte", color: "#ffb84d" },
  { name: "Vivienda", color: "#4386f5" },
  { name: "Salud", color: "#ff6680" },
  { name: "Ocio", color: "#a867dd" },
  { name: "Educación", color: "#39afd0" },
  { name: "Otros", color: "#8992a5" },
] as const satisfies readonly Category[];

export const expenseCategoryNames = expenseCategories.map(({ name }) => name);

export const categoryColors = Object.fromEntries(
  expenseCategories.map(({ name, color }) => [name, color]),
) as Record<string, string>;

export const incomeCategory = "Ingresos";
