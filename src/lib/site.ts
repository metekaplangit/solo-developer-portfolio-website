// Single source of site-level identity + navigation. Placeholder values are
// safe to edit without touching components. See docs/ARCHITECTURE.md (DRY).
export const site = {
  name: 'MetKap Studio',
  brand: 'MetKap Studio',
  /** The person behind the studio (used on the About page). */
  person: 'Mete Kaplan',
  tagline: 'An independent studio building calm apps and small games.',
  description:
    'MetKap Studio — the apps and games of an independent studio, with clear privacy and support pages for every product.',
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
