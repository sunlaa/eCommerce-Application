import { ProductProjection } from '@commercetools/platform-sdk';

export function getMaxPrice(productData: ProductProjection) {
  if (productData.variants.length === 0) {
    return productData.masterVariant;
  }

  let maxPrice: number = -Infinity;
  let index: number = 0;

  productData.variants.forEach((variant, i) => {
    const prices = variant.prices;
    if (!prices) return;
    if (maxPrice < prices[0].value.centAmount) {
      maxPrice = prices[0].value.centAmount;
      index = i;
    }
  });
  return productData.variants[index];
}
