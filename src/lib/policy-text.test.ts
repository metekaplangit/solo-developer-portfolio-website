import { describe, it, expect } from 'vitest';
import { privacyPolicyEntrySchema } from '../content/schema';
import {
  policyFacts,
  protectionText,
  childrenText,
  rightsText,
  contactRequestsText,
  changesText,
  resolveSection,
} from './policy-text';
import { GLOBAL_POLICY_ID } from './privacy';

const base = {
  productId: 'sole-focus',
  title: 'Sole Focus Privacy Policy',
  lastUpdated: '2026-01-01',
  retention: 'Delete the app to remove everything.',
  contact: 'support@metkapstudio.com',
  effectiveScope: 'All versions.',
};

const parse = (over: Record<string, unknown> = {}) =>
  privacyPolicyEntrySchema.parse({ ...base, ...over });

describe('policyFacts', () => {
  it('calls the site-wide policy a website and a product policy an app', () => {
    expect(policyFacts(parse({ productId: GLOBAL_POLICY_ID })).subject).toBe('This website');
    expect(policyFacts(parse()).subject).toBe('This app');
  });

  it('reads collection and local storage from the arrays that carry them', () => {
    const f = policyFacts(parse({ dataCollected: ['email'], storedLocally: ['settings'] }));
    expect(f).toMatchObject({ collectsData: true, storesLocally: true });
  });
});

describe('the generated defaults', () => {
  it('makes the strongest honest claim available for local-only storage', () => {
    const t = protectionText({ collectsData: true, storesLocally: true, subject: 'This app' });
    expect(t).toContain('stays on your device');
    // The point of the local-only case: there is nothing central to breach.
    expect(t).toContain('no central copy');
  });

  it('hedges honestly when data IS held, and says so', () => {
    const t = protectionText({ collectsData: true, storesLocally: false, subject: 'This app' });
    expect(t).toContain('commercially reasonable safeguards');
    // The sentence that stops this reading as a promise.
    expect(t).toContain('is ever completely secure');
  });

  it('gives the under-13 language only to a policy that could hold a child’s data', () => {
    const facts = { storesLocally: false, subject: 'This app' };
    expect(childrenText({ ...facts, collectsData: true })).toContain('under 13');
    // Reciting COPPA boilerplate a product cannot act on is worse than the
    // simpler true statement.
    expect(childrenText({ ...facts, collectsData: false })).not.toContain('under 13');
  });

  it('leaves the rights and contact sentences open for the address', () => {
    const facts = { collectsData: false, storesLocally: true, subject: 'This app' };
    // Both end mid-sentence: the component appends the contact link, so an
    // override cannot drop the route Apple 5.1.1(i) requires.
    expect(rightsText(facts).endsWith('email ')).toBe(true);
    expect(contactRequestsText().endsWith('— ')).toBe(true);
  });

  it('names the right subject in the changes sentence', () => {
    expect(changesText({ collectsData: false, storesLocally: false, subject: 'This website' })).toContain(
      'this website',
    );
  });
});

describe('resolveSection', () => {
  // Everything here comes back tied (STEP-0062) — the point of routing both the
  // override and the default through one function rather than rendering either
  // directly. `tie()` is idempotent, so the tied form IS what ships.
  const NBSP = ' ';

  it('prefers the content file’s override over the generated default', () => {
    // "Our" is a tie word; "own" is not — hence the pairing.
    expect(resolveSection('Our own wording.', 'The default.')).toBe(`Our${NBSP}own wording.`);
  });

  it('falls back to the default when no override is set', () => {
    expect(resolveSection(undefined, 'The default.')).toBe(`The${NBSP}default.`);
  });

  it('applies the wrapping rule to an override, not only to the defaults', () => {
    // Without this, overridden prose would be the one text on the site allowed
    // to end a line on a stray short word.
    expect(resolveSection('Written by a person.', 'x')).toContain(' ');
  });
});

describe('privacyPolicyEntrySchema.sections', () => {
  it('defaults to an empty object so every section falls back', () => {
    expect(parse().sections).toEqual({});
  });

  it('accepts a partial override without demanding the other four', () => {
    const r = parse({ sections: { children: 'Not for kids.' } });
    expect(r.sections.children).toBe('Not for kids.');
    expect(r.sections.protection).toBeUndefined();
  });

  it('rejects an empty override, which would silently blank a legal section', () => {
    expect(privacyPolicyEntrySchema.safeParse({ ...base, sections: { rights: '' } }).success).toBe(
      false,
    );
  });
});
