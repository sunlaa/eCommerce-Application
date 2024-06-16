import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import { Product, ProductData, ProductType, ProductVariant } from '@commercetools/platform-sdk';
import Paragraph from '@/utils/elements/paragraph';
import { Gallery } from './product_page_gallery';
import Select from '@/utils/elements/select';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import Button from '@/utils/elements/button';

enum ProductPageVariant {
  vinyl = 'vinyl',
  recordPlayers = 'record-players',
}

export default class ProductPageUI extends BaseElement {
  private selectVariantFormDropdown: Select;
  private product: Product;
  private productType: ProductType;
  private addToCartButton: BaseElement;
  private removeFromCartButton: BaseElement;

  constructor(product: Product, productType: ProductType) {
    super(CLASS_NAMES.product.productPage);
    this.product = product;
    this.productType = productType;
    this.selectVariantFormDropdown = this.composeSelectVariantForm();
    this.addToCartButton = this.composeAddToCartButton();
    this.removeFromCartButton = this.composeRemoveFromCartButton();
    this.spawnSection();
  }

  getSelectedVariant(productData: ProductData): ProductVariant {
    const sku: string = this.selectVariantFormDropdown.element.value;
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

  async isProductInCart(key: string): Promise<boolean> {
    const currentCart = await sdk.getCurrentCart();
    if (typeof currentCart === 'object') {
      return currentCart.lineItems.some((item) => item.variant.key === key);
    } else {
      return false;
    }
  }

  async updateCartButtons() {
    const selectedVariant = this.getSelectedVariant(this.product.masterData.current);
    const key = selectedVariant.key;

    if (key) {
      const isInCart = await this.isProductInCart(key);
      if (isInCart) {
        this.addToCartButton.element.setAttribute('disabled', 'true');
        this.addToCartButton.element.style.display = 'none';
        this.removeFromCartButton.element.removeAttribute('disabled');
        this.removeFromCartButton.element.style.display = 'block';
      } else {
        this.addToCartButton.element.removeAttribute('disabled');
        this.addToCartButton.element.style.display = 'block';
        this.removeFromCartButton.element.setAttribute('disabled', 'true');
        this.removeFromCartButton.element.style.display = 'none';
      }
    }
  }

  async addToCart() {
    const selectedVariant = this.getSelectedVariant(this.product.masterData.current);
    const key = selectedVariant.key;
    if (key) {
      const currentCart = await sdk.getCurrentCart();
      if (!currentCart) {
        await sdk.createCart();
      }
      await sdk.addProductInCart(selectedVariant);
      await this.updateCartButtons();
    }
  }

  async removeFromCart() {
    const selectedVariant = this.getSelectedVariant(this.product.masterData.current);
    const key = selectedVariant.key;
    if (key) {
      const isInCart = await this.isProductInCart(key);
      if (isInCart) {
        await sdk.removeProductInCart(selectedVariant);
        await this.updateCartButtons();
      }
    }
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
      this.addToCartButton,
      this.removeFromCartButton,
      this.composeProductYear(selectedVariant),
      this.composeProductDescription(),
      // Only Vinyl has tracks
      this.isProductTypeVinyl() ? this.composeTracksElement(selectedVariant) : null
    );
    const section = new Section({ classes: [CLASS_NAMES.product.productSection] });
    section.appendChildren(productImagesSliderContainer, productInfoContainer);
    this.element.replaceChildren(section.element);
    void this.updateCartButtons();
  }

  composeProductTitle(selectedVariant: ProductVariant): BaseElement {
    const attributeForTitle = this.isProductTypeVinyl() ? 'artist' : 'brand';
    const titleText = `${selectedVariant.attributes?.filter((item) => item.name === attributeForTitle)[0]?.value as string} 
      "${this.product.masterData.current.name?.en}"`;
    return new BaseElement({ tag: 'h2', classes: [CLASS_NAMES.product.productTitle], content: titleText });
  }

  composeProductPrice(selectedVariant: ProductVariant): BaseElement {
    const actualPriceBlock = new Paragraph(
      `${(selectedVariant.prices?.[0].value?.centAmount || 0) / 100} ${selectedVariant.prices?.[0].value?.currencyCode}`,
      [CLASS_NAMES.product.productPrice]
    );
    const productPriceBlock = new BaseElement({ classes: [CLASS_NAMES.product.productPrice] }, actualPriceBlock);

    const discountPriceCents = selectedVariant.prices?.[0].discounted?.value?.centAmount;
    if (discountPriceCents) {
      actualPriceBlock.addClass(CLASS_NAMES.product.withDiscount);
      const discountPriceBlock = new Paragraph(
        `${discountPriceCents / 100}  ${selectedVariant.prices?.[0].discounted?.value?.currencyCode}`,
        [CLASS_NAMES.product.discountPrice]
      );
      productPriceBlock.append(discountPriceBlock);
    }

    return productPriceBlock;
  }

  composeProductDescription(): BaseElement {
    const paragraphsForDescription: BaseElement[] = (
      this.product.masterData.current.description?.en?.split('\\n') || []
    ).map((paragraph) => new Paragraph(this.isProductTypePlayer() ? `• ${paragraph}` : paragraph));
    const section = new BaseElement({ classes: [CLASS_NAMES.product.productDescription] });
    section.appendChildren(...paragraphsForDescription);
    return section;
  }

  composeProductYear(selectedVariant: ProductVariant): BaseElement {
    const yearLabel = this.isProductTypeVinyl() ? 'Year of release' : 'Year';
    return new Paragraph(
      `${yearLabel}: ${selectedVariant.attributes?.filter((item) => item.name === 'year')[0]?.value as string}`,
      [CLASS_NAMES.product.productYear]
    );
  }

  composeProductImagesSlider(selectedVariant: ProductVariant): BaseElement {
    const gallery = new Gallery(selectedVariant.images?.map((image) => image.url) || []);
    return gallery;
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
  }

  composeSelectVariantForm(): Select {
    const selectBlock = new Select({
      classes: [CLASS_NAMES.product.selectVariantFormDropdown],
      name: 'select-variant',
    });
    selectBlock.addListener('change', () => this.spawnSection());

    const mainOption = new Option('Color: black', this.product.masterData.current.masterVariant.sku);
    const extraOptions = this.product.masterData.current.variants.map(
      (variant) =>
        new Option(`Color: ${variant.attributes?.filter((item) => item.name === 'color')[0]?.value}`, variant.sku)
    );
    selectBlock.appendChildren(mainOption, ...extraOptions);
    return selectBlock;
  }

  composeAddToCartButton(): BaseElement {
    const button = new Button({ classes: [CLASS_NAMES.product.addToCartButton], content: 'Add to Cart' });
    button.addListener('click', () => void this.addToCart());
    return button;
  }

  composeRemoveFromCartButton(): BaseElement {
    const button = new Button({ classes: [CLASS_NAMES.product.removeFromCartButton], content: 'Remove from Cart' });
    button.addListener('click', () => void this.removeFromCart());
    return button;
  }
}
