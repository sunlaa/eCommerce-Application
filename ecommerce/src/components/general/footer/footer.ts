import { CLASS_NAMES } from '@/utils/types_variables/variables';
import './footer.sass';
import BaseElement from '@/utils/elements/basic_element';
import { FooterLinkInfo } from '@/utils/types_variables/types';
import Anchor from '@/utils/elements/anchor';
import GHLink from '@/utils/elements/gh_link';
import copyright from '../../../assets/copyright.png';
import Paragraph from '@/utils/elements/paragraph';
import RSLogo from '../rs_logo';

const contacts: FooterLinkInfo[] = [
  {
    name: 'About Us',
    href: '/about',
  },
];

const products: FooterLinkInfo[] = [
  {
    name: 'Vinyl Records',
    href: '/catalog/vinyl-records',
  },
  {
    name: 'Record Players',
    href: 'catalog/record-players',
  },
];

const team: FooterLinkInfo[] = [
  { name: 'sunlaa', href: 'https://github.com/sunlaa' },
  { name: 'katyastan', href: 'https://github.com/katyastan' },
  { name: 'PaHaNchickT', href: 'https://github.com/PaHaNchickT' },
];

export default class Footer extends BaseElement {
  linksContainer: BaseElement;

  constructor() {
    super({ tag: 'footer', classes: [CLASS_NAMES.footer.footerContainer] });
    const logo = new RSLogo();

    this.linksContainer = new BaseElement({ classes: [CLASS_NAMES.footer.linksContainer] });

    this.fillSection('Contacts:', contacts);
    this.fillSection('Products:', products);
    this.fillSection('404 Team:', team);

    this.appendChildren(
      logo,
      this.linksContainer,
      new BaseElement(
        { classes: [CLASS_NAMES.footer.copyrightContainer] },
        new BaseElement(
          { classes: [CLASS_NAMES.footer.copyright] },
          new BaseElement<HTMLImageElement>({
            tag: 'img',
            src: copyright as string,
            classes: [CLASS_NAMES.footer.copyrightIcon],
          }),
          new Paragraph('2024 "404 Team"')
        )
      )
    );
  }

  fillSection(sectionName: string, data: FooterLinkInfo[]) {
    const container = new BaseElement(
      { classes: [CLASS_NAMES.footer.section] },
      new BaseElement({ tag: 'h3', classes: [CLASS_NAMES.footer.sectionTitle], content: sectionName })
    );
    data.forEach((info) => {
      let link: BaseElement;
      if (sectionName === '404 Team:') {
        link = new GHLink(info.name, info.href);
      } else {
        link = new Anchor({
          classes: [CLASS_NAMES.footer.sectionLink, CLASS_NAMES.link],
          href: info.href,
          content: info.name,
        });
      }
      container.append(link);
    });

    this.linksContainer.append(container);
  }
}
