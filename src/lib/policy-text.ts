// The default wording for a privacy policy's generated sections (STEP-0067).
//
// These five sections used to be literal strings inside `PolicyArticle.astro`,
// some behind ternaries on `dataCollected` / `storedLocally`. That made a shared
// component the owner of legal text: a product whose wording had to differ meant
// editing something every product renders through.
//
// The text lives here instead, as pure functions of the policy's own facts, and
// a content file can replace any of them through `sections` in its frontmatter.
// The component now decides only where the text goes, never what it says.
//
// Pure and unit-tested — no Astro, no DOM. See docs/DATA_STORAGE.md.

import type { PrivacyPolicyEntry } from '../content/schema';
import { tie } from './typography';
import { GLOBAL_POLICY_ID } from './privacy';

/**
 * The facts these sentences turn on. Taken as a narrow shape rather than the
 * whole entry so the defaults cannot quietly start depending on more of the
 * policy than they declare.
 */
export interface PolicyFacts {
  /** Does this product collect any personal data at all? */
  collectsData: boolean;
  /** Does it keep anything on the user's own device? */
  storesLocally: boolean;
  /** The natural subject noun — "This website" or "This app". */
  subject: string;
}

/**
 * Read the facts out of a policy entry.
 *
 * `subject` matters more than it looks: the same component renders the
 * site-wide policy and a per-product one, and "This app keeps nothing about you
 * on any server" is simply false when the page is about a website.
 */
export function policyFacts(policy: PrivacyPolicyEntry): PolicyFacts {
  return {
    collectsData: policy.dataCollected.length > 0,
    storesLocally: policy.storedLocally.length > 0,
    subject: policy.productId === GLOBAL_POLICY_ID ? 'This website' : 'This app',
  };
}

/**
 * "How your data is protected".
 *
 * Three cases, in order of how much they can promise. Local-only storage is the
 * strongest claim available and is stated first; a product that holds nothing
 * anywhere is next; a product that does hold something gets the honest hedge,
 * including the sentence saying no storage is ever completely secure.
 */
export function protectionText({ collectsData, storesLocally, subject }: PolicyFacts): string {
  if (storesLocally) {
    return "Everything above stays on your device. Because nothing is uploaded to a server, there's no central copy to be breached, leaked, or handed over to anyone.";
  }
  if (collectsData) {
    return 'We protect the limited data we hold with commercially reasonable safeguards, and keep the amount we hold — and the risk — as small as possible. No method of transmission or storage is ever completely secure.';
  }
  return `${subject} keeps nothing about you on any server, so there's nothing to breach, leak, or hand over.`;
}

/**
 * "Children's privacy".
 *
 * The under-13 language and the deletion offer only make sense for a product
 * that could hold a child's data. One that collects nothing says the simpler,
 * truer thing instead of reciting COPPA boilerplate it cannot act on.
 */
export function childrenText({ collectsData, subject }: PolicyFacts): string {
  return collectsData
    ? `${subject} isn't directed at children under 13, and we don't knowingly collect their personal data. If you believe a child has given us data, contact us and we'll delete it.`
    : `${subject} isn't directed at children, and because it collects no personal data, it holds nothing about children either.`;
}

/**
 * "Your rights" — the sentence that runs before the contact address.
 *
 * Both variants end mid-sentence on purpose: the component appends the address
 * itself, so an override cannot drop the contact route Apple 5.1.1(i) requires
 * the page to carry.
 */
export function rightsText({ collectsData }: PolicyFacts): string {
  return collectsData
    ? "You can ask us to access, correct, delete, or export your personal data, or object to how it's used — email "
    : "You have the right to access, correct, or delete any personal data we hold. Because we hold none, there's nothing to retrieve or erase — but if you'd like to confirm that, or make any request, email ";
}

/** "Contact & requests" — the sentence before the contact address. */
export function contactRequestsText(): string {
  return 'Questions, consent changes, or deletion requests — ';
}

/** "Changes to this policy". */
export function changesText({ subject }: PolicyFacts): string {
  return `We may update this policy as ${subject.toLowerCase()} or the law changes. The “Updated” date at the top always reflects the current version, and we'll note anything significant here.`;
}

/**
 * Resolve one section: the content file's override when it set one, otherwise
 * the generated default.
 *
 * Tied here rather than at each call site, so an override written in a content
 * file gets the wrapping rule (STEP-0062) exactly as the defaults do. Without
 * this, overridden prose would be the one text on the site that could end a
 * line on a stray short word.
 */
export function resolveSection(override: string | undefined, fallback: string): string {
  return tie(override ?? fallback);
}
