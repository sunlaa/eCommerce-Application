import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, teamMembers, collaborationData } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import Paragraph from '@/utils/elements/paragraph';
import './about_page.sass';
import GHLink from '@/utils/elements/gh_link';
import RSLogo from '../general/rs_logo';

export default class AboutPageUi extends BaseElement {
  sectionAbout = new Section({ classes: [CLASS_NAMES.about.section] });

  constructor() {
    super({ classes: [CLASS_NAMES.about.aboutPage] });
    this.spawnMembersBio();
    this.spawnColoboration();
  }

  spawnMembersBio(): void {
    const aboutTitle = new Paragraph('We are', [CLASS_NAMES.about.aboutTitle]);

    this.sectionAbout.append(aboutTitle);

    const members = new BaseElement({ classes: [CLASS_NAMES.about.members] });

    teamMembers.forEach((member) => {
      const memberContainer = new BaseElement({ classes: [CLASS_NAMES.about.memberContainer] });

      const bioContainer = new BaseElement({ classes: [CLASS_NAMES.about.bioContainer] });

      const name = new Paragraph(member.name, [CLASS_NAMES.about.memberName]);
      const role = new Paragraph(member.role, [CLASS_NAMES.about.memberRole]);
      const image = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.about.memberImage],
        src: member.image,
      });
      const ghLink = new GHLink(member.gitName, member.github);

      bioContainer.appendChildren(name, role, image);

      const bio = new BaseElement({ tag: 'p', innerHTML: member.bio, classes: [CLASS_NAMES.about.memberBio] });

      const contribution = document.createElement('ul');
      contribution.classList.add(CLASS_NAMES.about.memberContribution);
      member.contribution.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = item;
        contribution.append(li);
      });

      memberContainer.appendChildren(bioContainer, ghLink, bio, contribution);
      members.append(memberContainer);
    });

    this.sectionAbout.appendChildren(members);
    this.append(this.sectionAbout);
  }

  spawnColoboration() {
    const collaborationContainer = new BaseElement({ classes: [CLASS_NAMES.about.collaborationContainer] });
    const wrapper = new BaseElement(
      { classes: [CLASS_NAMES.about.wrapper] },
      new BaseElement({ tag: 'h2', content: 'Collaboration in our team' })
    );
    const collaborationItems = new BaseElement({ classes: [CLASS_NAMES.about.collaborationItems] });

    collaborationData.forEach((data) => {
      const item = new BaseElement(
        { classes: [CLASS_NAMES.about.collaborationItem] },
        new BaseElement({ tag: 'h3', content: data.title, classes: [CLASS_NAMES.about.itemTitle] }),
        new BaseElement<HTMLImageElement>({
          tag: 'img',
          src: data.image,
          classes: [CLASS_NAMES.about.itemImage],
        }),
        new Paragraph(data.text, [CLASS_NAMES.about.itemText])
      );

      collaborationItems.append(item);
    });

    wrapper.append(collaborationItems);
    collaborationContainer.appendChildren(wrapper, new RSLogo());
    this.sectionAbout.append(collaborationContainer);
  }
}
