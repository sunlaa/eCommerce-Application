import './header.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Logout from './logout/logout';

export default class Header extends BaseElement {
  navButtonsCont: BaseElement = new BaseElement({
    classes: [CLASS_NAMES.header.navButtonsCont],
    // Remove this
    styles: { display: 'flex', justifyContent: 'space-around', gap: '30px' },
  });

  constructor() {
    super(
      {
        tag: 'header',
        classes: [CLASS_NAMES.header.headerContainer],
      },
      new Anchor({
        href: '#main',
        content: 'Echoes of vinyl',
        classes: [CLASS_NAMES.link, CLASS_NAMES.header.toMainLink],
      })
    );

    this.append(this.navButtonsCont);
  }

  switchToUnauthorized() {
    const login = new Anchor({
      href: '#login',
      content: 'Log in',
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.login],
    });

    const reg = new Anchor({
      href: '#registration',
      content: 'Sign up',
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.reg],
    });

    this.navButtonsCont.removeChildren();
    this.navButtonsCont.appendChildren(login, reg);

    return this.element;
  }

  switchToAuthorized() {
    const logout = new Logout();
    this.navButtonsCont.removeChildren();
    this.navButtonsCont.append(logout);

    return this.element;
  }
}
