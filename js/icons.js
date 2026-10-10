'use strict';

// Decorative icons always accompany a text label or an accessible state.
export function icon(name) {
  const image = document.createElement('img');
  image.src = `src/icons/${name}.svg`;
  image.alt = '';
  image.width = 18;
  image.height = 18;
  image.className = 'ui-icon';
  image.setAttribute('aria-hidden', 'true');
  return image;
}
