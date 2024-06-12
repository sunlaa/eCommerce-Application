import Loader from '@/components/general/loader';
import './cart_manager.sass';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { ProductProjection, ProductVariant } from '@commercetools/platform-sdk';

type VinylColors = 'black' | 'blue' | 'red';
// добавить кружочки на тайлы с проигрывателями

export default class TileCartManager extends BaseElement {
  colorContainer: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.colorContainer] });
  colorItems: BaseElement[] = [];

  addToCartContainer: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.addToCart] });

  addToCartImage = new BaseElement<HTMLImageElement>({
    tag: 'img',
    classes: [CLASS_NAMES.catalog.addToCartImage],
    src: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/cart/cart_icon.png',
  });

  variants: ProductVariant[];
  productData: ProductProjection;

  isCartExist: boolean = false;
  choosenColor: VinylColors = 'black';
  colorMap: Map<string, ProductVariant> = new Map();

  loader = new Loader();

  constructor(productData: ProductProjection) {
    super({ classes: [CLASS_NAMES.catalog.tileCartManager] });

    this.variants = [productData.masterVariant, ...productData.variants];
    this.productData = productData;

    void this.markProductAlreadyInCart();

    this.addToCartContainer.append(this.addToCartImage);
    this.append(this.addToCartContainer);

    this.addToCartContainer.addListener('click', () => void this.addProduct());
  }

  async markProductAlreadyInCart() {
    const carts = await sdk.getAllCarts();
    if (typeof carts === 'string') throw new Error(`Error in receiving carts: ${carts}`);

    this.isCartExist = Boolean(carts.results.length);
    if (!this.isCartExist) return;

    const lineItems = carts.results[0].lineItems;

    lineItems.forEach((item) => {
      if (item.productId === this.productData.id) {
        this.addToCartContainer.addClass('disabled');
      }
    });
  }

  createColorPanel() {
    const colors: VinylColors[] = [];

    this.variants.forEach((variant) => {
      if (!variant.attributes) return;
      variant.attributes.forEach((attribute) => {
        if (attribute.name === 'color') {
          colors.push(attribute.value as VinylColors);
          this.colorMap.set(attribute.value as string, variant);
        }
      });
    });

    colors.forEach((color) => {
      const item = this.createColorItem(color);
      this.colorItems.push(item);
    });

    this.prepend(this.colorContainer);
    this.colorContainer.appendChildren(...this.colorItems);
  }

  createColorItem(color: VinylColors) {
    const item = new BaseElement({ classes: [CLASS_NAMES.catalog.colorItem] });
    item.addClass(color);

    item.addListener('click', () => {
      this.colorItems.forEach((item) => item.removeClass('choosen'));
      item.addClass('choosen');
      this.choosenColor = color;
    });

    return item;
  }

  addProduct = async () => {
    this.addToCartImage.setStyles({ display: 'none' });
    this.loader.show(this.addToCartContainer);

    if (!this.isCartExist) {
      await sdk.createCart();
    }

    const variant = this.colorMap.get(this.choosenColor) || this.variants[0];

    await sdk
      .addProductInCart(variant)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });

    this.loader.hide();
    this.addToCartContainer.addClass('disabled');
    setTimeout(() => this.addToCartImage.setStyles({ display: 'flex' }), 400);
  };
}
