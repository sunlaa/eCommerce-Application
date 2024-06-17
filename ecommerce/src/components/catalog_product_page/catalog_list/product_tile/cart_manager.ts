import './cart_manager.sass';
import Loader from '@/components/general/loader';
import { notification } from '@/components/general/notification/notification';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { ErrorProps, ProductTypeKeys, VinylColors } from '@/utils/types_variables/types';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { LineItem, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';

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

  vinylImg?: BaseElement<HTMLImageElement>;

  variants: ProductVariant[];
  productData: ProductProjection;
  lineItems: LineItem[] | null = null;

  isCartExist: boolean = false;
  choosenColor: VinylColors = '';
  colorMap: Map<string, ProductVariant> = new Map();
  productType: string | null = null;

  loader = new Loader();

  constructor(productData: ProductProjection) {
    super({ classes: [CLASS_NAMES.catalog.tileCartManager] });

    this.variants = [productData.masterVariant, ...productData.variants];
    this.productData = productData;

    void this.getProductType();
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

    this.lineItems = carts.results[0].lineItems;

    this.lineItems.forEach((item) => {
      if (item.productId === this.productData.id) {
        this.addToCartContainer.addClass('disabled');
        this.colorContainer.setStyles({ pointerEvents: 'none' });
      }
    });
  }

  async getProductType() {
    const typeId = this.productData.productType.id;
    const key = (await sdk.getProductTypeById(typeId)).key;
    if (key) this.productType = key;
  }

  addProduct = async () => {
    this.showLoader();

    if (!this.isCartExist) {
      await sdk.createCart();
    }

    let message = '';
    let variant: ProductVariant;

    if (this.productType === ProductTypeKeys.recordPlayers) {
      variant = this.variants[0];
      message = `Record player "${this.productData.name.en}" successfully added to cart!`;
    } else {
      const result = this.colorMap.get(this.choosenColor);
      const color = this.choosenColor.charAt(0).toUpperCase() + this.choosenColor.slice(1);
      message = `${color} vinyl recorder "${this.productData.name.en}" successfully added to cart!`;
      if (!result) {
        notification.showError('Please, select the color of the record!');
        this.hideLoader();
        return;
      }
      variant = result;
    }

    await sdk
      .addProductInCart(variant)
      .then(() => notification.showSuccess(message))
      .catch((err) => {
        const error = err as ErrorProps;
        notification.showError(error.message);
      });

    this.addToCartContainer.addClass('disabled');
    this.hideLoader();

    this.colorItems.forEach((item) => item.setStyles({ pointerEvents: 'none' }));
  };

  showLoader() {
    this.addToCartImage.setStyles({ display: 'none' });
    this.loader.show(this.addToCartContainer);
  }

  hideLoader() {
    this.loader.hide();
    setTimeout(() => this.addToCartImage.setStyles({ display: 'flex' }), 400);
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
    const item = new BaseElement({ classes: [CLASS_NAMES.catalog.colorItem, color] });

    if (this.lineItems) {
      const hasMatchingLineItem = this.lineItems.some((lineItem) => {
        if (lineItem.productId !== this.productData.id) return false;

        const { attributes } = lineItem.variant;
        if (!attributes) return false;

        return attributes.some((attr) => attr.name === 'color' && attr.value === color);
      });

      if (hasMatchingLineItem) {
        if (this.vinylImg)
          this.vinylImg.element.src = `https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/color_vinyls/${color}.png`;

        item.addClass('choosen');
      }
    }

    item.addListener('click', () => {
      if (this.vinylImg) {
        this.vinylImg.element.src = `https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/color_vinyls/${color}.png`;
      }
      this.colorItems.forEach((item) => item.removeClass('choosen'));
      item.addClass('choosen');
      this.choosenColor = color;
    });

    return item;
  }
}
