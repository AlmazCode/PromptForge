'use strict';

// Original practice inputs. None requires external documents or invented facts.
export const exercises = {
  t001: {
    input: 'Product: SprintNote, a team notes app.\nNew feature: turns meeting notes into assigned action items.\nAudience: small remote product teams.\nAvailable today on all existing plans. No performance claims have been measured.',
    requirements: ['Assign a B2B copywriter role and name the audience.', 'Ask for one LinkedIn post, at most 120 words, with 2–3 hashtags.', 'Use a professional, approachable tone and one clear call to action.', 'Include a sample opening. Do not invent customer quotes or metrics.'],
    hint: 'Give the product facts, audience, output shape and a sample hook. Explicitly prohibit unsupported claims.',
    examples: ['You are a B2B copywriter. Using only the SprintNote facts below, write one friendly LinkedIn post for remote product teams. Keep it under 120 words, include 2–3 relevant hashtags and invite readers to try action items. Sample opening: “Meeting finished. Next steps assigned.” Do not invent results or testimonials. Facts: SprintNote turns meeting notes into assigned action items and is available today on all existing plans.', 'Act as SprintNote’s product marketer. Draft a professional LinkedIn announcement, maximum 120 words, for small remote product teams. Start with a practical meeting problem, explain the new notes-to-action-items feature, finish with one CTA and two hashtags. Example CTA: “Open your next meeting note and try action items.” Use only the supplied feature facts.']
  },
  t002: {
    input: 'month,revenue_usd,orders,top_product,region\nJul,142000,1840,Widget Pro A,NA\nAug,158000,2100,Widget Pro A,EU\nSep,135000,1720,Widget Lite B,APAC\n\nQuarter revenue: 435000 USD. Quarter orders: 5660.\nSeptember revenue is 14.6% below August.',
    requirements: ['Assign a data analyst role.', 'Request a numbered list with at most five items and 150 words.', 'Include totals, the strongest month and the August-to-September change.', 'Use a concise professional tone; include one example item and prohibit unsupported causes.'],
    hint: 'Keep source data separate from instructions. Specify the five-item/150-word limits and show one factual sample item.',
    examples: ['You are a data analyst. Summarize the supplied Q3 CSV in at most five numbered items and 150 words. Use a concise professional tone. Include total revenue and orders, the strongest month and the August–September revenue change. Do not invent causes. Example item: “Q3 revenue totals $435,000.” Data: Jul $142,000 / 1,840 orders; Aug $158,000 / 2,100; Sep $135,000 / 1,720.', 'Act as a financial reporting analyst. Produce a factual executive summary of this sales dataset in a numbered list of no more than five items, under 150 words. Report totals, identify August as the peak and quantify the decline to September. Be professional and concise. Example: “August recorded 2,100 orders.” Treat product and region as labels, not proven causes. Use the supplied CSV only.']
  },
  t003: {
    input: 'Brand: Northstar stationery. Policy: unused items can be returned within 30 days with an order ID. Damaged items need human review. Never request full card numbers. Escalate threats, disputed refunds and missing orders. The assistant cannot issue refunds itself.',
    requirements: ['Write a support chatbot system instruction with role and scope.', 'Use headings for policy, privacy, escalation and response format; maximum 500 words.', 'Handle eligible returns, late returns and damaged items without promising an issued refund.', 'Set a calm brand tone and include two example interactions.'],
    hint: 'Separate permitted assistance from decisions requiring a human. Include an uncertainty/escalation rule.',
    examples: ['You are a support-system designer. Write a system instruction under 500 words for Northstar’s calm, helpful support assistant. Use Role, Returns, Privacy, Escalation and Reply Format headings. Apply only the supplied 30-day unused-item policy; damaged items, disputes and missing orders go to humans. Never collect full card numbers or claim to issue refunds. Include two short examples, such as an eligible return request and a damaged parcel.']
  },
  t004: {
    input: 'Build POST /notes in Python FastAPI. JSON input: title (1–100 nonblank characters), body (1–2000 characters). Successful response: 201 and {id,title,body}. Use in-memory storage for the example. Invalid input: 422. No authentication or database is required for this exercise.',
    requirements: ['Assign a Python API engineer role.', 'Request runnable code and pytest tests in separate code blocks, explanation under 150 words.', 'Specify validation, status codes and the in-memory scope.', 'Use a precise technical tone and include a sample request/response.'],
    hint: 'Ask for edge-case tests and make the nonpersistent scope explicit.',
    examples: ['Act as a Python API engineer. Generate a minimal FastAPI POST /notes implementation and pytest tests in separate labeled code blocks. Follow the supplied title/body limits, reject blank titles, return 201 with id/title/body, and 422 for invalid input. Use in-memory storage only. Keep the technical explanation under 150 words. Example request: {"title":"Plan","body":"Write tests"}. Include tests for success, blank title and oversized body.']
  },
  t005: {
    input: '# Create a note\nSend `POST /notes` with a JSON body.\n```json\n{"title":"Plan","body":"Write tests"}\n```\nA successful request returns HTTP 201. Invalid input returns HTTP 422.\nTerminology: note = ノート; request = リクエスト; response = レスポンス.',
    requirements: ['Assign a Japanese technical translator role.', 'Return Markdown, preserving code blocks, endpoint names and status codes exactly.', 'Translate all prose; add no commentary and keep any translator note under 30 words.', 'Use a formal technical tone and demonstrate one terminology mapping.'],
    hint: 'Distinguish text that may be translated from identifiers that must remain unchanged.',
    examples: ['You are an English-to-Japanese technical translator. Translate the supplied documentation into formal Japanese Markdown. Preserve every code block, endpoint, JSON key and HTTP status code exactly. Follow the glossary, for example “request” → “リクエスト”. Return only the translated page, with no extra explanation; if essential, a translator note must be under 30 words.']
  },
  t006: {
    input: 'Audience: adults working from home. Product constraints: no medical diagnosis, no camera required, optional wearable integration. Budget: small bootstrapped team. Ideas must differ in their central user problem.',
    requirements: ['Assign a product strategist role.', 'Request exactly ten numbered ideas with audience, key feature and monetization fields.', 'Limit each idea to 60 words.', 'Use an imaginative but practical tone, include one sample entry and avoid medical claims.'],
    hint: 'Define what makes ideas distinct and require comparable fields for every idea.',
    examples: ['Act as a pragmatic product strategist. Generate ten distinct AI fitness-app ideas for adults working from home, using the supplied constraints. Return numbered entries with audience, key feature and monetization, maximum 60 words per idea. Be creative but practical; no medical diagnosis or guaranteed outcomes. Sample structure: “Desk Breaks | remote workers | optional movement reminders | freemium”. Avoid ten cosmetic variations of the same idea.']
  },
  t007: {
    input: '10:00 Maya: Launch moved to October 22.\n10:20 Ilya: I will finish accessibility fixes by October 15.\n11:00 Nora: Support needs an FAQ; I will draft it by October 18.\n11:45 Maya: No decision on pricing yet.\n12:30 Ilya: The analytics dashboard stays out of the first release.\n13:00 Maya: I own the final release checklist, due October 20.',
    requirements: ['Assign a meeting secretary role.', 'Request at most eight bullets labeled Decision, Action or Open question.', 'Use at most 180 words and include owners/deadlines when stated.', 'Keep a neutral factual tone; include a sample bullet and mark missing information rather than inventing it.'],
    hint: 'Distinguish a confirmed decision from an unresolved question. The supplied excerpt is the entire exercise input.',
    examples: ['You are a meeting secretary. Compress the supplied transcript excerpt into at most eight bullets and 180 words. Label each bullet Decision, Action or Open question. Use a neutral factual tone, preserve named owners and dates, and mark unstated owners or deadlines as “not stated”. Example: “Action — Ilya: accessibility fixes, October 15.” Do not turn the unresolved pricing question into a decision.']
  },
  t008: {
    input: 'Review A: The Trail Cup costs $18. I rate it 4/5. It keeps drinks warm, but the lid is hard to clean. I recommend it for day trips.\nReview B: Desk Lamp Mini is bright and compact, but the hinge feels loose. Price and numeric rating were not provided.',
    requirements: ['Assign a structured-data extraction role.', 'Return a JSON array only with name, price, rating, pros, cons and recommendation.', 'Use null for missing price/rating/recommendation; at most five entries in pros/cons.', 'Keep wording factual and compact, provide one schema example and never infer missing facts.'],
    hint: 'Define null handling and data types explicitly. A missing recommendation is not a negative recommendation.',
    examples: ['You are a structured-data extractor. Convert the supplied reviews into a JSON array only. Each object has name:string, price:number|null, rating:number|null, pros:string[], cons:string[], recommendation:boolean|null. Keep pros/cons factual and at most five entries each. Never infer unstated values. Example shape: {"name":"Example","price":null,"rating":null,"pros":[],"cons":[],"recommendation":null}. Preserve the stated 4/5 rating as 4.']
  },
  t009: {
    input: 'Role: backend engineer with 3 years of experience. Topics: HTTP, SQL indexes, concurrency and debugging. Session: four questions. Do not ask for sensitive personal information. Assess answers, not demographic traits.',
    requirements: ['Assign a senior technical interviewer role.', 'Ask one question at a time and wait; use four questions total.', 'After the final answer, return a rubric table and feedback under 200 words.', 'Use a respectful challenging tone; include one example question and define scoring anchors.'],
    hint: 'Specify turn-taking and when the assessment should appear, not just a list of interview questions.',
    examples: ['Act as a respectful senior backend interviewer for the supplied candidate profile. Ask four questions covering HTTP, SQL indexes, concurrency and debugging, one per turn, waiting for the candidate each time. Example: “When would an index slow down writes?” After answer four, give a table with correctness and reasoning scored 0–5 using clear anchors, then actionable feedback under 200 words. Do not ask sensitive personal questions or infer demographic traits.']
  },
  t010: {
    input: 'Product: SprintNote team notes. Trial: 14 days. Features: shared notes, action items, search and exports. No credit card is required for the trial. Do not claim an integration or discount that is not listed.',
    requirements: ['Assign a SaaS lifecycle copywriter role.', 'Return five emails with day, subject, body and one CTA.', 'Limit each body to 90 words and subject to 50 characters.', 'Use a helpful, nonpushy tone and show one example CTA; avoid unsupported urgency.'],
    hint: 'Give each email a distinct purpose: start, collaborate, act, find information and review the trial.',
    examples: ['You are a SaaS lifecycle copywriter. Write a helpful five-email SprintNote trial sequence using only the supplied facts. For each email give day, subject (max 50 characters), body (max 90 words) and one CTA. Progress from first note to collaboration, action items, search/exports and trial review. Example CTA: “Create your first shared note”. Avoid invented integrations, discounts and false urgency.']
  },
  t011: {
    input: 'Store entities: customers (unique email), products (SKU, price in minor currency units), orders (customer, status, timestamp), order_items (order, product, quantity, price snapshot). Order item quantity must be positive. Preserve historical prices. Use PostgreSQL 16 syntax.',
    requirements: ['Assign a PostgreSQL database engineer role.', 'Return up/down migrations, indexes and seed SQL in labeled code blocks.', 'Explain design tradeoffs in at most 200 words.', 'Use a precise technical tone, include one example order and define keys, constraints and deletion behavior.'],
    hint: 'The price on an order item must not change when the current product price changes.',
    examples: ['Act as a PostgreSQL engineer. Design the supplied store schema using PostgreSQL 16. Return labeled up migration, down migration, indexes and seed SQL blocks, followed by at most 200 words of technical rationale. Define keys, positive quantity and nonnegative price constraints, unique email/SKU and deletion behavior. Preserve order-item price snapshots. Include one seeded customer, product and order with an item. Example: quantity 2 at 1500 minor units per item.']
  },
  t012: {
    input: 'month,revenue_2025,revenue_2026\nJan,10000,12000\nFeb,11000,12100\nMar,9000,18000\nApr,12000,12600\n\nAll amounts are USD. No information about campaigns or causes is provided.',
    requirements: ['Assign a business analyst role.', 'Return a short report with Trends, Outliers and Year-over-year headings.', 'Keep the full report under 200 words.', 'Use a neutral professional tone, include an example percentage calculation and distinguish observations from causes.'],
    hint: 'Require the formula (new − old) / old × 100 and forbid explanations unsupported by the CSV.',
    examples: ['You are a business analyst. Interpret the supplied USD CSV in under 200 words using Trends, Outliers and Year-over-year headings. Use a neutral professional tone. Calculate percentage changes as (2026−2025)/2025×100; example: January (12000−10000)/10000×100 = 20%. Highlight March without inventing a cause or claiming statistical significance from four observations. Use only the supplied data.']
  },
  t013: {
    input: 'Pipeline: Researcher → Writer → Editor. Input: a supplied facts document and target audience. Output: a 400-word article. No agent has browsing access. Editor can request one revision; unresolved factual uncertainty must be marked, not fabricated.',
    requirements: ['Assign a workflow architect role.', 'Return three agent instructions and a JSON handoff schema.', 'Keep the workflow specification under 600 words; final article target is 400 words.', 'Use a precise operational tone, include an example handoff and define quality gates and stop conditions.'],
    hint: 'Specify what each agent receives, produces and checks, including the one-revision limit.',
    examples: ['Act as a workflow architect. Design Researcher, Writer and Editor instructions plus a JSON handoff schema for the supplied article pipeline. Keep the specification under 600 words and target a 400-word article. Be operational and precise. Researcher uses only supplied facts; Writer cites fact IDs; Editor checks factual support and audience fit, permitting one revision. Example handoff: {"fact_ids":["F1"],"uncertainties":[]}. Define stop conditions and mark unresolved facts; no browsing or fabrication.']
  },
  t014: {
    input: 'Fictional tools for comparison:\nDraftFox: $12/month, 8 templates, no team seats, offline export.\nWordHarbor: $20/month, 15 templates, 3 team seats, no offline export.\nInkPilot: $9/month, 5 templates, 1 seat, offline export.\nThese are exercise facts, not real market claims. No market-share data is supplied.',
    requirements: ['Assign a product analyst role.', 'Return a comparison table and SWOT entries for all three fictional tools.', 'Limit each SWOT quadrant to two bullets; total under 400 words.', 'Use an evidence-based neutral tone; show one example evidence citation and mark unavailable market data.'],
    hint: 'Separate supplied quantitative facts from hypothetical opportunities and threats.',
    examples: ['You are a product analyst. Compare the three fictional writing tools using only the supplied facts. Return a feature/price table and SWOT for each, with at most two bullets per quadrant and 400 words total. Use a neutral evidence-based tone. Example evidence: “DraftFox: $12/month (supplied facts)”. Label opportunities/threats as hypotheses and market share as unknown; do not invent positioning statistics.']
  },
  t015: {
    input: 'Practice contract excerpt:\n§1 Payment: customer pays within 15 calendar days of invoice.\n§2 Renewal: term renews for 12 months unless written cancellation arrives 30 days before expiry.\n§3 Liability: supplier liability is capped at fees paid during the preceding month.\n§4 Confidentiality: both parties protect confidential information for 2 years after termination.\nThis excerpt is the complete input for this exercise.',
    requirements: ['Assign a contract-review assistant role; do not present legal advice.', 'Return a table: section, clause type, obligation, deadline, risk, rationale.', 'Keep each rationale under 35 words and the summary under 300 words.', 'Use a cautious factual tone, include a sample row and define low/medium/high risk anchors.'],
    hint: 'Use section references and relative deadlines exactly; do not invent dates or missing contract clauses.',
    examples: ['Act as a contract-review assistant, providing an educational summary rather than legal advice. Use only the supplied excerpt. Return a table with section, clause type, obligation, deadline, risk and rationale; rationales under 35 words and total under 300 words. Use a cautious factual tone. Define low/medium/high risk anchors and cite sections. Example: “§1 | Payment | pay invoice | 15 calendar days | …”. Preserve relative deadlines and mark missing information as unstated.']
  },
  t016: {
    input: 'Shop: Northstar stationery. Support may explain tracking and return policy but cannot change orders or issue refunds. Returns: unused items within 30 days with order ID. Escalate damaged orders, disputed payments and threats. Never request full card numbers or passwords.',
    requirements: ['Assign a friendly support-agent persona.', 'Use a response structure: acknowledge, clarify, offer next step.', 'Keep each reply under 100 words.', 'Use empathetic language, include one sample complaint/reply and explain when to escalate without promising a refund.'],
    hint: 'Empathy should lead to a practical next step within the agent’s actual permissions.',
    examples: ['You are Northstar’s friendly customer support assistant. Use only the supplied shop policy. Respond in under 100 words with acknowledgement, any necessary clarification and one next step. Be empathetic; never request passwords or full card numbers. Escalate damaged orders, disputed payments and threats. You cannot change orders or issue refunds. Example: Customer: “My notebook arrived damaged.” Assistant: “I’m sorry it arrived damaged. Please share your order ID so our support team can review the next step.”']
  }
};
