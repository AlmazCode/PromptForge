export const data = {
  t002: {
    input:
      'month,revenue_usd,orders,top_product,region\nJul,142000,1840,Widget Pro A,NA\nAug,158000,2100,Widget Pro A,EU\nSep,135000,1720,Widget Lite B,APAC\n\nQuarter revenue: 435000 USD. Quarter orders: 5660.\nSeptember revenue is 14.6% below August.',
    requirements: [
      'Assign a data analyst role.',
      'Request a numbered list with at most five items and 150 words.',
      'Include totals, the strongest month and the August-to-September change.',
      'Use a concise professional tone; include one example item and prohibit unsupported causes.',
    ],
    hint: 'Keep source data separate from instructions. Specify the five-item/150-word limits and show one factual sample item.',
    examples: [
      'You are a data analyst. Summarize the supplied Q3 CSV in at most five numbered items and 150 words. Use a concise professional tone. Include total revenue and orders, the strongest month and the August–September revenue change. Do not invent causes. Example item: “Q3 revenue totals $435,000.” Data: Jul $142,000 / 1,840 orders; Aug $158,000 / 2,100; Sep $135,000 / 1,720.',
      'Act as a financial reporting analyst. Produce a factual executive summary of this sales dataset in a numbered list of no more than five items, under 150 words. Report totals, identify August as the peak and quantify the decline to September. Be professional and concise. Example: “August recorded 2,100 orders.” Treat product and region as labels, not proven causes. Use the supplied CSV only.',
    ],
  },
  t007: {
    input:
      '10:00 Maya: Launch moved to October 22.\n10:20 Ilya: I will finish accessibility fixes by October 15.\n11:00 Nora: Support needs an FAQ; I will draft it by October 18.\n11:45 Maya: No decision on pricing yet.\n12:30 Ilya: The analytics dashboard stays out of the first release.\n13:00 Maya: I own the final release checklist, due October 20.',
    requirements: [
      'Assign a meeting secretary role.',
      'Request at most eight bullets labeled Decision, Action or Open question.',
      'Use at most 180 words and include owners/deadlines when stated.',
      'Keep a neutral factual tone; include a sample bullet and mark missing information rather than inventing it.',
    ],
    hint: 'Distinguish a confirmed decision from an unresolved question. The supplied excerpt is the entire exercise input.',
    examples: [
      'You are a meeting secretary. Compress the supplied transcript excerpt into at most eight bullets and 180 words. Label each bullet Decision, Action or Open question. Use a neutral factual tone, preserve named owners and dates, and mark unstated owners or deadlines as “not stated”. Example: “Action — Ilya: accessibility fixes, October 15.” Do not turn the unresolved pricing question into a decision.',
    ],
  },
  t008: {
    input:
      'Review A: The Trail Cup costs $18. I rate it 4/5. It keeps drinks warm, but the lid is hard to clean. I recommend it for day trips.\nReview B: Desk Lamp Mini is bright and compact, but the hinge feels loose. Price and numeric rating were not provided.',
    requirements: [
      'Assign a structured-data extraction role.',
      'Return a JSON array only with name, price, rating, pros, cons and recommendation.',
      'Use null for missing price/rating/recommendation; at most five entries in pros/cons.',
      'Keep wording factual and compact, provide one schema example and never infer missing facts.',
    ],
    hint: 'Define null handling and data types explicitly. A missing recommendation is not a negative recommendation.',
    examples: [
      'You are a structured-data extractor. Convert the supplied reviews into a JSON array only. Each object has name:string, price:number|null, rating:number|null, pros:string[], cons:string[], recommendation:boolean|null. Keep pros/cons factual and at most five entries each. Never infer unstated values. Example shape: {"name":"Example","price":null,"rating":null,"pros":[],"cons":[],"recommendation":null}. Preserve the stated 4/5 rating as 4.',
    ],
  },
  t012: {
    input:
      'month,revenue_2025,revenue_2026\nJan,10000,12000\nFeb,11000,12100\nMar,9000,18000\nApr,12000,12600\n\nAll amounts are USD. No information about campaigns or causes is provided.',
    requirements: [
      'Assign a business analyst role.',
      'Return a short report with Trends, Outliers and Year-over-year headings.',
      'Keep the full report under 200 words.',
      'Use a neutral professional tone, include an example percentage calculation and distinguish observations from causes.',
    ],
    hint: 'Require the formula (new − old) / old × 100 and forbid explanations unsupported by the CSV.',
    examples: [
      'You are a business analyst. Interpret the supplied USD CSV in under 200 words using Trends, Outliers and Year-over-year headings. Use a neutral professional tone. Calculate percentage changes as (2026−2025)/2025×100; example: January (12000−10000)/10000×100 = 20%. Highlight March without inventing a cause or claiming statistical significance from four observations. Use only the supplied data.',
    ],
  },
  t015: {
    input:
      'Practice contract excerpt:\n§1 Payment: customer pays within 15 calendar days of invoice.\n§2 Renewal: term renews for 12 months unless written cancellation arrives 30 days before expiry.\n§3 Liability: supplier liability is capped at fees paid during the preceding month.\n§4 Confidentiality: both parties protect confidential information for 2 years after termination.\nThis excerpt is the complete input for this exercise.',
    requirements: [
      'Assign a contract-review assistant role; do not present legal advice.',
      'Return a table: section, clause type, obligation, deadline, risk, rationale.',
      'Keep each rationale under 35 words and the summary under 300 words.',
      'Use a cautious factual tone, include a sample row and define low/medium/high risk anchors.',
    ],
    hint: 'Use section references and relative deadlines exactly; do not invent dates or missing contract clauses.',
    examples: [
      'Act as a contract-review assistant, providing an educational summary rather than legal advice. Use only the supplied excerpt. Return a table with section, clause type, obligation, deadline, risk and rationale; rationales under 35 words and total under 300 words. Use a cautious factual tone. Define low/medium/high risk anchors and cite sections. Example: “§1 | Payment | pay invoice | 15 calendar days | …”. Preserve relative deadlines and mark missing information as unstated.',
    ],
  },
};
