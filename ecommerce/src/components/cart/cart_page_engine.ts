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
    elQuanity: HTMLElement,
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
    quantityElement: HTMLElement,
    productElement: BaseElement,
    priceElement: BaseElement
  ) {
    // const currentQuantity = currentElement.textContent as string;
    const parentElement = quantityElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      // console.log(+currentQuantity - 1);
      const updatedCart = (await sdk.removeProductInCartByID(lineItemId, 1)) as Cart;
      await this.quantityUpdating(updatedCart, lineItemId, quantityElement, productElement, priceElement);
    } else {
      // console.log(+currentQuantity + 1);
      const updatedCart = (await sdk.addProductInCartByID(productId, +variantId)) as Cart;
      await this.quantityUpdating(updatedCart, lineItemId, quantityElement, productElement, priceElement);
    }
  }

  async quantityUpdating(
    cart: Cart,
    lineItemId: string,
    quantityElement: HTMLElement,
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

  productRemoving(removeBtn: HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    removeBtn.addEventListener('click', async () => {
      const cart = (await sdk.getCurrentCart()) as Cart;
      const lineItemId = removeBtn.dataset.id;

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      cart.lineItems.forEach(async (item, itemIndex) => {
        if (item.id !== lineItemId) return;

        await sdk.removeProductInCartByID(lineItemId, item.quantity);
        this.listCont.getChildren()[1].children[itemIndex].remove();
      });
    });
  }
}
