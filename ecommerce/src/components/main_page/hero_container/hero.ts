import './hero.sass';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import video from '../../../assets/vinyl_video.webm';
import Anchor from '@/utils/elements/anchor';
import Button from '@/utils/elements/button';

export default class Hero extends BaseElement {
  romoCont = new BaseElement({ classes: [CLASS_NAMES.main.promoCont] });

  constructor() {
    super(
      { classes: [CLASS_NAMES.main.heroContainer] },
      new BaseElement<HTMLVideoElement>(
        {
          tag: 'video',
          classes: [CLASS_NAMES.main.video],
          autoplay: true,
          loop: true,
          muted: true,
        },
        new BaseElement<HTMLSourceElement>({
          tag: 'source',
          type: 'video/mp4',
          src: video as string,
        })
      ),
      new BaseElement({ classes: [CLASS_NAMES.main.heroOverlay] }),
      new BaseElement(
        { classes: [CLASS_NAMES.main.aboutContainer] },
        new BaseElement({ tag: 'h2', content: 'Welcome!', classes: [CLASS_NAMES.main.title] }),
        new Paragraph(TEXT_CONTENT.mainTextAbout, [CLASS_NAMES.main.aboutText])
      ),
      new Anchor({ content: 'Our catalog', classes: [CLASS_NAMES.main.catalogBtn], href: '/catalog' })
    );

    this.append(this.romoCont);
    this.promoCodesEngine();
  }

  promoCodesEngine() {
    TEXT_CONTENT.mainPromoInfoDescr.forEach((descr, index) => {
      const currentPromoCont = new BaseElement(
        { classes: [CLASS_NAMES.main.promo] },
        new Paragraph(TEXT_CONTENT.cartPromoCodes[index]),
        new BaseElement({ classes: [CLASS_NAMES.main.promoDescr], content: descr })
      );

      const promoImg = new Image(100, 100);
      if (index) {
        promoImg.src =
          'https://raw.githubusercontent.com/sunlaa/commerce-images/main/record_players/crosley/cr8005f_ws/main.jpg';
      } else {
        promoImg.src = 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/cart/cart-discount.png';
      }

      const promoButton = new Button({ classes: [CLASS_NAMES.main.promoModalBtn], content: TEXT_CONTENT.mainModalBtn });
      const promoModal = new BaseElement(
        { classes: [CLASS_NAMES.main.promoModal] },
        new BaseElement(
          {},
          new BaseElement({ tag: 'h3', content: TEXT_CONTENT.mainPromoInfoMainTitle[index] }),
          promoImg,
          new Paragraph(TEXT_CONTENT.mainPromoInfoSubTitle[index]),
          promoButton
        )
      );

      currentPromoCont.addListener('click', () => {
        this.append(promoModal);
      });
      promoButton.addListener('click', () => {
        promoModal.remove();
      });

      this.romoCont.append(currentPromoCont);
    });
  }
}
