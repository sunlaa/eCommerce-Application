import './cart_manager.sass';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { ProductVariant } from '@commercetools/platform-sdk';

type VinylColors = 'black' | 'blue' | 'red';
// добавить кружочки на тайлы с проигрывателями

export default class TileCartManager extends BaseElement {
  colorContainer: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.colorContainer] });
  colorItems: BaseElement[] = [];

  addToCart: BaseElement = new BaseElement(
    { classes: [CLASS_NAMES.catalog.addToCart] },
    new BaseElement<HTMLImageElement>({
      tag: 'img',
      classes: [CLASS_NAMES.catalog.addToCartImage],
      src: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/cart/cart_icon.png',
    })
  );

  variants: ProductVariant[];

  choosenColor: VinylColors = 'black';

  constructor(variants: ProductVariant[]) {
    super({ classes: [CLASS_NAMES.catalog.tileCartManager] });

    this.variants = variants;

    this.append(this.addToCart);
  }

  createColorPanel() {
    const colors: VinylColors[] = [];

    this.variants.forEach((variant) => {
      if (!variant.attributes) return;
      variant.attributes.forEach((attribute) => {
        if (attribute.name === 'color') {
          colors.push(attribute.value as VinylColors);
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

  async isCartExist() {
    const carts = await sdk.getAllCarts();
    if (typeof carts === 'string') throw new Error(`Error in receiving carts: ${carts}`);

    return Boolean(carts.results.length);
  }

  addProduct = async () => {
    const isCart = await this.isCartExist();
    if (!isCart) {
      await sdk.createCart();
    }
  };
}
