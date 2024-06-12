export const getVariationValue = (openPrice: number, price: number) => {
  let diff = openPrice.toFixed(2);
  if (openPrice > 0) {
    diff = (Math.round(((price - openPrice) / openPrice) * 100 * 100) / 100).toFixed(2);
  }
  return Number(diff) > 0 ? `+${diff}%` : `${diff}%`;
};
