// Applies the wrapping rule (`tie`, in ./typography.ts) to every Markdown body
// the site renders, at build time. Wired into `astro.config.mjs`.
//
// A plugin rather than a call site, because "every page" was the point: the
// owner asked for a global rule, and a rule each new content file has to
// remember to invoke is not one.
//
// Written against Sätteri's own `hastPlugins` hook, which is Astro's default
// Markdown pipeline here. The obvious alternative — `markdown.rehypePlugins` —
// still exists but now requires installing `@astrojs/markdown-remark`, which
// swaps the whole Markdown processor back to unified for every file on the
// site. A dependency and a pipeline change is a large price for one text
// transform, and the native hook does the same job with neither.
//
// Build-time only: nothing runs in production and nothing is added to the
// shipped page but the non-breaking spaces themselves, so the zero-cost /
// static-only guardrail in docs/ARCHITECTURE.md is untouched.

import type { HastPluginDefinition } from 'satteri';
import { tie, tieAcross } from './typography';

/** Elements whose text is markup or code, not prose. */
const SKIP = new Set(['code', 'pre', 'kbd', 'samp', 'var', 'script', 'style']);

const satteriTie: HastPluginDefinition = {
  name: 'tie',
  text(node, ctx) {
    // Walk up rather than checking only the direct parent: `<pre><code>` nests,
    // and inline code inside a link would otherwise be reached through the
    // link.
    let parent = ctx.parent(node) as { type?: string; tagName?: string } | undefined;
    while (parent) {
      if (parent.type === 'element' && parent.tagName && SKIP.has(parent.tagName)) return;
      parent = ctx.parent(parent as never) as typeof parent;
    }

    // Markdown is hard-wrapped in the source, so "…Each\nhas its own policy"
    // arrives as a text node containing a real newline. The browser collapses
    // that newline to a space and will happily break the line there, but
    // `tie()` deliberately never crosses a newline (in a raw string a line
    // break is a wrap the author chose). Here it is not: HTML collapses it, so
    // it is a space, and it is normalised to one before the rule runs.
    // Without this, every stray word that happens to fall at the end of a
    // source line stays untied — which was most of them.
    const flat = node.value.replace(/[ \t]*\n[ \t]*/g, ' ');
    let value = tie(flat);

    // …and then across the boundary into the next element: "…and <strong>Study
    // mode</strong>" leaves "and" stranded at the end of this text node, where
    // `tie()` cannot see what follows it.
    const holder = ctx.parent(node) as { children?: unknown[] } | undefined;
    const index = ctx.indexOf(node);
    const next =
      holder && index !== undefined ? (holder.children?.[index + 1] as never) : undefined;
    if (next) {
      const nextText = ctx.textContent(next).trimStart();
      if (nextText) value = tieAcross(value, nextText.split(/\s/)[0] ?? '');
    }

    if (value === node.value) return;
    // The node is readonly, so the change is returned as a replacement.
    return { type: 'text', value };
  },
};

export default satteriTie;
