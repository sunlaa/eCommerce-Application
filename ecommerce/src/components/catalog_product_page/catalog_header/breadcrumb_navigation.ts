import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Breadcrumb extends BaseElement {
  separator = new BaseElement({ tag: 'span', content: ' / ' });

  constructor() {
    super(
      { tag: 'p', classes: [CLASS_NAMES.catalog.breadcrumb] },
      new Anchor({ href: 'catalog', content: 'All products' })
    );
  }

  addLink(name: string) {
    const separator = this.separator.element.cloneNode(true) as HTMLElement;
    this.appendChildren(separator, new BaseElement({ styles: { display: 'inline' }, content: name }));
  }
}
