'use strict';

// The deterministic evaluator exists only in the browser-test server, never in the app runtime.
import { createApp } from '../server/app.js';
import { rubric } from '../js/logic.js';

const { server } = createApp({ root: '.', database: ':memory:', demoBilling: true, apiKey: 'browser-test-only', model: 'test-fixture',
  evaluate: async ({ prompt }) => {
    const grades = prompt.startsWith('TRAINING_FIXTURE_LOW\n') ? [4, 4, 8, 4, 6, 4]
      : prompt.startsWith('TRAINING_FIXTURE_HIGH\n') ? [9, 9, 6, 8, 8, 8]
      : prompt.startsWith('TRAINING_FIXTURE_LOWER\n') ? [6, 6, 6, 6, 6, 6] : [8, 8, 8, 8, 8, 8];
    return { criteria: Object.fromEntries(rubric.map((item, index) => [item.id, { score: grades[index], feedback: `Improve ${item.name.toLowerCase()} with a concrete instruction.` }])), summary: 'Test fixture feedback. This is not a live AI result.' };
  } });
server.listen(3101, '127.0.0.1');
