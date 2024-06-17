import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';

export default class Slider extends BaseElement {
  frame = new BaseElement({ classes: [CLASS_NAMES.slider.sliderFrame] });

  line = new BaseElement({ classes: [CLASS_NAMES.slider.sliderLine] });

  lArrow = new BaseElement({ classes: [CLASS_NAMES.slider.lArrow], content: '❮' });
  rArrow = new BaseElement({ classes: [CLASS_NAMES.slider.rArrow], content: '❯' });

  slideItems: BaseElement[] = [];

  readonly totalCount: number;
  count = 0;
  intervalID: ReturnType<typeof setInterval> | null = null;

  constructor(items: BaseElement[]) {
    super({ classes: [CLASS_NAMES.slider.slider] });

    this.totalCount = items.length;

    this.appendChildren(this.lArrow, this.frame, this.rArrow);

    this.frame.append(this.line);

    this.fillSlider(items);

    this.rArrow.addListener('click', () => {
      if (this.intervalID) clearInterval(this.intervalID);
      this.nextSlide();
      this.autoFlip();
    });

    this.lArrow.addListener('click', () => {
      if (this.intervalID) clearInterval(this.intervalID);
      this.prevSlide();
      this.autoFlip();
    });

    this.autoFlip();
  }

  fillSlider(items: BaseElement[]) {
    this.slideItems = items.map((elem) => new BaseElement({ classes: [CLASS_NAMES.slider.sliderItem] }, elem));
    this.line.appendChildren(...this.slideItems);
  }

  autoFlip = () => {
    this.intervalID = setInterval(() => {
      this.nextSlide();
    }, NUMERIC_DATA.sliderFlipInterval);
  };

  goTo(slide: number) {
    this.count = slide;
    this.line.setStyles({ transform: `translateX(-${100 * this.count}%)` });
    this.notifyCountChange();
  }

  nextSlide = () => {
    this.count++;

    if (this.count >= this.slideItems.length) {
      this.count = 0;
    }

    this.goTo(this.count);
  };

  prevSlide = () => {
    this.count--;

    if (this.count < 0) {
      this.count = this.slideItems.length - 1;
    }

    this.goTo(this.count);
  };

  notifyCountChange = () => {
    const event = new CustomEvent('count-change', { detail: this.count });
    this.element.dispatchEvent(event);
  };
}
