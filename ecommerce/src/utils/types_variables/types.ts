export type Params<T extends HTMLElement = HTMLElement> = Partial<Omit<T, 'tagName' | 'className'>> & {
  tag?: keyof HTMLElementTagNameMap;
  content?: string;
  classes?: string[];
  styles?: Partial<CSSStyleDeclaration>;
};

export type ParamsOmitTag<T extends HTMLElement = HTMLElement> = Omit<Params<T>, 'tag'>;

export type RequiredParamsForAnchor = Required<Pick<HTMLAnchorElement, 'href'>> & ParamsOmitTag<HTMLAnchorElement>;

export type AllFormInputs = (HTMLInputElement | HTMLSelectElement)[];

export type Routes = {
  path: string;
  callback: () => void;
};

export type AddresessProps = {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
};
