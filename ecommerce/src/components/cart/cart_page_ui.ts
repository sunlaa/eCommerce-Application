import Section from '@/utils/elements/section';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
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
    await this.testGetAllCarts(); // необходимый вызов для корректной работы корзины
    console.log('rendered');

    // console.log(await this.testAddProduct());
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

  async testAddProduct() {
    const cartId = await this.testGetFirstCartId();
    const addingData: MyCartUpdateAction[] = [
      {
        action: 'addLineItem',
        productId: '80b6cb45-b226-48e3-99a8-0d415bc5b357',
        variantId: 1,
        quantity: 2,
      },
      {
        action: 'addLineItem',
        productId: '1d037d83-24de-4751-9ef1-aa4d7e53ac76',
        variantId: 2,
        quantity: 1,
      },
      {
        action: 'addLineItem',
        productId: '0b054419-7633-425d-a5b3-9dd749072a4f',
        variantId: 1,
        quantity: 3,
      },
    ];

    const currentCart = await sdk.updateCartByID(cartId, addingData);
    return currentCart;
  }

  async testRemoveProduct() {
    // const cartId = await this.testGetFirstCartId();
    // await sdk.removeProductInCart(cartId, {
    //   lineItemId: '9ff9eb1c-1fb4-4908-b05a-0fc45bcde0bf',
    //   quantity: 1,
    // });
    // const currentLines = (await sdk.getAllCarts())!['results'][0]['lineItems'];
    // return currentLines;
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
