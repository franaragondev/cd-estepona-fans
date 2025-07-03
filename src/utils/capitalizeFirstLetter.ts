export function capitalizeFirstLetter(text: string): string {
  const lower = text.toLowerCase();

  const index = lower.search(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/);
  if (index === -1) return lower;

  return (
    lower.slice(0, index) +
    lower.charAt(index).toUpperCase() +
    lower.slice(index + 1)
  );
}
