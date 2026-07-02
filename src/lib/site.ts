// Single source of site-level identity + navigation. Placeholder values are
// safe to edit without touching components. See docs/ARCHITECTURE.md (DRY).
export const site = {
  name: 'Mete Kaplan',
  brand: 'Mete Kaplan',
  tagline: 'Solo developer building calm apps and small games.',
  description:
    'The apps and games of a solo developer — with clear privacy and support pages for every product.',
  supportEmail: 'support@example.com',
  social: [
    { label: 'GitHub', url: 'https://github.com/metekaplangit' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Apps & Games', href: '/apps/' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Support', href: '/support/' },
  { label: 'About', href: '/about/' },
] as const;
