/* eslint-disable @typescript-eslint/no-misused-promises */
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Cart, CartPagedQueryResponse, MyCartUpdateAction } from '@commercetools/platform-sdk';
import CartPage from './cart_page_ui';
import { cartEmptyCont } from './cart_empty_container';

export default class CartEngine {
  listCont: BaseElement;
  totalAmount: BaseElement;
  section: CartPage;

  constructor(listCont: BaseElement, totalAmount: BaseElement, section: CartPage) {
    this.listCont = listCont;
    this.totalAmount = totalAmount;
    this.section = section;
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
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine, elPrice)
    );
    elPlus.addListener(
      'click',
      async (event) => await this.quantityChanging(event.target as HTMLElement, elQuanity, elLine, elPrice)
    );
  }

  async quantityChanging(
    actionElement: HTMLElement,
    quantityElement: HTMLElement,
    productElement: BaseElement,
    priceElement: BaseElement
  ) {
    const currentQuantity = quantityElement.textContent as string;
    const parentElement = quantityElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      console.log(+currentQuantity);
      const lineItems = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results[0].lineItems;
      if (lineItems.length === 1 && +currentQuantity === 1) this.emptyMessageRendering();

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
    removeBtn.addEventListener('click', async () => {
      const cart = (await sdk.getCurrentCart()) as Cart;
      const lineItemId = removeBtn.dataset.id;

      if (cart.lineItems.length === 1) this.emptyMessageRendering();

      cart.lineItems.forEach(async (item, itemIndex) => {
        if (item.id !== lineItemId) return;

        await sdk.removeProductInCartByID(lineItemId, item.quantity);
        this.listCont.getChildren()[1].children[itemIndex].remove();
      });
    });
  }

  emptyMessageRendering() {
    this.section.removeChildren();
    this.section.appendChildren(this.section.pageTitle, cartEmptyCont);
  }

  clearCart(clearBtn: BaseElement) {
    clearBtn.addListener('click', async () => {
      const cartId = ((await sdk.getCurrentCart()) as Cart).id;
      const lineItems = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results[0].lineItems;
      const removingData: MyCartUpdateAction[] = [];

      lineItems.forEach((item) => {
        removingData.push({
          action: 'removeLineItem',
          lineItemId: item.id,
          quantity: item.quantity,
        });
      });

      await sdk.updateCartByID(cartId, removingData);
      this.emptyMessageRendering();
    });
  }
}
