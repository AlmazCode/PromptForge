export const technical = {
  t003: {
    input:
      'Brand: Northstar stationery. Policy: unused items can be returned within 30 days with an order ID. Damaged items need human review. Never request full card numbers. Escalate threats, disputed refunds and missing orders. The assistant cannot issue refunds itself.',
    requirements: [
      'Write a support chatbot system instruction with role and scope.',
      'Use headings for policy, privacy, escalation and response format; maximum 500 words.',
      'Handle eligible returns, late returns and damaged items without promising an issued refund.',
      'Set a calm brand tone and include two example interactions.',
    ],
    hint: 'Separate permitted assistance from decisions requiring a human. Include an uncertainty/escalation rule.',
    examples: [
      'You are a support-system designer. Write a system instruction under 500 words for Northstar’s calm, helpful support assistant. Use Role, Returns, Privacy, Escalation and Reply Format headings. Apply only the supplied 30-day unused-item policy; damaged items, disputes and missing orders go to humans. Never collect full card numbers or claim to issue refunds. Include two short examples, such as an eligible return request and a damaged parcel.',
    ],
  },
  t004: {
    input:
      'Build POST /notes in Python FastAPI. JSON input: title (1–100 nonblank characters), body (1–2000 characters). Successful response: 201 and {id,title,body}. Use in-memory storage for the example. Invalid input: 422. No authentication or database is required for this exercise.',
    requirements: [
      'Assign a Python API engineer role.',
      'Request runnable code and pytest tests in separate code blocks, explanation under 150 words.',
      'Specify validation, status codes and the in-memory scope.',
      'Use a precise technical tone and include a sample request/response.',
    ],
    hint: 'Ask for edge-case tests and make the nonpersistent scope explicit.',
    examples: [
      'Act as a Python API engineer. Generate a minimal FastAPI POST /notes implementation and pytest tests in separate labeled code blocks. Follow the supplied title/body limits, reject blank titles, return 201 with id/title/body, and 422 for invalid input. Use in-memory storage only. Keep the technical explanation under 150 words. Example request: {"title":"Plan","body":"Write tests"}. Include tests for success, blank title and oversized body.',
    ],
  },
  t011: {
    input:
      'Store entities: customers (unique email), products (SKU, price in minor currency units), orders (customer, status, timestamp), order_items (order, product, quantity, price snapshot). Order item quantity must be positive. Preserve historical prices. Use PostgreSQL 16 syntax.',
    requirements: [
      'Assign a PostgreSQL database engineer role.',
      'Return up/down migrations, indexes and seed SQL in labeled code blocks.',
      'Explain design tradeoffs in at most 200 words.',
      'Use a precise technical tone, include one example order and define keys, constraints and deletion behavior.',
    ],
    hint: 'The price on an order item must not change when the current product price changes.',
    examples: [
      'Act as a PostgreSQL engineer. Design the supplied store schema using PostgreSQL 16. Return labeled up migration, down migration, indexes and seed SQL blocks, followed by at most 200 words of technical rationale. Define keys, positive quantity and nonnegative price constraints, unique email/SKU and deletion behavior. Preserve order-item price snapshots. Include one seeded customer, product and order with an item. Example: quantity 2 at 1500 minor units per item.',
    ],
  },
  t013: {
    input:
      'Pipeline: Researcher → Writer → Editor. Input: a supplied facts document and target audience. Output: a 400-word article. No agent has browsing access. Editor can request one revision; unresolved factual uncertainty must be marked, not fabricated.',
    requirements: [
      'Assign a workflow architect role.',
      'Return three agent instructions and a JSON handoff schema.',
      'Keep the workflow specification under 600 words; final article target is 400 words.',
      'Use a precise operational tone, include an example handoff and define quality gates and stop conditions.',
    ],
    hint: 'Specify what each agent receives, produces and checks, including the one-revision limit.',
    examples: [
      'Act as a workflow architect. Design Researcher, Writer and Editor instructions plus a JSON handoff schema for the supplied article pipeline. Keep the specification under 600 words and target a 400-word article. Be operational and precise. Researcher uses only supplied facts; Writer cites fact IDs; Editor checks factual support and audience fit, permitting one revision. Example handoff: {"fact_ids":["F1"],"uncertainties":[]}. Define stop conditions and mark unresolved facts; no browsing or fabrication.',
    ],
  },
};
