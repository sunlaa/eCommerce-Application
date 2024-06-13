import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export const cartEmptyCont = new BaseElement(
  { classes: [CLASS_NAMES.cart.cartEmptyCont] },
  new BaseElement({ tag: 'h3', content: TEXT_CONTENT.cartEmptyMessage }),
  new Anchor({
    href: '/catalog',
    content: TEXT_CONTENT.cartEmptyBtn,
    // classes: [CLASS_NAMES.link, CLASS_NAMES.header.catalog],
  })
);
