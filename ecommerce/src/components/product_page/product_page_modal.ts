import BaseElement from '@/utils/elements/basic_element';
import Button from '@/utils/elements/button';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export class Modal extends BaseElement {
  private closeButton: Button;
  private imageSlider: BaseElement;
  private images: string[];
  private currentIndex: number;

  constructor(images: string[], currentIndex: number = 0) {
    super({ classes: [CLASS_NAMES.modal.modal] });
    this.images = images;
    this.currentIndex = currentIndex;

    this.closeButton = new Button({ classes: [CLASS_NAMES.modal.closeButton], content: '✕' });
    this.closeButton.addListener('click', () => this.close());

    this.imageSlider = new BaseElement({ classes: [CLASS_NAMES.modal.imageSlider] });

    this.appendChildren(this.imageSlider, this.closeButton, this.createNavigationButtons());
    this.updateSlider();
  }

  open() {
    document.body.appendChild(this.element);
    document.body.classList.add(CLASS_NAMES.modal.open);
  }

  close() {
    document.body.removeChild(this.element);
    document.body.classList.remove(CLASS_NAMES.modal.open);
  }

  createNavigationButtons(): BaseElement {
    const navigationContainer = new BaseElement({ classes: [CLASS_NAMES.modal.navigationContainer] });

    const prevButton = new Button({ classes: [CLASS_NAMES.modal.prevButton], content: '❮' });
    prevButton.addListener('click', () => this.showPreviousImage());

    const nextButton = new Button({ classes: [CLASS_NAMES.modal.nextButton], content: '❯' });
    nextButton.addListener('click', () => this.showNextImage());

    navigationContainer.appendChildren(prevButton, nextButton);
    return navigationContainer;
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
