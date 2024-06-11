import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';

export default class CartEngine {
  listCont: BaseElement;

  constructor(listCont: BaseElement) {
    this.listCont = listCont;
  }

  buttonController(elMunus: BaseElement, elQuanity: BaseElement, elPlus: BaseElement) {
    const currentQuantity = elQuanity;

    elMunus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, currentQuantity)
    );
    elPlus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, currentQuantity)
    );
  }

  async quantityChanging(actionElement: HTMLElement, quantityElement: BaseElement) {
    console.log('clicked');
    const currentElement = quantityElement.element as HTMLDivElement;
    const currentQuantity = currentElement.textContent as string;
    const parentElement = currentElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      console.log(+currentQuantity - 1);
      // await sdk.addProductInCartByID(productId, +variantId, +currentQuantity + 1);
      await sdk.removeProductInCartByID(lineItemId, 1);
    } else {
      console.log(+currentQuantity + 1);
      await sdk.addProductInCartByID(productId, +variantId);
    }
  }

  productRemoving(removeBtn: BaseElement) {
    removeBtn.addListener('click', () => {
      console.log('clicked', removeBtn.element);
    });
  }
}
