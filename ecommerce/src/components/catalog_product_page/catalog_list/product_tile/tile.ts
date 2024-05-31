import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { fixPrice } from '@/utils/functions/fix_price';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';
import { ProductProjection } from '@commercetools/platform-sdk';

export default class ProductTile extends BaseElement {
  productData: ProductProjection;

  productImage: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.catalog.producImageContainer],
  });

  productInfo: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productInfo] });

  productBrief: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.catalog.productBrief],
  });

  productPrice: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productPriceContainer] });

  constructor(data: ProductProjection) {
    super({ classes: [CLASS_NAMES.catalog.productTile] });

    this.productData = data;

    this.createTile();
  }

  createTile() {
    this.addImage();
    this.addInfo();
    this.addPrices();

    this.appendChildren(this.productImage, this.productInfo);
  }

  addImage() {
    if (this.productData.masterVariant.images) {
      const image = new BaseElement<HTMLImageElement>({ tag: 'img', classes: [CLASS_NAMES.catalog.productImage] })
        .element;
      image.src = this.productData.masterVariant.images[0].url;
      this.productImage.append(image);
    }
  }

  addInfo() {
    const name = new BaseElement({ tag: 'h3', classes: [CLASS_NAMES.catalog.productName] });
    const description = new Paragraph('', [CLASS_NAMES.catalog.productDescription]);

    name.content = this.productData.name.en;
    const text = this.productData.description?.en;
    text ? (description.content = text.slice(0, NUMERIC_DATA.descriptionCharCount) + '...') : null;

    this.productBrief.appendChildren(name, description);
    this.productInfo.append(this.productBrief);
  }

  addPrices() {
    const actualPrice = new BaseElement({ classes: [CLASS_NAMES.catalog.actualPrice] });
    const discountPrice = new BaseElement({ classes: [CLASS_NAMES.catalog.discountPrice] });

    const maxPriceVariant = this.getMaxPrice();

    const discountData = maxPriceVariant.prices?.[0].discounted;
    const actualData = maxPriceVariant.prices?.[0];

    if (discountData) {
      discountPrice.content = `${fixPrice(discountData.value.centAmount, discountData.value.fractionDigits)} ${discountData.value.currencyCode}`;
      this.productPrice.append(discountPrice);
      actualPrice.addClass(CLASS_NAMES.catalog.withDiscount);
    }
    if (actualData) {
      actualPrice.content = `${fixPrice(actualData.value.centAmount, actualData.value.fractionDigits)} ${actualData.value.currencyCode}`;
      this.productPrice.append(actualPrice);
    }

    this.productInfo.append(this.productPrice);
  }

  getMaxPrice() {
    if (this.productData.variants.length === 0) {
      return this.productData.masterVariant;
    }

    let maxPrice: number = 0;
    let index: number = 0;

    this.productData.variants.forEach((variant, i) => {
      const prices = variant.prices;
      if (!prices) return;
      if (maxPrice < prices[0].value.centAmount) {
        maxPrice = prices[0].value.centAmount;
        index = i;
      }
    });
    return this.productData.variants[index];
  }
}
