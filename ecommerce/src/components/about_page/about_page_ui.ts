import BaseElement from '@/utils/elements/basic_element';
import { TEXT_CONTENT, CLASS_NAMES } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import Paragraph from '@/utils/elements/paragraph';
import './about_page.sass';

export default class AboutPageUi extends BaseElement {
  constructor() {
    super(CLASS_NAMES.about.aboutPage);
    this.spawnSection();
  }

  spawnSection(): void {
    const sectionAbout = new Section({ classes: [CLASS_NAMES.about.section] });
    const backImg = new BaseElement({ classes: [CLASS_NAMES.about.backImg] });
    sectionAbout.appendChildren(backImg);

    const aboutTitle = new Paragraph('We are', [CLASS_NAMES.about.aboutTitle]);

    const teamMembers = [
      {
        name: 'Lada Santalava',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Uladzislava.jpeg?raw=true',
        bio: 'Lada excels at crafting seamless user interfaces. She has been interested in coding since her school days and continuously strives to expand her knowledge.',
        contribution: [
          'As Team Lead, fostered a collaborative project environment from inception to completion.',
          'Engineered website routing to enhance navigation and user experience.',
          'Developed a robust component for integrating commercetools SDK, showcasing commitment to project excellence.',
          'Designed and implemented the «Main» page with an inviting and intuitive user interface.',
          'Enhanced functionality and accessibility of product information on the product «Catalog» page.',
        ],
        github: 'https://github.com/sunlaa',
        gitName: 'sunlaa',
      },
      {
        name: 'Katsiaryna Stanevich',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Katsiaryna.jpeg?raw=true',
        bio: 'Katsiaryna is passionate about creating user-friendly and visually appealing web applications. She is improving her coding skills through continuous learning.',
        contribution: [
          'Wrote code to load products into commercetools, optimizing data management and retrieval.',
          'Developed a secure «Login» page to ensure safe access and user authentication.',
          'Implemented a detailed «Product» description page to improve user experience with comprehensive information.',
          'Contributed to expanding an SDK integration component, enhancing its functionality.',
          'Created an engaging and visually appealing «About Us» page with valuable insights into the project team and its overarching mission.',
        ],
        github: 'https://github.com/katyastan',
        gitName: 'katyastan',
      },
      {
        name: 'Pavel Terno',
        role: 'Frontend Developer',
        image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Pavel.png?raw=true',
        bio: 'Pavel is an enthusiastic developer with a passion for creating functional websites. He is always eager to learn new technologies and improve his coding skills.',
        contribution: [
          'Created a robust validation component ensuring data integrity across modules.',
          'Implemented an intuitive «Registration» page for seamless user onboarding.',
          'Crafted a user-friendly «Profile» page to enhance user engagement and personalization.',
          'Contributed to extending a versatile SDK-compatible component, enhancing platform capabilities.',
          'Designed and implemented a streamlined shopping «Cart» page for efficient e-commerce transactions.',
        ],
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
      const gitContainer = new BaseElement({ classes: [CLASS_NAMES.about.gitContainer] });
      const gitLogo = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.about.gitLogo],
      });
      const github = document.createElement('a');
      github.href = member.github;
      github.textContent = member.gitName;
      github.classList.add(CLASS_NAMES.about.memberGithub);
      const image = new BaseElement<HTMLImageElement>({
        tag: 'img',
        classes: [CLASS_NAMES.about.memberImage],
        src: member.image,
      });
      const contribution = document.createElement('ul');
      contribution.classList.add(CLASS_NAMES.about.memberContribution);
      member.contribution.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        contribution.append(li);
      });

      gitContainer.appendChildren(gitLogo, github);
      memberContainer.appendChildren(name, role, image, bio, gitContainer, contribution);
      members.append(memberContainer);
    });

    sectionAbout.appendChildren(members);

    const collaborationContainer = new BaseElement({
      classes: [CLASS_NAMES.about.collaborationContainer],
      content: TEXT_CONTENT.aboutCollaboration,
    });
    const schoolLogoContainer = new BaseElement({ classes: [CLASS_NAMES.about.schoolLogoContainer] });
    const schoolLogo = document.createElement('img');
    schoolLogo.src = 'https://app.rs.school/static/images/logo-rsschool3.png';
    schoolLogo.classList.add(CLASS_NAMES.about.schoolLogo);
    schoolLogo.alt = 'school logo';
    schoolLogo.addEventListener('click', () => {
      window.open('https://app.rs.school/');
    });
    schoolLogoContainer.appendChildren(schoolLogo);
    sectionAbout.appendChildren(collaborationContainer, schoolLogoContainer);
    this.appendChildren(sectionAbout);
  }
}
