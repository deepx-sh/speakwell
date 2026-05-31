import { BANNED_WORDS } from "../services/llm.service";

export const buildReviewPrompt = (draft: string): string => {
    return `
Review this testimonial draft and check for these issues:
1. Does it contain any of these banned words: ${BANNED_WORDS}?
2. Does it sound like a real human wrote it, not marketing copy?
3. Does it start with something specific, not generic filler?
4. Is it 3 to 5 sentences?

If ALL checks pass — return the testimonial exactly as is.
If ANY issue is found — rewrite it fixing only the issues, preserving the original meaning.

Return ONLY the final testimonial text. No explanation. No quotes.

DRAFT:
${draft}
  `.trim();
}