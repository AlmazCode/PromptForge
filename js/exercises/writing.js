export const writing = {
  t001: {
    input:
      'Product: SprintNote, a team notes app.\nNew feature: turns meeting notes into assigned action items.\nAudience: small remote product teams.\nAvailable today on all existing plans. No performance claims have been measured.',
    requirements: [
      'Assign a B2B copywriter role and name the audience.',
      'Ask for one LinkedIn post, at most 120 words, with 2–3 hashtags.',
      'Use a professional, approachable tone and one clear call to action.',
      'Include a sample opening. Do not invent customer quotes or metrics.',
    ],
    hint: 'Give the product facts, audience, output shape and a sample hook. Explicitly prohibit unsupported claims.',
    examples: [
      'You are a B2B copywriter. Using only the SprintNote facts below, write one friendly LinkedIn post for remote product teams. Keep it under 120 words, include 2–3 relevant hashtags and invite readers to try action items. Sample opening: “Meeting finished. Next steps assigned.” Do not invent results or testimonials. Facts: SprintNote turns meeting notes into assigned action items and is available today on all existing plans.',
      'Act as SprintNote’s product marketer. Draft a professional LinkedIn announcement, maximum 120 words, for small remote product teams. Start with a practical meeting problem, explain the new notes-to-action-items feature, finish with one CTA and two hashtags. Example CTA: “Open your next meeting note and try action items.” Use only the supplied feature facts.',
    ],
  },
  t005: {
    input:
      '# Create a note\nSend `POST /notes` with a JSON body.\n```json\n{"title":"Plan","body":"Write tests"}\n```\nA successful request returns HTTP 201. Invalid input returns HTTP 422.\nTerminology: note = ノート; request = リクエスト; response = レスポンス.',
    requirements: [
      'Assign a Japanese technical translator role.',
      'Return Markdown, preserving code blocks, endpoint names and status codes exactly.',
      'Translate all prose; add no commentary and keep any translator note under 30 words.',
      'Use a formal technical tone and demonstrate one terminology mapping.',
    ],
    hint: 'Distinguish text that may be translated from identifiers that must remain unchanged.',
    examples: [
      'You are an English-to-Japanese technical translator. Translate the supplied documentation into formal Japanese Markdown. Preserve every code block, endpoint, JSON key and HTTP status code exactly. Follow the glossary, for example “request” → “リクエスト”. Return only the translated page, with no extra explanation; if essential, a translator note must be under 30 words.',
    ],
  },
  t006: {
    input:
      'Audience: adults working from home. Product constraints: no medical diagnosis, no camera required, optional wearable integration. Budget: small bootstrapped team. Ideas must differ in their central user problem.',
    requirements: [
      'Assign a product strategist role.',
      'Request exactly ten numbered ideas with audience, key feature and monetization fields.',
      'Limit each idea to 60 words.',
      'Use an imaginative but practical tone, include one sample entry and avoid medical claims.',
    ],
    hint: 'Define what makes ideas distinct and require comparable fields for every idea.',
    examples: [
      'Act as a pragmatic product strategist. Generate ten distinct AI fitness-app ideas for adults working from home, using the supplied constraints. Return numbered entries with audience, key feature and monetization, maximum 60 words per idea. Be creative but practical; no medical diagnosis or guaranteed outcomes. Sample structure: “Desk Breaks | remote workers | optional movement reminders | freemium”. Avoid ten cosmetic variations of the same idea.',
    ],
  },
  t010: {
    input:
      'Product: SprintNote team notes. Trial: 14 days. Features: shared notes, action items, search and exports. No credit card is required for the trial. Do not claim an integration or discount that is not listed.',
    requirements: [
      'Assign a SaaS lifecycle copywriter role.',
      'Return five emails with day, subject, body and one CTA.',
      'Limit each body to 90 words and subject to 50 characters.',
      'Use a helpful, nonpushy tone and show one example CTA; avoid unsupported urgency.',
    ],
    hint: 'Give each email a distinct purpose: start, collaborate, act, find information and review the trial.',
    examples: [
      'You are a SaaS lifecycle copywriter. Write a helpful five-email SprintNote trial sequence using only the supplied facts. For each email give day, subject (max 50 characters), body (max 90 words) and one CTA. Progress from first note to collaboration, action items, search/exports and trial review. Example CTA: “Create your first shared note”. Avoid invented integrations, discounts and false urgency.',
    ],
  },
  t014: {
    input:
      'Fictional tools for comparison:\nDraftFox: $12/month, 8 templates, no team seats, offline export.\nWordHarbor: $20/month, 15 templates, 3 team seats, no offline export.\nInkPilot: $9/month, 5 templates, 1 seat, offline export.\nThese are exercise facts, not real market claims. No market-share data is supplied.',
    requirements: [
      'Assign a product analyst role.',
      'Return a comparison table and SWOT entries for all three fictional tools.',
      'Limit each SWOT quadrant to two bullets; total under 400 words.',
      'Use an evidence-based neutral tone; show one example evidence citation and mark unavailable market data.',
    ],
    hint: 'Separate supplied quantitative facts from hypothetical opportunities and threats.',
    examples: [
      'You are a product analyst. Compare the three fictional writing tools using only the supplied facts. Return a feature/price table and SWOT for each, with at most two bullets per quadrant and 400 words total. Use a neutral evidence-based tone. Example evidence: “DraftFox: $12/month (supplied facts)”. Label opportunities/threats as hypotheses and market share as unknown; do not invent positioning statistics.',
    ],
  },
};
