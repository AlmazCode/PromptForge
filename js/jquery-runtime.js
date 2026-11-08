'use strict';
export async function jqueryReady() {
  if (!window.jQuery) await import('../vendor/jquery/jquery-3.7.1.min.js');
  await new Promise((resolve) => window.jQuery(() => resolve()));
}
