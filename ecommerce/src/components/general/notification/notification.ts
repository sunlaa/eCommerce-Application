import './notification.sass';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';

export class Notificaton extends BaseElement {
  title: BaseElement = new BaseElement({ tag: 'h3', classes: [CLASS_NAMES.notification.title] });
  text: Paragraph = new Paragraph('', [CLASS_NAMES.notification.text]);

  constructor() {
    super({ classes: [CLASS_NAMES.notification.container] });
    this.appendChildren(this.title, this.text);
  }

  hide = () => {
    this.setStyles({ opacity: '0' });
    setTimeout(() => {
      this.remove();
      this.setStyles({ opacity: '1' });
    }, NUMERIC_DATA.animationDuration);
  };

  show(text: string) {
    this.text.content = text;
    document.body.append(this.element);
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  showSuccess(text: string) {
    this.addClass('success');
    this.title.content = 'Success!';
    this.show(text);
  }

  showError(text: string) {
    this.addClass('error');
    this.title.content = 'Something wrong!';
    this.show(text);
  }
}

export const notification = new Notificaton();
