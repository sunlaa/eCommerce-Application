import './not_found.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class Page404 extends BaseElement {
  constructor() {
    super(
      { tag: 'section', classes: [CLASS_NAMES.errorPage.errorPage] },
      new BaseElement<HTMLImageElement>({
        tag: 'img',
        src: 'https://media.tenor.com/DXVOKl5BW-oAAAAi/emoji-looking-surprised-at-computer.gif',
        alt: 'Shoked computer smile',
        classes: [CLASS_NAMES.errorPage.errorImage],
      }),
      new BaseElement(
        { classes: [CLASS_NAMES.errorPage.errorTextContainer] },
        new BaseElement({ tag: 'h2', content: '404 Error', classes: [CLASS_NAMES.errorPage.errorTitle] }),
        new Paragraph(TEXT_CONTENT.errorText, [CLASS_NAMES.errorPage.errorText])
      ),

      new Anchor({ href: '#main', content: 'Back to home', classes: [CLASS_NAMES.errorPage.goHomeBtn] })
    );
  }
}
