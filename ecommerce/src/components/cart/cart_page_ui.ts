import BaseElement from '@/utils/elements/basic_element';
import Button from '@/utils/elements/button';
import Paragraph from '@/utils/elements/paragraph';
import Section from '@/utils/elements/section';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import { CartPagedQueryResponse, MyCartUpdateAction } from '@commercetools/platform-sdk';

export default class CartPage extends Section {
  // profileContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] });
  // profileEngine: ProfileEngine = new ProfileEngine(this.profileContDetailed);

  // paragraphFields: Paragraph[] = [];
  // errorConts: ErrorContainer[] = [];

  constructor() {
    super({ classes: [CLASS_NAMES.cart.cartPage] });

    void this.layoutRendering();
  }

  async layoutRendering() {
    await sdk.getAllCarts(); // необходимый вызов для корректной работы корзины
    const lineItems = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results[0].lineItems;

    // debug
    const addHT = new Button({ content: 'add Hybrid Theory' });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    addHT.addListener('click', async () => {
      await this.testAddProduct('80b6cb45-b226-48e3-99a8-0d415bc5b357');
    });
    const addMeteora = new Button({ content: 'add Meteora' });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    addMeteora.addListener('click', async () => {
      await this.testAddProduct('1d037d83-24de-4751-9ef1-aa4d7e53ac76');
    });
    const addReiseReise = new Button({ content: 'add Reise Reise' });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    addReiseReise.addListener('click', async () => {
      await this.testAddProduct('0b054419-7633-425d-a5b3-9dd749072a4f');
    });
    //

    // title and main containers creating
    this.element.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.cartTitle }).element);
    const promoInfo = new BaseElement(
      { classes: [CLASS_NAMES.cart.cartPromoInfoCont] },
      new BaseElement({ tag: 'h3', content: TEXT_CONTENT.cartPromoInfoMainTitle }),
      new Paragraph(TEXT_CONTENT.cartPromoInfoSubTitle)
    );
    const cartMainCont = new BaseElement({ classes: [CLASS_NAMES.cart.cartMainCont] });
    const cartListCont = new BaseElement({ tag: 'table', classes: [CLASS_NAMES.cart.cartListCont] });
    const cartTotalCont = new BaseElement({ classes: [CLASS_NAMES.cart.cartTotalCont] });

    // tHead elements creating
    const cartTHead = new BaseElement({ tag: 'thead' });
    const cartTheadTr = new BaseElement({ tag: 'tr' });

    CLASS_NAMES.cart.cartListTHead.forEach((tdContent) => {
      cartTheadTr.append(new BaseElement({ tag: 'td', content: tdContent }));
    });

    cartTHead.append(cartTheadTr);
    // tBody elements creating

    const cartTBody = new BaseElement({ tag: 'tbody' });
    lineItems.forEach((item) => {
      if (!item.variant.images || !item.variant.prices) return;

      const variantAmountType = item.variant.prices[0].discounted || item.variant.prices[0];
      const variantAmount = variantAmountType.value.centAmount.toString();
      const variantFractionDigits = variantAmountType.value.fractionDigits;

      const productSKU = item.variant.sku as string;
      const productTotalPrice = item.totalPrice.centAmount;
      const productFractionDigits = item.totalPrice.fractionDigits;

      const productCover = new Image(100, 100);
      productCover.src = item.variant.images[0].url;

      cartTBody.append(
        new BaseElement(
          { tag: 'tr' },
          new BaseElement({ tag: 'td' }, productCover),
          new BaseElement(
            { tag: 'td' },
            new Paragraph(productSKU.split('-')[0]),
            new Paragraph(productSKU.split('-')[1])
          ),
          new BaseElement({
            tag: 'td',
            content: `${variantAmount.slice(0, variantFractionDigits)}.${variantAmount.slice(variantFractionDigits)}`,
          }),
          new BaseElement({ tag: 'td', content: `- ${item.quantity} +` }),
          new BaseElement({
            tag: 'td',
            content: `${productTotalPrice.toString().slice(0, productFractionDigits)}.${productTotalPrice.toString().slice(productFractionDigits)}`,
          }),
          new BaseElement({ tag: 'td', content: '🗑️' })
        )
      );
    });

    cartListCont.appendChildren(cartTHead, cartTBody);

    this.appendChildren(addHT, addMeteora, addReiseReise); //debug
    cartMainCont.appendChildren(cartListCont, cartTotalCont);
    this.appendChildren(promoInfo, cartMainCont);

    /////////////////////////////////////////////////////////////////////
    // console.log(await this.testRemoveAllCarts());
    console.log(await this.testGetAllCarts(), 'all');

    // console.log(await this.testRemoveAllCarts());
  }

  async testCartCreating() {
    const newCart = await sdk.createCart();
    return newCart;
  }

  async testGetAllCarts() {
    const allCarts = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results;
    return allCarts;
  }

  async testGetFirstCartId() {
    const allCarts = await this.testGetAllCarts();
    const cartId = allCarts[0].id;
    return cartId;
  }

  async testAddProduct(id: string) {
    const cartId = await this.testGetFirstCartId();
    const addingData: MyCartUpdateAction[] = [
      {
        action: 'addLineItem',
        productId: id,
        variantId: 1,
        quantity: 1,
      },
    ];
    // const addingData: MyCartUpdateAction[] = [
    //   {
    //     action: 'addLineItem',
    //     productId: '80b6cb45-b226-48e3-99a8-0d415bc5b357',
    //     variantId: 1,
    //     quantity: 1,
    //   },
    //   {
    //     action: 'addLineItem',
    //     productId: '1d037d83-24de-4751-9ef1-aa4d7e53ac76',
    //     variantId: 2,
    //     quantity: 1,
    //   },
    //   {
    //     action: 'addLineItem',
    //     productId: '0b054419-7633-425d-a5b3-9dd749072a4f',
    //     variantId: 1,
    //     quantity: 1,
    //   },
    // ];
    const currentCart = await sdk.updateCartByID(cartId, addingData);
    return currentCart;
  }

  async testRemoveProduct(id: string) {
    await sdk.removeProductInCartByID(id, 1);
  }

  async testRemoveAllCarts() {
    const allCarts = (await sdk.getAllCarts()) as CartPagedQueryResponse;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    allCarts.results.forEach(async (el) => {
      console.log(el.id);
      await sdk.deleteCart({ ID: el.id });
    });
  }
}
