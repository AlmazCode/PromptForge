'use strict';

import { tasks } from '../js/data.js';
import { masteryScore, skillTiers } from '../js/logic.js';

export function readLeaderboard(db, viewerId, offset = 0, limit = 25) {
  // Aggregate only saved best scores, never subscription status or attempt counts.
  // Private prompts and evaluator feedback never leave this query.
  const totals = db.prepare(`
    WITH best AS (
      SELECT a.user_id, a.task_id, MAX(CAST(json_extract(a.result, '$.score') AS REAL)) AS score
      FROM attempts a JOIN users u ON u.id = a.user_id
      WHERE u.leaderboard_visible = 1 AND a.task_id IN (${tasks.map(() => '?').join(',')})
      GROUP BY a.user_id, a.task_id
    )
    SELECT u.id, u.name, ROUND(SUM(b.score), 2) AS points,
      COUNT(*) AS checked, SUM(CASE WHEN b.score >= ? THEN 1 ELSE 0 END) AS mastered
    FROM best b JOIN users u ON u.id = b.user_id
    GROUP BY u.id ORDER BY points DESC, u.created_at ASC, u.id ASC
  `).all(...tasks.map(task => task.id), masteryScore);
  let rank = 0;
  const ranked = totals.map((row, index) => {
    if (index === 0 || row.points !== totals[index - 1].points) rank = index + 1;
    return { name: row.name, points: row.points, checked: row.checked, mastered: row.mastered,
      tier: [...skillTiers].reverse().find(tier => row.points >= tier.min).name,
      rank, isYou: row.id === viewerId };
  });
  const viewer = ranked.find(row => row.isYou) || null;
  const above = viewer ? [...ranked].reverse().find(row => row.points > viewer.points) : null;
  return { rows: ranked.slice(offset, offset + limit), total: ranked.length, viewer,
    nextTarget: above ? { rank: above.rank, points: above.points, gap: Math.round((above.points - viewer.points) * 100) / 100 } : null,
    nextOffset: offset + limit < ranked.length ? offset + limit : null };
}
