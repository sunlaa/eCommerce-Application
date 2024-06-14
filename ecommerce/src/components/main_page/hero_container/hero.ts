import './hero.sass';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import video from '../../../assets/vinyl_video.webm';
import Anchor from '@/utils/elements/anchor';

export default class Hero extends BaseElement {
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
  }
}
