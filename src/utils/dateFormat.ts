export const dateToString = (date: Date | string): string => {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const dateAddDays = (date: Date | string, daysToAdd: number): string => {
  if (typeof date === "string") date = new Date(date);
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};