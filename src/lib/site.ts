// Single source of site-level identity + navigation. Placeholder values are
// safe to edit without touching components. See docs/ARCHITECTURE.md (DRY).
import { tie } from './typography';

export const site = {
  name: 'MetKap Studio',
  brand: 'MetKap Studio',
  /** The person behind the studio (used on the About page). */
  person: 'Mete Kaplan',
  // `tie()` on the strings that are rendered as multi-line prose — the wrapping
  // rule (STEP-0062). Not on `name`, `description` or the social labels: those
  // are a word, a <meta> string and link labels respectively, none of which wrap.
  tagline: tie('An independent studio building calm apps and small games.'),
  /** Home hero headline. Owner-directed (2026-07-18): deliberately platform
   *  neutral — the studio is not Mac-only, even though the first shipped
   *  product is. Kept here, not inline, so the wording has one owner. */
  headline: 'Brilliant Products for All',
  /** Home hero lede. `description` below is the SEO <meta> string and reads
   *  like one; this is the same substance written for a person. Platform
   *  neutral for the same reason as `headline`. */
  lede: tie(
    'The apps and games of a one-person studio — each with a plain privacy page and a real person answering support. No hype, no tracking, no subscription.',
  ),
  description:
    'MetKap Studio — the apps and games of an independent studio, with clear privacy and support pages for every product.',
  supportEmail: 'support@metkapstudio.com',
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
