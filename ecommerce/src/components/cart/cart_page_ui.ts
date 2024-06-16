import BaseElement from '@/utils/elements/basic_element';
import Button from '@/utils/elements/button';
import Paragraph from '@/utils/elements/paragraph';
import Section from '@/utils/elements/section';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import { CartPagedQueryResponse, DiscountCode } from '@commercetools/platform-sdk';
import CartEngine from './cart_page_engine';
import Anchor from '@/utils/elements/anchor';
import InputField from '@/utils/elements/input_field';
import { cartEmptyCont } from './cart_empty_container';

export default class CartPage extends Section {
  // profileContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] });
  totalAmount = new BaseElement({ tag: 'p', content: '00.00' });

  pageTitle = new BaseElement({ tag: 'h2', content: TEXT_CONTENT.cartTitle }).element;
  savingParagraph = new BaseElement(
    { tag: 'p', styles: { textDecoration: 'line-through' } } //debug
  );
  emptyCont = cartEmptyCont;

  cartListCont = new BaseElement({ tag: 'table', classes: [CLASS_NAMES.cart.cartListCont] });
  cartEngine = new CartEngine(this.cartListCont, this.totalAmount, this, this.savingParagraph);

  // paragraphFields: Paragraph[] = [];
  // errorConts: ErrorContainer[] = [];

  constructor() {
    super({ classes: [CLASS_NAMES.cart.cartPage] });

    void this.layoutRendering();
  }

  async layoutRendering() {
    await sdk.getAllCarts(); // необходимый вызов для корректной работы корзины
    const currentCart = ((await sdk.getAllCarts()) as CartPagedQueryResponse).results[0];

    // title and empty message creating
    this.element.append(this.pageTitle);

    if (!currentCart || !currentCart.lineItems.length) {
      this.append(this.emptyCont);
      return;
    }

    const lineItems = currentCart.lineItems;

    // promo info cont creating
    const promoInfo = new BaseElement({ classes: [CLASS_NAMES.cart.cartPromoInfoCont] });

    TEXT_CONTENT.cartPromoInfoMainTitle.forEach((title, titleIndex) => {
      promoInfo.append(
        new BaseElement(
          {},
          new BaseElement({ tag: 'h3', content: title }),
          new Paragraph(TEXT_CONTENT.cartPromoInfoSubTitle[titleIndex])
        )
      );
    });

    // main containers creating
    const cartMainCont = new BaseElement({ classes: [CLASS_NAMES.cart.cartMainCont], styles: { display: 'flex' } }); //debug
    const cartTotalCont = new BaseElement({ classes: [CLASS_NAMES.cart.cartTotalCont] });

    // tHead elements creating
    const cartTHead = new BaseElement({ tag: 'thead' });
    const cartTheadTr = new BaseElement({ tag: 'tr' });

    CLASS_NAMES.cart.cartListTHead.forEach((tdContent) => {
      cartTheadTr.append(new BaseElement({ tag: 'td', content: tdContent }));
    });

    cartTHead.append(cartTheadTr);

    // tBody elements creating
    const cartTBody = new BaseElement({ tag: 'tbody' });

    // lineCont elements creating
    lineItems.forEach((item) => {
      if (!item.variant.images || !item.variant.prices) return;

      const currentTr = new BaseElement({ tag: 'tr' });

      const variantAmountType = item.variant.prices[0].discounted || item.variant.prices[0];
      const variantAmount = variantAmountType.value.centAmount.toString();
      const variantFractionDigits = variantAmount.length - variantAmountType.value.fractionDigits;

      const productSKU = item.variant.sku as string;
      const productTotalPrice = item.totalPrice.centAmount.toString();
      const productFractionDigits = productTotalPrice.length - item.totalPrice.fractionDigits;

      const productCover = new Image(50, 50);
      productCover.src = item.variant.images[0].url;

      // name creating
      const albumInfo = new BaseElement({ tag: 'td' });
      const variantColor = productSKU.split(' - ').reverse()[0].split(' ').reverse()[0];

      if (variantColor === '(BLUE)' || variantColor === '(RED)') {
        albumInfo.appendChildren(
          new Paragraph(productSKU.split(' - ')[0]),
          new Paragraph(productSKU.split(' - ')[1].replace(variantColor, '').trim()),
          new Paragraph(variantColor)
        );
      } else {
        albumInfo.appendChildren(new Paragraph(productSKU.split(' - ')[0]), new Paragraph(productSKU.split(' - ')[1]));
      }

      // switcher creating

      const switchCont = new BaseElement({ styles: { display: 'flex' } }); //debug
      const switchMinus = new Button({ content: '-' });
      const switchQuantity = new BaseElement({ content: item.quantity.toString() });
      const switchPlus = new Button({ content: '+' });

      switchCont.setAttribute('data-product-id', item.productId);
      switchCont.setAttribute('data-variant-id', item.variant.id.toString());
      switchCont.setAttribute('data-item-id', item.id);
      switchCont.appendChildren(switchMinus, switchQuantity, switchPlus);

      // remove btn creating

      const removeBtn = new Button({ content: '🗑️' });
      removeBtn.setAttribute('data-id', item.id);
      this.cartEngine.productRemoving(removeBtn.element);

      // total price element creating

      let variantTotalPrice = `${productTotalPrice.slice(0, productFractionDigits)}.${productTotalPrice.slice(productFractionDigits)}`;

      if (!+variantTotalPrice) {
        removeBtn.setAttribute('disabled', '');
        switchMinus.setAttribute('disabled', '');
        switchPlus.setAttribute('disabled', '');
        variantTotalPrice = '00.00';
        this.cartEngine.giftPrice = +variantAmount;
        currentTr.element.style.backgroundColor = 'lightgray'; //debug
      }

      const totalPrice = new BaseElement({
        tag: 'td',
        content: `€${variantTotalPrice}`,
      });

      // current tr childs appending
      currentTr.appendChildren(
        new BaseElement({ tag: 'td' }, productCover),
        albumInfo,
        new BaseElement({
          tag: 'td',
          content: `€${variantAmount.slice(0, variantFractionDigits)}.${variantAmount.slice(variantFractionDigits)}`,
        }),
        new BaseElement({ tag: 'td' }, switchCont),
        totalPrice,
        new BaseElement({ tag: 'td' }, removeBtn)
      );
      cartTBody.append(currentTr);

      // button controller calling
      this.cartEngine.buttonController(switchMinus, switchQuantity.element, switchPlus, currentTr, totalPrice);
    });
    this.cartListCont.appendChildren(cartTHead, cartTBody);

    // totalCont elements creating
    const subtotalTitle = new BaseElement({ tag: 'h3', content: TEXT_CONTENT.cartSubtotalTitle });
    const promoApplyBtn = new Button({ content: TEXT_CONTENT.cartPromoAdd });

    const promoInputField = new InputField([], {
      label: { content: TEXT_CONTENT.cartPromoLabel },
      input: {
        name: TEXT_CONTENT.cartPromoInputName,
        type: 'text',
        placeholder: TEXT_CONTENT.cartPromoInputPH,
      },
      error: { classes: [CLASS_NAMES.formError] },
    });
    promoInputField.input.element.after(promoApplyBtn.element);

    this.cartEngine.promocodeApply(promoInputField, promoApplyBtn);

    const checkoutBtn = new Button({ content: TEXT_CONTENT.cartCheckoutBtn });
    this.cartEngine.checkout(checkoutBtn);

    cartTotalCont.appendChildren(
      new BaseElement(
        { styles: { display: 'flex' } }, //debug
        subtotalTitle,
        this.totalAmount
      ),
      promoInputField,
      checkoutBtn,
      new Anchor({
        href: '/catalog',
        content: TEXT_CONTENT.cartShoppingBtn,
        // classes: [CLASS_NAMES.link, CLASS_NAMES.header.catalog],
      })
    );

    // active promocodes creating
    if (currentCart.discountCodes.length) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      currentCart.discountCodes.forEach(async (promoCode) => {
        const codeID = promoCode.discountCode.id;
        const codeInfo = (await sdk.getDiscountCodeByID({ ID: codeID })) as unknown as DiscountCode;

        if (!codeInfo || !codeInfo.description) return;

        const promoRemoveBtn = new Button({ content: TEXT_CONTENT.cartPromoRemove });
        promoRemoveBtn.setAttribute('data-id', codeID);

        const promoCont = new BaseElement(
          {},
          new BaseElement({ tag: 'h4', content: `Code "${codeInfo.code}" activated` }),
          new BaseElement(
            { styles: { display: 'flex' } }, //debug
            new Paragraph(codeInfo.description.en),
            promoRemoveBtn
          )
        );
        cartTotalCont.prepend(promoCont);

        this.cartEngine.promocodeRemove(promoRemoveBtn);
      });

      subtotalTitle.element.after(this.savingParagraph.element);
    }

    // Clear cart modal creating
    const clearBtn = new Button({ content: TEXT_CONTENT.cartClearModalBtn });

    const clearModal = new BaseElement(
      { classes: [CLASS_NAMES.cart.cartClearModal] },
      new Paragraph(TEXT_CONTENT.cartClearMessage)
    );
    const clearBtnsCont = new BaseElement({});
    const clearConfirmBtn = new Button({ content: TEXT_CONTENT.cartClearConfirm });
    const clearCancelBtn = new Button({ content: TEXT_CONTENT.cartClearCancel });

    clearBtnsCont.appendChildren(clearConfirmBtn, clearCancelBtn);
    clearModal.append(clearBtnsCont);

    clearBtn.addListener('click', () => this.append(clearModal));
    clearCancelBtn.addListener('click', () => clearModal.remove());
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    clearConfirmBtn.addListener('click', async () => await this.cartEngine.clearCart());

    // all mainCont elements appending

    cartMainCont.appendChildren(this.cartListCont, cartTotalCont);
    this.appendChildren(promoInfo, cartMainCont, clearBtn);

    await this.cartEngine.totalPriceUpdating();
  }
}
