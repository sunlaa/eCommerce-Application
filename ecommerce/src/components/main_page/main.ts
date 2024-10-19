import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Hero from './hero_container/hero';
import SliderSection from './slider/slider_section';

export default class MainPage extends BaseElement {
  constructor() {
    super({ tag: 'section', classes: [CLASS_NAMES.main.mainPage] }, new Hero(), new SliderSection());
  }
}
