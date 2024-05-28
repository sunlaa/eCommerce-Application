import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import { Product, ProductData, ProductVariant } from '@commercetools/platform-sdk';

export default class ProductPageUI extends BaseElement {
  private selectVariantFormDropdown: BaseElement;
  private productData: Product;
  constructor(productData: Product) {
    super(CLASS_NAMES.product.productPage);
    this.productData = productData;
    this.selectVariantFormDropdown = new BaseElement(
      {
        tag: 'select',
        classes: [CLASS_NAMES.product.selectVariantFormDropdown],
        content: 'Select variant',
      },
      new BaseElement({ tag: 'option', content: this.productData.masterData.current.masterVariant.sku }),
      ...this.productData.masterData.current.variants.map(
        (variant) => new BaseElement({ tag: 'option', content: variant.sku })
      )
    );
    this.selectVariantFormDropdown.addListener('change', (event) => {
      event.preventDefault();
      this.spawnSection();
    });
    this.spawnSection();
  }

  spawnSection() {
    // Recalculated on select form change
    const selectedVariant: ProductVariant = this.getSelectedVariant(this.productData.masterData.current);

    // Image
    const imgContainer = new BaseElement({ classes: [CLASS_NAMES.product.imgContainer] });
    selectedVariant.images?.forEach((image) => {
      const productImg = document.createElement('img');
      productImg.src = image.url;
      productImg.alt = image.label as string;
      productImg.classList.add(CLASS_NAMES.product.productImg);
      imgContainer.append(productImg);
    });

    // Info
    const productTitle = new BaseElement({
      tag: 'h2',
      classes: [CLASS_NAMES.product.productTitle],
      content: selectedVariant.sku,
    });
    const productPrice = new BaseElement({
      tag: 'p',
      classes: [CLASS_NAMES.product.productPrice],
      content:
        '' +
        (selectedVariant.prices?.[0].value?.centAmount || 0) / 100 +
        ' ' +
        selectedVariant.prices?.[0].value?.currencyCode,
    });
    const yearValue = selectedVariant.attributes?.[0]?.value as string;
    const productYear = new BaseElement({ tag: 'p', classes: [CLASS_NAMES.product.productYear], content: yearValue });
    const colorValue = selectedVariant.attributes?.[1]?.value as string;
    const productColor = new BaseElement({
      tag: 'p',
      classes: [CLASS_NAMES.product.productColor],
      content: colorValue,
    });

    const productDescription = new BaseElement({
      tag: 'p',
      classes: [CLASS_NAMES.product.productDescription],
      content: this.productData.masterData.current.description?.en,
    });

    const tracksValue = selectedVariant.attributes?.[2]?.value as string;
    const tracks = Object.entries(JSON.parse(tracksValue) as Record<string, string>).map(
      ([key, value]) => new BaseElement({ tag: 'li', content: `${key}: ${value}` })
    );
    const productTracks = new BaseElement({ tag: 'ul', classes: [CLASS_NAMES.product.productTracks] }, ...tracks);

    const productInfo = new BaseElement({ classes: [CLASS_NAMES.product.productInfo] });
    productInfo.appendChildren(
      productTitle,
      productPrice,
      productYear,
      productColor,
      this.selectVariantFormDropdown,
      productDescription,
      productTracks
    );

    const productInfoContainer = new BaseElement({ classes: [CLASS_NAMES.product.productInfoContainer] });
    productInfoContainer.append(productInfo);

    const section = new Section({ classes: [CLASS_NAMES.product.productSection] });
    section.appendChildren(imgContainer, productInfoContainer);

    this.element.innerHTML = '';
    this.element.append(section.element);
  }

  getSelectedVariant(productData: ProductData) {
    const sku: string = (this.selectVariantFormDropdown.element as HTMLSelectElement).value;
    if (productData.masterVariant.sku === sku) {
      return productData.masterVariant;
    }
    return productData.variants.find((variant) => variant.sku === sku) as ProductVariant;
  }
}
