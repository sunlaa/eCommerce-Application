import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import rsLogo from '../../assets/rs_logo.svg';

export default class RSLogo extends BaseElement<HTMLAnchorElement> {
  constructor() {
    super(
      { tag: 'a', href: 'https://rs.school', target: '_blank', classes: [CLASS_NAMES.rsLogo.rsLink] },
      new BaseElement<HTMLImageElement>({ tag: 'img', src: rsLogo as string, classes: [CLASS_NAMES.rsLogo.rsImage] })
    );
  }
}
