import SectionGeneral from './section-general';
import SectionSecurity from './section-security';

export const SECTIONS = [
  {
    id: 'general',
    label: 'General',
    SectionComponent: SectionGeneral,
    getInitialValues: (user) => {
      return {
        name: user.name
      };
    }
  },
  {
    id: 'security',
    label: 'Security',
    SectionComponent: SectionSecurity,
    getInitialValues: () => {
      return {
        password: '',
        newPassword: ''
      };
    }
  }
];

export const getUserEditSection = (id) => {
  // If no id is set, use the first step.
  const idx = id ? SECTIONS.findIndex((step) => step.id === id) : 0;

  // Returning an empty objects allows us to correctly deconstruct the object
  // and perform easier validations.
  if (idx < 0) return {};

  return SECTIONS[idx];
};
