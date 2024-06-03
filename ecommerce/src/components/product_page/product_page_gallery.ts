import BaseElement from '@/utils/elements/basic_element';
import Button from '@/utils/elements/button';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { Modal } from './product_page_modal';

export class Gallery extends BaseElement {
  private imageSlider: BaseElement;
  private images: string[];
  private currentIndex: number;

  constructor(images: string[]) {
    super({ classes: [CLASS_NAMES.product.productImgContainer] });
    this.images = images;
    this.currentIndex = 0;

    this.imageSlider = new BaseElement({ classes: [CLASS_NAMES.product.productImgSliderContainer] });
    this.imageSlider.addListener('click', () => {
      new Modal(images, this.currentIndex).open();
    });

    this.appendChildren(this.imageSlider, ...this.createNavigationButtons(), this.composeSmallImagesBlock());
    this.updateSlider();
  }

  composeSmallImagesBlock(): BaseElement {
    const allImages = new BaseElement({ classes: [CLASS_NAMES.product.productAllImg] });
    this.images.forEach((image) => {
      const productImg = document.createElement('img');
      productImg.src = image;
      productImg.classList.add(CLASS_NAMES.product.productSmallImg);
      productImg.addEventListener('click', () => {
        this.currentIndex = this.images.indexOf(image);
        this.updateSlider();
      });
      const smallImageContainer = new BaseElement({ classes: [CLASS_NAMES.product.productSmallImgContainer] });
      smallImageContainer.appendChildren(productImg);
      allImages.append(smallImageContainer);
    });
    return allImages;
  }

  createNavigationButtons(): BaseElement[] {
    const prevButton = new Button({ classes: [CLASS_NAMES.product.productImgSliderButtonPrev], content: '❮' });
    prevButton.addListener('click', (e) => {
      e.stopPropagation();
      this.showPreviousImage();
    });
    const nextButton = new Button({ classes: [CLASS_NAMES.product.productImgSliderButtonNext], content: '❯' });
    nextButton.addListener('click', (e) => {
      e.stopPropagation();
      this.showNextImage();
    });
    return [prevButton, nextButton];
  }

  showPreviousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSlider();
  }

  showNextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSlider();
  }

  updateSlider() {
    this.imageSlider.element.style.backgroundImage = `url(${this.images[this.currentIndex]})`;
  }
}
