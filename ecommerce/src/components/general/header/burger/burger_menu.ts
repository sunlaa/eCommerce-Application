import './burger_menu.sass';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class BurgerMenu extends BaseElement {
  burgerBtn: BaseElement = new BaseElement({ classes: [CLASS_NAMES.header.burgerBtn] });
  navCont: BaseElement;

  constructor(navCont: BaseElement) {
    super({
      classes: [CLASS_NAMES.header.burgerWrapper],
    });

    this.navCont = navCont;
  }

  burgerEngine(nav: BaseElement) {
    this.reset();
    this.navCont = nav;

    this.append(this.burgerBtn);
    this.addListener('click', this.toogle);

    this.navCont.getChildren().forEach((element) => {
      element.addEventListener('click', this.close);
    });

    document.body.addEventListener('click', this.closeIfOut);
  }

  reset() {
    this.removeListener('click', this.toogle);
    this.navCont.getChildren().forEach((element) => {
      element.removeEventListener('click', this.close);
    });
    document.body.removeEventListener('click', this.closeIfOut);
    this.removeChildren();
  }

  toogle = () => {
    this.burgerBtn.element.classList.toggle(CLASS_NAMES.header.burgerBtnOpen);
    this.navCont.element.classList.toggle(CLASS_NAMES.header.burgerBtnOpen);
  };

  close = () => {
    this.burgerBtn.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
    this.navCont.element.classList.remove(CLASS_NAMES.header.burgerBtnOpen);
  };

  closeIfOut = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!this.element.contains(target)) {
      this.close();
    }
  };
}
