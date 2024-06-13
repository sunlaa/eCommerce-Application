import './slider.sass';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Slider extends BaseElement {
  frame = new BaseElement({ classes: [CLASS_NAMES.main.sliderFrame] });

  line = new BaseElement({ classes: [CLASS_NAMES.main.sliderLine] });

  lArrow = new BaseElement({ classes: [CLASS_NAMES.main.lArrow], content: '❮' });
  rArrow = new BaseElement({ classes: [CLASS_NAMES.main.rArrow], content: '❯' });

  items: BaseElement[];
  constructor(items: BaseElement[]) {
    super({ classes: [CLASS_NAMES.main.slider] });

    this.appendChildren(this.lArrow, this.frame, this.rArrow);

    this.frame.append(this.line);
    this.line.appendChildren(...items);

    this.items = items;
  }
}
