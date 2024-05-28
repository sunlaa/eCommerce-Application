import './hero.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class Hero extends BaseElement {
  constructor() {
    super(
      { classes: [CLASS_NAMES.main.heroContainer] },
      new BaseElement({ classes: [CLASS_NAMES.main.heroOverlay] }),
      new BaseElement(
        { classes: [CLASS_NAMES.main.aboutContainer] },
        new BaseElement({ tag: 'h2', content: 'Welcome!', classes: [CLASS_NAMES.main.title] }),
        new Paragraph(TEXT_CONTENT.mainTextAbout, [CLASS_NAMES.main.aboutText])
      ),
      new BaseElement(
        { classes: [CLASS_NAMES.main.authBtnContainer] },
        new Anchor({ href: 'login', content: 'Log in', classes: [CLASS_NAMES.link, CLASS_NAMES.main.authButton] }),
        new Anchor({
          href: 'registration',
          content: 'Sign up',
          classes: [CLASS_NAMES.link, CLASS_NAMES.main.authButton],
        }),
        // временно
        new Anchor({ href: 'product', content: 'Product' })
      )
    );
  }
}
