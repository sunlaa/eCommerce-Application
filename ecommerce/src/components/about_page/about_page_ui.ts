import BaseElement from '@/utils/elements/basic_element';
import { TEXT_CONTENT, CLASS_NAMES, teamMembers } from '@/utils/types_variables/variables';
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
