import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import Paragraph from '@/utils/elements/paragraph';
import Anchor from '@/utils/elements/anchor';
import './about_page.sass';

export default class AboutPageUi extends BaseElement {
  constructor() {
    super(CLASS_NAMES.about.aboutPage);
    this.spawnSection();
  }

  spawnSection(): void {
    const sectionAbout = new Section({ classes: [CLASS_NAMES.about.section] });

    const aboutTitle = new Paragraph('We are', [CLASS_NAMES.about.aboutTitle]);

    const teamMembers = [
      {
        name: 'Uladzislava Santalava',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Uladzislava.jpeg?raw=true',
        bio: 'Lada excels at crafting seamless user interfaces. She is passionate about web development and continuously strives to expand her knowledge.',
        contribution: 'скрины со страничками',
        github: 'https://github.com/sunlaa',
        gitName: 'sunlaa',
      },
      {
        name: 'Katsiaryna Stanevich',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Katsiaryna.jpeg?raw=true',
        bio: 'Katsiaryna is passionate about creating user-friendly and visually appealing web applications. She is improving her coding skills through continuous learning.',
        contribution: 'скрины со страничками',
        github: 'https://github.com/katyastan',
        gitName: 'katyastan',
      },
      {
        name: 'Pavel Terno',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Pavel.png?raw=true',
        bio: 'Pavel is an enthusiastic developer with a passion for creating functional websites. He is always eager to learn new technologies and improve his coding skills.',
        contribution: 'скрины со страничками',
        github: 'https://github.com/pahanchickt',
        gitName: 'pahanchickt',
      },
    ];

    sectionAbout.appendChildren(aboutTitle);

    const members = new BaseElement({ classes: [CLASS_NAMES.about.members] });

    teamMembers.forEach((member) => {
      const memberContainer = new BaseElement({ classes: [CLASS_NAMES.about.memberContainer] });
      const name = new Paragraph(member.name, [CLASS_NAMES.about.memberName]);
      const role = new Paragraph(member.role, [CLASS_NAMES.about.memberRole]);
      const bio = new Paragraph(member.bio, [CLASS_NAMES.about.memberBio]);
      const contribution = new Paragraph(`Contribution: ${member.contribution}`, [
        CLASS_NAMES.about.memberContribution,
      ]);
      const gitContainer = new BaseElement({ classes: [CLASS_NAMES.about.gitContainer] });

      const gitLogo = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.about.gitLogo],
      });

      const github = new Anchor({
        href: member.github,
        content: member.gitName,
        classes: [CLASS_NAMES.about.memberGithub],
      });
      // github.addListener('click', () => {
      //     window.open(member.github);
      // });

      const image = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.about.memberImage],
        src: member.image,
      });

      gitContainer.appendChildren(gitLogo, github);
      memberContainer.appendChildren(name, role, image, bio, gitContainer, contribution);
      members.append(memberContainer);
    });

    sectionAbout.appendChildren(members);
    this.appendChildren(sectionAbout);
  }
}
