import { container } from '@/app/app';
import BaseElement from '../elements/basic_element';
import { NUMERIC_DATA } from '../types_variables/variables';

export default function smoothTransitionTo(page: BaseElement | HTMLElement) {
  let element: HTMLElement;
  if (page instanceof BaseElement) {
    element = page.element;
  } else {
    element = page;
  }

  container.setStyles({ opacity: '0' });

  setTimeout(() => {
    container.removeChildren();
    container.append(element);
    container.setStyles({ opacity: '1' });
  }, NUMERIC_DATA.animationDuration);
}
