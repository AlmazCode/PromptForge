'use strict';

export const AVATAR_BYTES = 100 * 1024;
export const AVATAR_SIZE = 256;

// Accept only the bounded JPEG thumbnails produced by the profile editor.
// Marker lengths and dimensions are checked independently of the request MIME type.
export function validAvatar(data) {
  if (data.length < 20 || data.length > AVATAR_BYTES || data.readUInt16BE(0) !== 0xffd8 || data.readUInt16BE(data.length - 2) !== 0xffd9) return false;
  let offset = 2; let frame = false;
  while (offset + 4 <= data.length) {
    if (data[offset++] !== 0xff) return false;
    while (data[offset] === 0xff) offset++;
    const marker = data[offset++];
    if (offset + 2 > data.length) return false;
    const length = data.readUInt16BE(offset);
    if (length < 2 || offset + length > data.length) return false;
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (length < 11 || data[offset + 2] !== 8 || data.readUInt16BE(offset + 3) !== AVATAR_SIZE || data.readUInt16BE(offset + 5) !== AVATAR_SIZE) return false;
      const components = data[offset + 7];
      if (![1, 3].includes(components) || length !== 8 + 3 * components) return false;
      frame = true;
    }
    if (marker === 0xda) return frame && length >= 6 && offset + length < data.length - 2;
    offset += length;
  }
  return false;
}
