// Single source of site-level identity + navigation. Placeholder values are
// safe to edit without touching components. See docs/ARCHITECTURE.md (DRY).
import { tie } from './typography';

export const site = {
  name: 'MetKap Studio',
  brand: 'MetKap Studio',
  // `tie()` on the strings that are rendered as multi-line prose — the wrapping
  // rule (STEP-0062). Not on `name`, `description` or the social labels: those
  // are a word, a <meta> string and link labels respectively, none of which wrap.
  // No platforms in a line about the studio: it is cross-platform (owner,
  // 2026-11-02). A product's own lines name its own.
  tagline: tie('MetKap Studio makes apps and games.'),
  /** Home hero lede. `description` below is the SEO <meta> string and reads
   *  like one; this is the same substance written for a person. Platform
   *  neutral: the studio is cross-platform (owner, 2026-07-18 and 2026-11-02),
   *  so it names no platform. */
  lede: tie(
    'Every app and game has its own privacy page, and when you write to us, you usually hear back within 2–3 business days.',
  ),
  description:
    'MetKap Studio makes apps and games. Every one has its own privacy page, and when you write to us, you usually hear back within 2–3 business days.',
  supportEmail: 'support@metkapstudio.com',
  /** The studio's own accounts, checked live on 2026-11-07 (owner, 2026-11-07). */
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/metkapstudio', icon: 'facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/metkapstudio/', icon: 'instagram' },
    { name: 'X', href: 'https://x.com/metkapstudio', icon: 'x' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Apps & Games', href: '/apps/' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Support', href: '/support/' },
  { label: 'About', href: '/about/' },
] as const;
