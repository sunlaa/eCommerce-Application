import './burger_menu.sass';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class BurgerMenu extends BaseElement {
  burgerBtn: BaseElement = new BaseElement({ classes: [CLASS_NAMES.header.burgerBtn] });

  constructor() {
    super({
      classes: [CLASS_NAMES.header.burgerWrapper],
    });
  }

  burgerEngine(navCont: BaseElement) {
    this.append(this.burgerBtn);
    this.addListener('click', () => {
      this.burgerBtn.element.classList.toggle(CLASS_NAMES.header.burgerBtnOpen);
      navCont.element.classList.toggle(CLASS_NAMES.header.burgerBtnOpen);
    });

    new Array(...navCont.element.children).forEach((element) => {
      element.addEventListener('click', () => {
        this.burgerBtn.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
        navCont.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
      });
    });

    document.body.addEventListener('click', (event) => {
      const element = event.target as HTMLElement;
      if (!element || !element.parentElement) return;

      const isBurgerBtn = element.classList.contains(CLASS_NAMES.header.burgerBtn);
      const isBurgerCont = element.classList.contains(CLASS_NAMES.header.burgerWrapper);
      const isNavCont = element.classList.contains(CLASS_NAMES.header.navButtonsCont);
      const isNavContParent = element.parentElement.classList.contains(CLASS_NAMES.header.navButtonsCont);

      if (!(isBurgerBtn || isBurgerCont || isNavCont || isNavContParent)) {
        this.burgerBtn.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
        navCont.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
      }
    });
  }
}
