import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Slider from '../../../utils/elements/slider';

export default class SliderTurns extends BaseElement {
  slider: Slider;

  turnsCount: number;

  turns: BaseElement[];

  constructor(slider: Slider, miniature?: BaseElement[]) {
    super({ classes: [CLASS_NAMES.slider.sliderTurns] });

    this.slider = slider;
    this.turnsCount = slider.totalCount;

    this.turns = miniature || this.createTurns();

    this.addClickListener();

    this.appendChildren(...this.turns);
    this.slider.addListener('count-change', this.slideChange);
  }

  createTurns() {
    const defaultTurns: BaseElement[] = [];
    for (let i = 0; i < this.turnsCount; i++) {
      const turn = new BaseElement({ classes: [CLASS_NAMES.slider.sliderTurn] });

      defaultTurns.push(turn);
    }

    return defaultTurns;
  }

  addClickListener() {
    this.turns.forEach((turn, i) => {
      if (i === 0) turn.addClass('active');

      turn.addListener('click', () => {
        if (this.slider.intervalID) clearInterval(this.slider.intervalID);
        this.slider.goTo(i);
        this.slider.autoFlip();
      });
    });
  }

  slideChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    const currentSlide = customEvent.detail as number;

    this.turns.forEach((turn) => turn.removeClass('active'));
    this.turns[currentSlide].addClass('active');
  };
}
