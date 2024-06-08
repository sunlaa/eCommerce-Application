import Section from '@/utils/elements/section';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { MyCartUpdateAction, ProductVariant } from '@commercetools/platform-sdk';

export default class CartPage extends Section {
  // profileContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] });
  // profileEngine: ProfileEngine = new ProfileEngine(this.profileContDetailed);

  // paragraphFields: Paragraph[] = [];
  // errorConts: ErrorContainer[] = [];

  constructor() {
    super({ classes: [] });

    void this.layoutRendering();
  }

  async createCartIfNotExist() {
    // нужно будет подумать, где лучше вставить момент с проверкой корзин после авторизации
    // (возможно можно оставить там где он был или засунуть в метод sdk.login())
    const res = await this.testGetAllCarts();
    if (res.length === 0) {
      await sdk.createCart();
    }
  }

  async layoutRendering() {
    await this.createCartIfNotExist();
    await this.testAddProduct();
    const res = await this.testGetAllCarts();
    console.log('Before adding product variants: ', res);

    await this.testRemoveProduct();
    const res2 = await this.testGetAllCarts();
    console.log('Before deleting one variant: ', res2);
  }

  async testCartCreating() {
    const newCart = await sdk.createCart();
    return newCart;
  }

  async testGetAllCarts() {
    const response = await sdk.getAllCarts();
    if (typeof response === 'string') return response;
    return response.results;
  }

  async testGetFirstCartId() {
    const allCarts = await this.testGetAllCarts();
    if (typeof allCarts === 'string') return allCarts;
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
    // не рабочий метод, после того как Катя покажет свою реализацию нужно будет изменить
    const mockVariant: ProductVariant = { id: 1, key: '9ff9eb1c-1fb4-4908-b05a-0fc45bcde0bf' };
    await sdk.removeProductInCart(mockVariant);
    // const currentLines = (await sdk.getAllCarts())!['results'][0]['lineItems'];
    // return currentLines;
  }

  // async testRemoveAllCarts() {
  //   const allCarts = await sdk.getAllCarts();
  //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //   (allCarts!['results'] as { id: string }[]).forEach(async (el) => {
  //     console.log(el.id);
  //     await sdk.deleteCart({ ID: el.id });
  //   });
  // }
}
