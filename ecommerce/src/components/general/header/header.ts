import './header.sass';
import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import Logout from './logout/logout';
import BurgerMenu from './burger/burger_menu';
import CartButton from './cart/cart_button';

export default class Header extends BaseElement {
  navButtonsCont: BaseElement = new BaseElement({
    tag: 'nav',
    classes: [CLASS_NAMES.header.navButtonsCont],
  });

  mainLinksContainer = new BaseElement(
    { classes: [CLASS_NAMES.header.mainLinksContainer] },
    new Anchor({
      href: '/catalog',
      content: TEXT_CONTENT.header.catalog,
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.catalog, CLASS_NAMES.header.link],
    }),
    new Anchor({
      href: '/about',
      content: TEXT_CONTENT.header.about,
      classes: [CLASS_NAMES.link, CLASS_NAMES.header.about, CLASS_NAMES.header.link],
    })
  );

  personalLinksContainer = new BaseElement({ classes: [CLASS_NAMES.header.personalLinksContainer] });

  cart = new CartButton();

  burgerCont: BurgerMenu;

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
        classes: [CLASS_NAMES.header.toMainLink],
      })
    );

    this.navButtonsCont.appendChildren(this.mainLinksContainer, this.personalLinksContainer);

    this.burgerCont = new BurgerMenu(this.navButtonsCont);
    this.appendChildren(this.navButtonsCont, this.burgerCont);
  }

  fillBaseButtons() {}

  switchToUnauthorized() {
    const login = new Anchor({
      href: '/login',
      content: TEXT_CONTENT.header.login,
      classes: [CLASS_NAMES.header.button, CLASS_NAMES.header.login],
    });

    const reg = new Anchor({
      href: '/registration',
      content: TEXT_CONTENT.header.reg,
      classes: [CLASS_NAMES.header.button, CLASS_NAMES.header.reg],
    });

    this.personalLinksContainer.removeChildren();
    this.personalLinksContainer.appendChildren(login, reg, this.cart);
    this.isAtuh = false;

    this.burgerCont.burgerEngine(this.navButtonsCont);
    return this.element;
  }

  switchToAuthorized() {
    const logout = new Logout();

    const profileBtn = new Anchor({
      href: '/profile',
      content: TEXT_CONTENT.header.profile,
      classes: [CLASS_NAMES.header.button, CLASS_NAMES.header.profile],
    });

    this.personalLinksContainer.removeChildren();
    this.personalLinksContainer.appendChildren(profileBtn, logout, this.cart);
    this.isAtuh = true;

    this.burgerCont.burgerEngine(this.navButtonsCont);
    return this.element;
  }
}
