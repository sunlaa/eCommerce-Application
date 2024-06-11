import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Cart } from '@commercetools/platform-sdk';

export default class CartEngine {
  listCont: BaseElement;
  totalAmount: BaseElement;

  constructor(listCont: BaseElement, totalAmount: BaseElement) {
    this.listCont = listCont;
    this.totalAmount = totalAmount;
  }

  buttonController(
    elMunus: BaseElement,
    elQuanity: BaseElement,
    elPlus: BaseElement,
    elLine: BaseElement,
    elPrice: BaseElement
  ) {
    elMunus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine, elPrice)
    );
    elPlus.addListener(
      'click',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine, elPrice)
    );
  }

  async quantityChanging(
    actionElement: HTMLElement,
    quantityElement: BaseElement,
    productElement: BaseElement,
    priceElement: BaseElement
  ) {
    const currentElement = quantityElement.element as HTMLDivElement;
    // const currentQuantity = currentElement.textContent as string;
    const parentElement = currentElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      // console.log(+currentQuantity - 1);
      const updatedCart = (await sdk.removeProductInCartByID(lineItemId, 1)) as Cart;
      await this.quantityUpdating(updatedCart, lineItemId, currentElement, productElement, priceElement);
    } else {
      // console.log(+currentQuantity + 1);
      const updatedCart = (await sdk.addProductInCartByID(productId, +variantId)) as Cart;
      await this.quantityUpdating(updatedCart, lineItemId, currentElement, productElement, priceElement);
    }
  }

  async quantityUpdating(
    cart: Cart,
    lineItemId: string,
    quantityElement: HTMLDivElement,
    productElement: BaseElement,
    priceElement: BaseElement
  ) {
    const lineItemsId: string[] = [];

    cart.lineItems.forEach((item) => {
      if (item.id === lineItemId) {
        quantityElement.textContent = item.quantity.toString();

        const productTotalPrice = item.totalPrice.centAmount.toString();
        const productFractionDigits = productTotalPrice.length - item.totalPrice.fractionDigits;
        const updatedPrice = `${productTotalPrice.slice(0, productFractionDigits)}.${productTotalPrice.slice(productFractionDigits)}`;

        priceElement.element.textContent = updatedPrice;
      }
      lineItemsId.push(item.id);
    });

    if (!lineItemsId.includes(lineItemId)) {
      productElement.remove();
    }

    await this.totalAmountUpdating();
  }

  async totalAmountUpdating() {
    const cart = await sdk.getCurrentCart();

    if (typeof cart === 'string') return;

    const totalPrice = cart.totalPrice.centAmount.toString();
    const fractionDigits = totalPrice.length - cart.totalPrice.fractionDigits;
    const updatedPrice = `${totalPrice.slice(0, fractionDigits)}.${totalPrice.slice(fractionDigits)}`;

    this.totalAmount.element.textContent = updatedPrice;
  }

  productRemoving(removeBtn: BaseElement) {
    removeBtn.addListener('click', () => {
      console.log('clicked', removeBtn.element);
    });
  }
}
