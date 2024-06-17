import { LineItem } from '@commercetools/platform-sdk';

export default function getProductQuantity(lineItems: LineItem[]) {
  const result = lineItems.reduce((acc, lineItem) => {
    const quantity = lineItem.quantity;
    return acc + quantity;
  }, 0);

  return result;
}
