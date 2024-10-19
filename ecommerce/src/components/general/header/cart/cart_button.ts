import './cart.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import cart from '../../../../assets/cart.png';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Paragraph from '@/utils/elements/paragraph';

export default class CartButton extends Anchor {
  counter = new Paragraph('', [CLASS_NAMES.header.counterText]);

  counterContainer: BaseElement = new BaseElement({ classes: [CLASS_NAMES.header.cartCounter, 'hide'] });

  constructor() {
    super(
      { href: '/cart', classes: [CLASS_NAMES.header.button, CLASS_NAMES.header.cart] },
      new BaseElement<HTMLImageElement>({ tag: 'img', src: cart as string, width: 30 })
    );

    this.counterContainer.append(this.counter);

    this.append(this.counterContainer);
  }

  changeCounter(count: number) {
    if (count === 0) {
      this.counterContainer.addClass('hide');
      return;
    }
    this.counterContainer.removeClass('hide');
    this.counter.content = `${count}`;
  }
}
