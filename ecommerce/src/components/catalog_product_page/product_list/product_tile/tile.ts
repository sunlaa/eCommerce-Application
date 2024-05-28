import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { ProductProjection } from '@commercetools/platform-sdk';

export default class ProductTile extends BaseElement {
  productData: ProductProjection;

  productImage: BaseElement<HTMLImageElement> = new BaseElement({
    tag: 'img',
    classes: [CLASS_NAMES.catalog.producImage],
  });

  productInfo: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productInfo] });

  productBrief: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.catalog.productBrief],
  });

  productPrice: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productPriceContainer] });

  constructor(data: ProductProjection) {
    super({ classes: [CLASS_NAMES.catalog.productTile] });

    this.productData = data;
  }

  addImage() {
    if (this.productData.masterVariant.images) {
      this.productImage.element.src = this.productData.masterVariant.images[0].url;
    }
  }

  addBrief() {
    const name = new BaseElement({ tag: 'h3', classes: [CLASS_NAMES.catalog.productName] });
    const description = new Paragraph('', [CLASS_NAMES.catalog.productDescription]);

    name.content = this.productData.name.en;
    this.productData.description ? (description.content = this.productData.description.en) : null;

    this.productBrief.appendChildren(name, description);
  }

  addPrices() {
    // const actualPrice = new BaseElement({ classes: [CLASS_NAMES.catalog.actualPrice] });
    const discountPrice = new BaseElement({ classes: [CLASS_NAMES.catalog.discountPrice] });

    const discountData = this.productData.masterVariant.prices?.[0].discounted;

    if (discountData) {
      discountPrice.content = `${this.fixPrice(discountData.value.centAmount, discountData.value.fractionDigits)} ${discountData.value.currencyCode}`;
    }
  }

  fixPrice(centAmount: number, fracionDigit: number) {
    const multiplier = Math.pow(10, fracionDigit);
    return centAmount / multiplier;
  }
}
