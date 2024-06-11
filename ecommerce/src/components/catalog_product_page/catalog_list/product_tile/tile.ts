import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import fixPrice from '@/utils/functions/fix_price';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { ProductTypeKeys } from '@/utils/types_variables/types';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';
import { ProductProjection } from '@commercetools/platform-sdk';

export default class ProductTile extends Anchor {
  productData: ProductProjection;

  productImage: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.catalog.producImageContainer],
  });
  mainImage = new BaseElement<HTMLImageElement>({
    tag: 'img',
    classes: [CLASS_NAMES.catalog.productImage],
  });

  productInfo: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productInfo] });

  productBrief: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.catalog.productBrief],
  });

  productPrice: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.productPriceContainer] });

  vinylImg = new BaseElement<HTMLImageElement>({
    classes: [CLASS_NAMES.catalog.vinylImg],
    tag: 'img',
    src: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/color_vinyls/black.png',
  });

  constructor(data: ProductProjection) {
    super({ classes: [CLASS_NAMES.catalog.productTile] });

    this.productData = data;
    void this.setHref();

    void this.createTile();
  }

  getVariant = (color: string) => {
    const variant = [...this.productData.variants, this.productData.masterVariant].find((variant) => {
      if (!variant.attributes) return;
      const colorAttribute = variant.attributes.find((attribute) => attribute.name === 'color');
      if (!colorAttribute) return;
      return colorAttribute.value === color;
    });
    return variant;
  };

  async setHref() {
    const categoryKey = await sdk.getCategoryKeyById(this.productData.categories[0].id);
    this.href = `/catalog/${categoryKey}/${this.productData.key}`;
  }

  async getProductType() {
    const typeId = this.productData.productType.id;
    const key = (await sdk.getProductTypeById(typeId)).key;
    return key;
  }

  async createTile() {
    this.addImage();
    this.addInfo();
    this.addPrices();

    const key = await this.getProductType();
    if (key === ProductTypeKeys.vinyl) {
      this.productImage.append(this.vinylImg);
      this.productImage.addClass('vinyl');
    }

    if (key === ProductTypeKeys.recordPlayers) {
      this.productImage.addClass('player');
      if (!this.productData.masterVariant.images) return;
      const secondImage = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.catalog.secondImage],
      });

      secondImage.element.src = this.productData.masterVariant.images[1].url;
      this.productImage.append(secondImage);
    }

    this.appendChildren(this.productImage, this.productInfo);
  }

  addImage() {
    if (this.productData.masterVariant.images) {
      const image = this.mainImage.element;
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

    const prefix = new BaseElement({ tag: 'span', classes: [CLASS_NAMES.catalog.prefix], content: 'from' });

    const discountData = this.productData.masterVariant.prices?.[0].discounted;
    const actualData = this.productData.masterVariant.prices?.[0];

    if (discountData) {
      discountPrice.content = `${fixPrice(discountData.value.centAmount, discountData.value.fractionDigits)} ${discountData.value.currencyCode}`;
      this.productPrice.append(discountPrice);
      actualPrice.addClass(CLASS_NAMES.catalog.withDiscount);
    }
    if (actualData) {
      actualPrice.content = `${fixPrice(actualData.value.centAmount, actualData.value.fractionDigits)} ${actualData.value.currencyCode}`;
      if (this.productData.variants.length > 0) {
        this.productPrice.prepend(prefix);
      }
      this.productPrice.append(actualPrice);
    }

    this.productInfo.append(this.productPrice);
  }
}
