import { CLASS_NAMES } from '../types_variables/variables';
import BaseElement from './basic_element';
import Paragraph from './paragraph';
import ghLogo from '../../assets/gh_logo.png';

export default class GHLink extends BaseElement<HTMLAnchorElement> {
  constructor(name: string, href: string) {
    super(
      { tag: 'a', classes: [CLASS_NAMES.ghLink.link], href, target: '_blank' },
      new BaseElement<HTMLImageElement>({
        tag: 'img',
        src: ghLogo as string,
        classes: [CLASS_NAMES.ghLink.icon],
      }),
      new Paragraph(name, [CLASS_NAMES.ghLink.text, CLASS_NAMES.link])
    );
  }
}
