import { Cart } from '@commercetools/platform-sdk';
import { sdk } from '../services/SDK/sdk_manager';

export default function CartsClearing(allCarts: Cart[]) {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  allCarts.forEach(async (currentCart, cartIndex) => {
    if (cartIndex === 0) return;
    await sdk.deleteCart({ ID: currentCart.id });
  });
  console.log(allCarts, 'all');
}
