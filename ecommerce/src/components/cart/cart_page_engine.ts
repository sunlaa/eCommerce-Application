/* eslint-disable @typescript-eslint/no-misused-promises */
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Cart, CartPagedQueryResponse, MyCartUpdateAction } from '@commercetools/platform-sdk';
import CartPage from './cart_page_ui';
import { cartEmptyCont } from './cart_empty_container';
import InputField from '@/utils/elements/input_field';
import Button from '@/utils/elements/button';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import { notification } from '../general/notification/notification';

export default class CartEngine {
  listCont: BaseElement;
  totalAmount: BaseElement;
  section: CartPage;
  giftPrice: number = 0;
  saveCont: BaseElement;

  constructor(listCont: BaseElement, totalAmount: BaseElement, section: CartPage, saveCont: BaseElement) {
    this.listCont = listCont;
    this.totalAmount = totalAmount;
    this.section = section;
    this.saveCont = saveCont;
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
    const parentElement = quantityElement.parentElement as HTMLDivElement;

    const productId = parentElement.dataset.productId as string;
    const variantId = parentElement.dataset.variantId as string;
    const lineItemId = parentElement.dataset.itemId as string;

    if (actionElement.textContent === '-') {
      const lineItems = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results[0].lineItems;
      if (lineItems.length === 1 && quantityElement.textContent && +quantityElement.textContent === 1)
        this.emptyMessageRendering();

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
        const updatedPrice = `€${productTotalPrice.slice(0, productFractionDigits)}.${productTotalPrice.slice(productFractionDigits)}`;

        priceElement.element.textContent = updatedPrice;
      }
      lineItemsId.push(item.id);
    });

    if (!lineItemsId.includes(lineItemId)) {
      productElement.remove();
    }

    await this.totalPriceUpdating();
  }

  async totalPriceUpdating() {
    const cart = await sdk.getCurrentCart();

    if (typeof cart === 'string') return;

    const totalPrice = cart.totalPrice.centAmount.toString();
    const fractionDigits = totalPrice.length - cart.totalPrice.fractionDigits;
    const updatedPrice = `€${totalPrice.slice(0, fractionDigits)}.${totalPrice.slice(fractionDigits)}`;

    this.totalAmount.element.textContent = updatedPrice;

    let discountedAmount;
    if (cart.discountOnTotalPrice) {
      discountedAmount = cart.discountOnTotalPrice.discountedAmount;
    } else {
      discountedAmount = {
        centAmount: 0,
        fractionDigits: 2,
      };
    }

    const productTotalPrice = (cart.totalPrice.centAmount + discountedAmount.centAmount + this.giftPrice).toString();
    const productFractionDigits = productTotalPrice.length - discountedAmount.fractionDigits;
    const savingAmount = `€${productTotalPrice.slice(0, productFractionDigits)}.${productTotalPrice.slice(productFractionDigits)}`;

    this.saveCont.element.textContent = savingAmount;
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
        await this.totalPriceUpdating();
      });
    });
  }

  emptyMessageRendering() {
    this.section.removeChildren();
    this.section.appendChildren(this.section.pageTitle, cartEmptyCont);
  }

  async clearCart() {
    const currentCart = (await sdk.getCurrentCart()) as Cart;
    const cartId = currentCart.id;
    const cartDiscounts = currentCart.discountCodes;
    const removingCodes: MyCartUpdateAction[] = [];

    cartDiscounts.forEach((discount) => {
      removingCodes.push({
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: discount.discountCode.id,
        },
      });
    });

    await sdk.updateCartByID(cartId, removingCodes);

    const lineItems = ((await sdk.getCurrentCart()) as Cart).lineItems;
    const removingData: MyCartUpdateAction[] = [];

    lineItems.forEach((item) => {
      removingData.push({
        action: 'removeLineItem',
        lineItemId: item.id,
        quantity: item.quantity,
      });
    });

    await sdk.updateCartByID(cartId, removingData);
    smoothTransitionTo(new CartPage());
  }

  promocodeApply(inputField: InputField, applyButton: Button) {
    const inputElement = inputField.input.element;
    const errorCont = inputField.errorContainer!.element;

    applyButton.addListener('click', async () => {
      if (TEXT_CONTENT.cartPromoCodes.includes(inputElement.value)) {
        await sdk.addDiscountCode(inputElement.value);
        smoothTransitionTo(new CartPage());
        notification.showSuccess(TEXT_CONTENT.successPromoCodeAdded);
      } else if (inputElement.value === '') {
        errorCont.textContent = TEXT_CONTENT.cartPromoEmpty;
      } else {
        errorCont.textContent = TEXT_CONTENT.cartPromoWrong;
      }
    });
  }

  promocodeRemove(removeBtn: Button) {
    removeBtn.addListener('click', async () => {
      const codeId = removeBtn.element.dataset.id;
      if (!codeId) return;

      await sdk.removeDiscountCode(codeId);
      smoothTransitionTo(new CartPage());
    });
  }

  checkout(checkoutBtn: Button) {
    checkoutBtn.addListener('click', async () => {
      await this.clearCart();
      notification.showSuccess(TEXT_CONTENT.successCheckout);
    });
  }
}
