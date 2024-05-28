import './header.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import Logout from './logout/logout';

export default class Header extends BaseElement {
  navButtonsCont: BaseElement = new BaseElement({
    tag: 'nav',
    classes: [CLASS_NAMES.header.navButtonsCont],
  });

  navCatalogBtn: Anchor = new Anchor({
    href: 'catalog',
    content: TEXT_CONTENT.header.catalog,
    classes: [CLASS_NAMES.link, CLASS_NAMES.header.catalog],
  });

  isAtuh: boolean = false;

  constructor() {
    super(
      {
        tag: 'header',
        classes: [CLASS_NAMES.header.headerContainer],
      },
      new Anchor({
        href: '/main',
        content: 'Echoes of vinyl',
        classes: [CLASS_NAMES.link, CLASS_NAMES.header.toMainLink],
      })
    );

    this.append(this.navButtonsCont);
  }

  switchToUnauthorized() {
    const login = new Anchor({
      href: '/login',
      content: TEXT_CONTENT.header.login,
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.login],
    });

    const reg = new Anchor({
      href: 'registration',
      content: TEXT_CONTENT.header.reg,
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.reg],
    });

    this.navButtonsCont.removeChildren();
    this.navButtonsCont.appendChildren(this.navCatalogBtn, login, reg);
    this.isAtuh = false;

    return this.element;
  }

  switchToAuthorized() {
    const logout = new Logout();

    const profileBtn = new Anchor({
      href: 'profile',
      content: TEXT_CONTENT.header.profile,
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.profile],
    });

    this.navButtonsCont.removeChildren();
    this.navButtonsCont.appendChildren(this.navCatalogBtn, profileBtn, logout);
    this.isAtuh = true;

    return this.element;
  }
}
