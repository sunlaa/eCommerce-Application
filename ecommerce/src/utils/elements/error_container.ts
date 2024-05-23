import { NUMERIC_DATA } from '../types_variables/variables';
import Paragraph from './paragraph';

export default class ErrorContainer extends Paragraph {
  constructor(classes: string[]) {
    super('', classes);
  }

  showMessage = (text: string) => {
    if (text === this.content) return;
    this.hideMessage();

    setTimeout(() => {
      this.content = text;
      this.setStyles({ opacity: '1' });
    }, NUMERIC_DATA.animationDuration);
  };

  hideMessage = () => {
    // The error container must have the property "transition" with duration from the NUMERIC_DATA.animationDuration ms
    this.setStyles({ opacity: '0' });

    setTimeout(() => {
      this.content = '';
    }, NUMERIC_DATA.animationDuration);
  };
}
