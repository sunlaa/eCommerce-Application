import './slider.sass';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';

export default class Slider extends BaseElement {
  frame = new BaseElement({ classes: [CLASS_NAMES.main.sliderFrame] });

  line = new BaseElement({ classes: [CLASS_NAMES.main.sliderLine] });

  lArrow = new BaseElement({ classes: [CLASS_NAMES.main.lArrow], content: '❮' });
  rArrow = new BaseElement({ classes: [CLASS_NAMES.main.rArrow], content: '❯' });

  slideItems: BaseElement[] = [];

  currentSlide: BaseElement;
  count = 0;
  intervalID: ReturnType<typeof setInterval> | null = null;

  constructor(items: BaseElement[]) {
    super({ classes: [CLASS_NAMES.main.slider] });

    this.appendChildren(this.lArrow, this.frame, this.rArrow);

    this.frame.append(this.line);

    this.fillSlider(items);

    this.currentSlide = this.slideItems[0];

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
    this.slideItems = items.map((elem) => new BaseElement({ classes: [CLASS_NAMES.main.sliderItem] }, elem));
    this.line.appendChildren(...this.slideItems);
  }

  autoFlip = () => {
    this.intervalID = setInterval(() => {
      this.nextSlide();
    }, NUMERIC_DATA.sliderFlipInterval);
  };

  nextSlide = () => {
    this.count++;

    if (this.count >= this.slideItems.length) {
      this.count = 0;
    }

    this.line.setStyles({ transform: `translateX(-${100 * this.count}%)` });
  };

  prevSlide = () => {
    this.count--;

    if (this.count < 0) {
      this.count = this.slideItems.length - 1;
    }

    this.line.setStyles({ transform: `translateX(-${100 * this.count}%)` });
  };
}
