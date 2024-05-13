import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Header extends BaseElement {
  constructor() {
    super(
      { tag: 'header', classes: [CLASS_NAMES.headerContainer] },
      new Anchor({ href: '#main', content: 'Echoes of vinyl', classes: [CLASS_NAMES.link, CLASS_NAMES.toMainLink] })
    );
  }
}
