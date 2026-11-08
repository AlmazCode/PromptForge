import { writing } from './exercises/writing.js';
import { data } from './exercises/data.js';
import { technical } from './exercises/technical.js';
import { conversation } from './exercises/conversation.js';

export const exercises = { ...writing, ...data, ...technical, ...conversation };
