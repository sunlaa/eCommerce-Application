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

  createLink = (name: string) => {
    const element = new BaseElement({ styles: { display: 'inline' }, content: name });
    return element;
  };
}
