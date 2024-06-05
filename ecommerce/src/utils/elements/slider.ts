import { ParamsOmitTag } from '../types_variables/types';
import { CLASS_NAMES } from '../types_variables/variables';
import BaseElement from './basic_element';
import Button from './button';

export default class Slider extends BaseElement {
  sources: string[];
  slideFrame: BaseElement;

  constructor(params: ParamsOmitTag, sources: string[]) {
    super({ tag: 'div', classes: [CLASS_NAMES.slider.sliderContainer], ...params });

    this.sources = sources;

    this.slideFrame = new BaseElement({ classes: [CLASS_NAMES.slider.frame] });
    const larrow = new Button({ classes: [CLASS_NAMES.slider.larrow], content: '❮' });
    const rarrow = new Button({ classes: [CLASS_NAMES.slider.rarrow], content: '❯' });
    this.slideFrame.appendChildren(larrow, rarrow);

    this.createTrack();
    this.appendChildren(larrow, this.slideFrame, rarrow);
  }

  createTrack() {
    const track = new BaseElement({ classes: [CLASS_NAMES.slider.track] });
    this.sources.forEach((src) => {
      const slide = new BaseElement(
        { classes: [CLASS_NAMES.slider.slide] },
        new BaseElement<HTMLImageElement>({ tag: 'img', src, classes: [CLASS_NAMES.slider.image] })
      );
      track.append(slide);
    });
    this.slideFrame.append(track);
  }
}
