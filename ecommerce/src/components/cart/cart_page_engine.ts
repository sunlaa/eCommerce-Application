import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Cart } from '@commercetools/platform-sdk';

export default class CartEngine {
  listCont: BaseElement;

  constructor(listCont: BaseElement) {
    this.listCont = listCont;
  }

  buttonController(elMunus: BaseElement, elQuanity: BaseElement, elPlus: BaseElement, elLine: BaseElement) {
    elMunus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine)
    );
    elPlus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine)
    );
  }

  async quantityChanging(actionElement: HTMLElement, quantityElement: BaseElement, productElement: BaseElement) {
    const currentElement = quantityElement.element as HTMLDivElement;
    // const currentQuantity = currentElement.textContent as string;
    const parentElement = currentElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      // console.log(+currentQuantity - 1);
      const updatedCart = (await sdk.removeProductInCartByID(lineItemId, 1)) as Cart;
      this.quantityUpdating(updatedCart, lineItemId, currentElement, productElement);
    } else {
      // console.log(+currentQuantity + 1);
      const updatedCart = (await sdk.addProductInCartByID(productId, +variantId)) as Cart;
      this.quantityUpdating(updatedCart, lineItemId, currentElement, productElement);
    }
  }

  quantityUpdating(cart: Cart, lineItemId: string, quantityElement: HTMLDivElement, productElement: BaseElement) {
    const lineItemsId: string[] = [];
    cart.lineItems.forEach((item) => {
      if (item.id === lineItemId) {
        quantityElement.textContent = item.quantity.toString();
      }
      lineItemsId.push(item.id);
    });

    if (!lineItemsId.includes(lineItemId)) {
      productElement.remove();
    }
  }

  productRemoving(removeBtn: BaseElement) {
    removeBtn.addListener('click', () => {
      console.log('clicked', removeBtn.element);
    });
  }
}
