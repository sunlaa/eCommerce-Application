import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import CatalogPage from '@/components/catalog_product_page/catalog_page';
import MainPage from '@/components/main_page/main';
import ProductPageEngine from '@/components/product_page/product_page_engine';
import ProfilePage from '@/components/profile_page/profile_page_ui';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import Router from '@/utils/services/routing';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { PathParams, Routes } from '@/utils/types_variables/types';

export const container = new BaseElement({ tag: 'main', classes: [CLASS_NAMES.mainContainer] });

export default class App {
  router: Router;

  catalog: CatalogPage = new CatalogPage();

  constructor() {
    this.router = new Router(this.createRoutes());

    document.body.append(container.element);
  }

  run() {}

  createRoutes(): Routes[] {
    return [
      {
        path: '',
        callback: () => {
          smoothTransitionTo(new MainPage());
        },
      },
      {
        path: 'main',
        callback: () => {
          smoothTransitionTo(new MainPage());
        },
      },
      {
        path: 'registration',
        callback: () => {
          smoothTransitionTo(new RegFormEngine().regFormEngineStart());
        },
      },
      {
        path: 'login',
        callback: () => {
          smoothTransitionTo(new LoginFormEngine().loginFormEngineStart());
        },
      },
      {
        path: 'catalog',
        callback: () => {
          container.element.innerHTML = '';
          container.append(this.catalog);
          // add smoothTransition for "catalog" button
          this.catalog.catalogHeader.smoothAppearing();
        },
      },
      {
        path: 'catalog/{category}',
        callback: (path?: PathParams) => {
          container.element.innerHTML = '';
          container.append(this.catalog);
          if (path?.category) {
            this.catalog.catalogHeader.smoothAppearing(path.category);
          }
        },
      },
      {
        path: 'profile',
        callback: () => {
          smoothTransitionTo(new ProfilePage());
        },
      },
      {
        path: 'catalog/{category}/{product}',
        callback: (path?: PathParams) => {
          const productSku = path?.product;
          if (!productSku) {
            throw new Error('Product not found');
          }
          void sdk.getProductByKey(productSku).then((product) => {
            console.log(product);
            if (!product) {
              throw new Error('Product not found');
            }
            void sdk.getProductTypeById(product.productType.id).then((productType) => {
              smoothTransitionTo(new ProductPageEngine(product, productType).productPageEngineStart());
            });
          });
        },
      },
    ];
  }
}
