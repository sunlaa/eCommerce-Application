import BaseElement from '../elements/basic_element';
import { NUMERIC_DATA } from '../types_variables/variables';

export default function smoothAppearing(container: BaseElement, ...elements: BaseElement[]) {
  elements.forEach((tile) => tile.setStyles({ opacity: '0' }));
  elements.forEach((tile) => {
    container.append(tile);
    setTimeout(() => {
      tile.setStyles({ opacity: '1' });
    }, NUMERIC_DATA.animationDuration);
  });
}
