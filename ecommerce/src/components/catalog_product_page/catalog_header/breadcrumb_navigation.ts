import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

type Path = {
  name: string;
  link: BaseElement;
};

export default class Breadcrumb extends BaseElement {
  currentPath: Path[] = [];

  separator = new BaseElement({ tag: 'span', content: ' / ' });

  constructor() {
    super(
      { tag: 'p', classes: [CLASS_NAMES.catalog.breadcrumb] },
      new Anchor({ href: 'catalog', content: 'All products' })
    );
  }

  addLink(name: string) {
    const separator = this.separator.element.cloneNode(true) as HTMLElement;
    const link = this.createLink(name);
    this.currentPath.push({ name, link });
    this.appendChildren(separator, link);
  }

  removeAfter(name: string) {
    let index = NaN;
    this.currentPath.forEach((path, i) => {
      if (!isNaN(index)) {
        console.log('here');
        const link = path.link.element;
        const separator = link.previousElementSibling as HTMLElement;
        link.remove();
        separator.remove();
      }
      path.name === name ? (index = i) : null;
      console.log(path.name, name, index);
    });
    // this.currentPath = this.currentPath.slice(0, index);
  }

  createLink = (name: string) => {
    const element = new BaseElement({ styles: { display: 'inline' }, content: name });
    element.addListener('click', () => {
      this.removeAfter(name);
    });
    return element;
  };
}
