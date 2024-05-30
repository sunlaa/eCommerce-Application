import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import { Product, ProductData, ProductType, ProductVariant } from '@commercetools/platform-sdk';
import Paragraph from '@/utils/elements/paragraph';
import Button from '@/utils/elements/button';

enum ProductPageVariant {
  vinyl = 'vinyl',
  recordPlayers = 'record-players',
}

export default class ProductPageUI extends BaseElement {
  private selectVariantFormDropdown: BaseElement;
  private product: Product;
  private productType: ProductType;

  constructor(product: Product, productType: ProductType) {
    super(CLASS_NAMES.product.productPage);
    this.product = product;
    this.productType = productType;
    this.selectVariantFormDropdown = this.composeSelectVariantForm();
    this.spawnSection();
  }

  getSelectedVariant(productData: ProductData): ProductVariant {
    const sku: string = (this.selectVariantFormDropdown.element as HTMLSelectElement).value;
    if (productData.masterVariant.sku === sku) {
      return productData.masterVariant;
    }
    return productData.variants.find((variant) => variant.sku === sku) as ProductVariant;
  }

  isProductTypeVinyl(): boolean {
    return this.productType.key === ProductPageVariant.vinyl;
  }
  isProductTypePlayer(): boolean {
    return this.productType.key === ProductPageVariant.recordPlayers;
  }

  spawnSection(): void {
    const selectedVariant: ProductVariant = this.getSelectedVariant(this.product.masterData.current);

    const productImagesSliderContainer = this.composeProductImagesSlider(selectedVariant);
    const productInfoContainer = new BaseElement(
      { classes: [CLASS_NAMES.product.productInfoContainer] },
      this.composeProductTitle(selectedVariant),
      // Show variants form if variants exist
      this.product.masterData.current.variants.length ? this.selectVariantFormDropdown : null,
      this.composeProductPrice(selectedVariant),
      this.composeProductYear(selectedVariant),
      // Only Vinyl has color
      this.isProductTypeVinyl() ? this.composeProductColor(selectedVariant) : null,
      this.composeProductDescription(),
      // Only Vinyl has tracks
      this.isProductTypeVinyl() ? this.composeTracksElement(selectedVariant) : null
    );
    const section = new Section({ classes: [CLASS_NAMES.product.productSection] });
    section.appendChildren(productImagesSliderContainer, productInfoContainer);
    this.element.replaceChildren(section.element);
  }

  composeProductTitle(selectedVariant: ProductVariant): BaseElement {
    const attributeForTitle = this.isProductTypeVinyl() ? 'artist' : 'brand';
    const titleText =
      (selectedVariant.attributes?.filter((item) => item.name === attributeForTitle)[0]?.value as string) +
      ' ' +
      this.product.masterData.current.name?.en;
    return new BaseElement({ tag: 'h2', classes: [CLASS_NAMES.product.productTitle], content: titleText });
  }

  composeProductPrice(selectedVariant: ProductVariant): BaseElement {
    return new Paragraph(
      '' +
        (selectedVariant.prices?.[0].value?.centAmount || 0) / 100 +
        ' ' +
        selectedVariant.prices?.[0].value?.currencyCode,
      [CLASS_NAMES.product.productPrice]
    );
  }

  composeProductDescription(): BaseElement {
    const paragraphs: string[] = this.product.masterData.current.description?.en?.split('\\n') || [];
    const section = new BaseElement({ classes: [CLASS_NAMES.product.productDescription] });
    section.appendChildren(...paragraphs.map((paragraph) => new Paragraph(paragraph)));
    return section;
  }

  composeProductColor(selectedVariant: ProductVariant): BaseElement {
    return new Paragraph(
      `Color: ${selectedVariant.attributes?.filter((item) => item.name === 'color')[0]?.value as string}`,
      [CLASS_NAMES.product.productColor]
    );
  }

  composeProductYear(selectedVariant: ProductVariant): BaseElement {
    return new Paragraph(
      `Year of release: ${selectedVariant.attributes?.filter((item) => item.name === 'year')[0]?.value as string}`,
      [CLASS_NAMES.product.productYear]
    );
  }

  composeProductImagesSlider(selectedVariant: ProductVariant): BaseElement {
    const imagesContainer = new BaseElement({ classes: [CLASS_NAMES.product.productImgContainer] });
    const imagesSlider = new BaseElement({ classes: [CLASS_NAMES.product.productImgSliderContainer] });
    selectedVariant.images?.forEach((image) => {
      const productImg = document.createElement('img');
      productImg.src = image.url;
      productImg.alt = image.label as string;
      productImg.classList.add(CLASS_NAMES.product.productImg);
      imagesSlider.append(productImg);
    });
    const prevButton = new Button({ classes: [CLASS_NAMES.product.productImgSliderButtonPrev], content: '❮' });
    prevButton.addListener('click', () => (imagesSlider.element.scrollLeft -= 400));

    const nextButton = new Button({ classes: [CLASS_NAMES.product.productImgSliderButtonNext], content: '❯' });
    nextButton.addListener('click', () => (imagesSlider.element.scrollLeft += 400));

    imagesContainer.appendChildren(imagesSlider, prevButton, nextButton);
    return imagesContainer;
  }

  composeTracksElement(selectedVariant: ProductVariant): BaseElement {
    const tracksValue = selectedVariant.attributes?.[2]?.value as string;
    const tracks = Object.entries(JSON.parse(tracksValue || '[]') as Record<string, string>).map(
      ([key, value]) => new BaseElement({ tag: 'li', content: `${key}: ${value}` })
    );
    const songsContainer = new BaseElement({ classes: [CLASS_NAMES.product.productTracksContainer] });
    const listTitle = new BaseElement({ tag: 'h4', content: 'List of songs:' });
    songsContainer.appendChildren(listTitle, ...tracks);
    return songsContainer;
    // return new BaseElement({ tag: 'ul', classes: [CLASS_NAMES.product.productTracks] }, ...tracks);
  }

  composeSelectVariantForm(): BaseElement {
    const selectForm = new BaseElement({
      tag: 'select',
      classes: [CLASS_NAMES.product.selectVariantFormDropdown],
      content: 'Select variant',
    });
    const masterVariant = new BaseElement({
      tag: 'option',
      content: this.product.masterData.current.masterVariant.sku,
    });
    const extraVariants = this.product.masterData.current.variants.map(
      (variant) => new BaseElement({ tag: 'option', content: variant.sku })
    );
    selectForm.appendChildren(masterVariant, ...extraVariants);
    selectForm.addListener('change', () => {
      this.spawnSection();
    });
    return selectForm;
  }
}
