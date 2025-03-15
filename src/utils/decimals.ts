export const toStringWith2Decimals = (value: number): string => {
  const valueFormated = value.toFixed(2);
  return valueFormated.toString().replace('.', ',');
};