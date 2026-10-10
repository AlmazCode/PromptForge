'use strict';

import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function go(page, path) {
  await page.goto(path); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await expect(page.locator('#app-status')).toBeHidden();
}
const signup = name => ({ email:`competition-${crypto.randomUUID()}@example.com`, full_name:name, password:'Practice!123', password_confirm:'Practice!123', interest_area:'copywriting', level:'beginner', accept_rules:true, accept_privacy:true, leaderboard_visible:true });
async function check(page, prompt, score) {
  await page.locator('#prompt-input').fill(prompt); await page.locator('#submit-btn').click();
  await expect(page.locator('#final-score')).toHaveText(score);
}

test('real participants compete on best scores; goals, private names, voluntary participation and result rewards stay consistent', async ({ page, browser }) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let evaluations=0;page.on('request',request=>{if(request.url().endsWith('/api/evaluate')) evaluations++;});
  const leader=await browser.newContext({baseURL:'http://127.0.0.1:3101'});
  const rival=await browser.newContext({baseURL:'http://127.0.0.1:3101'});
  try {
    for(const [context,name,ids] of [[leader,'Training Leader',['t001','t002']],[rival,'<img src=x onerror="window.__rankingExecuted=1">',['t001']]]) {
      expect((await context.request.post('/api/register',{data:signup(name)})).ok()).toBeTruthy();
      for(const taskId of ids) expect((await context.request.post('/api/evaluate',{data:{taskId,prompt:'Competition test fixture.',requestId:crypto.randomUUID()}})).ok()).toBeTruthy();
    }
    await go(page,'/leaderboard.html');await page.locator('#ranking-personal a[href^="register"]').click();
    await page.locator('#register-name').fill('Progress'); // This display name must never be translated.
    await page.locator('#register-email').fill(`viewer-${crypto.randomUUID()}@example.com`);
    await page.locator('#register-interest').selectOption('copywriting');
    await page.locator('#register-password').fill('Practice!123');await page.locator('#register-password-confirm').fill('Practice!123');
    await page.locator('#register-accept-rules').check();await page.locator('#register-accept-privacy').check();
    await expect(page.locator('#register-ranking-visible')).not.toBeChecked();
    await page.locator('#register-submit').click();await expect(page.locator('#register-success a')).toHaveText('View leaderboard');
    await page.locator('#register-success a').click();await expect(page.locator('#ranking-join')).toBeVisible();
    await page.locator('#ranking-join').click();await expect(page.locator('#ranking-personal h2')).toHaveText('Your first result puts you on the board');
    await page.locator('#ranking-personal .btn-primary').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');
    await check(page,'TRAINING_FIXTURE_LOW\nWrite a LinkedIn post.','4.80');
    await expect(page.locator('#result-earned-points')).toHaveText('Personal best: +4.80 points to your total.');
    await go(page,'/leaderboard.html');await expect(page.locator('#ranking-your-place')).toHaveText('#3');
    await expect(page.locator('#ranking-next-target')).toHaveText('3.20 more points to reach place 2.');
    await go(page,'/');await expect(page.locator('.training-goal .goal-value')).toHaveText(['1','0 / 3','45.20 pts']);
    await go(page,'/task.html?id=t001');await check(page,'TRAINING_FIXTURE_HIGH\nAct as a copywriter. Write a concise post for remote teams.','8.15');
    await expect(page.locator('#result-earned-points')).toHaveText('Personal best: +3.35 points to your total.');
    await go(page,'/');await expect(page.locator('.training-goal .goal-value')).toHaveText(['1','1 / 3','41.85 pts']);
    await go(page,'/leaderboard.html');await expect(page.locator('#ranking-your-place')).toHaveText('#2');
    await expect(page.locator('#ranking-next-target')).toHaveText('7.85 more points to reach place 1.');
    await expect(page.locator('#ranking-body .is-you .participant-name')).toHaveText('Progress');
    await expect(page.locator('#ranking-body img')).toHaveCount(0);
    expect(await page.evaluate(()=>window.__rankingExecuted)).toBeUndefined();
    expect((await rival.request.patch('/api/profile',{data:{name:'Test Participant'}})).ok()).toBeTruthy();
    await page.locator('#ranking-refresh').click();
    await expect(page.locator('#ranking-body')).toContainText('Test Participant');
    await mkdir('screenshots/competition',{recursive:true});
    for(const locale of ['en','ru','kk']) {
      await page.locator(`[data-language="${locale}"]`).click();
      for(const width of [320,375,768,1200,1280,1440]) {
        await page.setViewportSize({width,height:900});
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${locale} ranking at ${width}`).toBeTruthy();
      }
      await expect(page.locator('#ranking-body .is-you .participant-name')).toHaveText('Progress');
    }
    await page.locator('[data-language="ru"]').click();
    await page.screenshot({path:'screenshots/competition/ranking-desktop.png',fullPage:true});
    await page.setViewportSize({width:375,height:900});await page.screenshot({path:'screenshots/competition/ranking-phone.png',fullPage:true});
    await go(page,'/');await page.screenshot({path:'screenshots/competition/goals-phone.png',fullPage:true});
    await page.locator('[data-language="en"]').click();
    await go(page,'/task.html?id=t001');await check(page,'TRAINING_FIXTURE_LOWER\nWrite another post.','6.00');
    await expect(page.locator('#result-earned-points')).toHaveText('Your best saved score still counts. Try improving one criterion.');
    await expect(page.locator('#task-quota')).toContainText('7 of 10');
    await go(page,'/leaderboard.html');await page.getByRole('link',{name:'Leaderboard settings',exact:true}).click();
    await expect(page.locator('#settings-panel-privacy')).toBeVisible();await page.locator('#profile-ranking-visible').uncheck();
    await page.getByRole('button',{name:'Save privacy settings',exact:true}).click();
    await expect(page.locator('#settings-privacy-form')).toContainText('Your privacy settings are saved.');
    await go(page,'/leaderboard.html');await expect(page.locator('#ranking-join')).toBeVisible();await expect(page.locator('#ranking-body .is-you')).toHaveCount(0);
    await go(page,'/progress.html');await expect(page.locator('#leaderboard-total-points')).toHaveText('8.15 pts');
    expect(evaluations).toBe(3);expect(errors).toEqual([]);
  } finally {await leader.close();await rival.close();}
});

test('ranking distinguishes a failed load from an empty board and appends globally ranked pages', async ({ page }) => {
  // Synthetic rows exist only in this browser boundary test, never in production data.
  let fail=true;
  await page.route('**/api/leaderboard?*',async route=>{
    if(fail) {await route.fulfill({status:503,json:{message:'The service is unavailable. Try again later.'}});return;}
    const offset=Number(new URL(route.request().url()).searchParams.get('offset'));
    const rows=Array.from({length:26},(_,index)=>({name:`Browser fixture ${index+1}`,points:100-index,checked:16,mastered:8,tier:'Master',rank:index+1,isYou:false}));
    await route.fulfill({json:{rows:rows.slice(offset,offset+25),total:26,viewer:null,nextTarget:null,nextOffset:offset===0?25:null}});
  });
  await go(page,'/leaderboard.html');await expect(page.locator('#ranking-error')).toBeVisible();
  await expect(page.locator('#ranking-empty')).toBeHidden();await expect(page.locator('#ranking-count')).toHaveText('Ranking unavailable. Refresh to try again.');
  fail=false;await page.locator('#ranking-refresh').click();await expect(page.locator('#ranking-body tr')).toHaveCount(25);
  await expect(page.locator('#ranking-error')).toBeHidden();await page.locator('#ranking-more').click();
  await expect(page.locator('#ranking-body tr')).toHaveCount(26);await expect(page.locator('#ranking-body tr').last().locator('.ranking-position')).toHaveText('#26');
  await expect(page.locator('#ranking-more')).toBeHidden();
});
