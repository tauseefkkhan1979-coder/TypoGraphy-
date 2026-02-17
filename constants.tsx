
import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Home Row Basics',
    description: 'Learn the primary keys: a, s, d, f and j, k, l, ;',
    content: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; a s d f j k l ; a s d f j k l ;',
    level: 'Beginner',
    category: 'Home Row'
  },
  {
    id: 'l2',
    title: 'Top Row Mastery',
    description: 'Expanding to q, w, e, r, t and y, u, i, o, p',
    content: 'qwert yuiop qwert yuiop q w e r t y u i o p qwert yuiop qwert yuiop',
    level: 'Beginner',
    category: 'Top Row'
  },
  {
    id: 'l3',
    title: 'Full Home Row sentences',
    description: 'Simple phrases using only the home row keys.',
    content: 'sad dad falls. glass flasks. alfalfa salads. salsa fall. add dad.',
    level: 'Beginner',
    category: 'Home Row'
  },
  {
    id: 'l4',
    title: 'Bottom Row Introduction',
    description: 'The keys z, x, c, v, b and n, m, comma, period',
    content: 'zxcvb nm,. zxcvb nm,. z x c v b n m , . / zxcvb nm,. zxcvb nm,.',
    level: 'Beginner',
    category: 'Bottom Row'
  },
  {
    id: 'test-1',
    title: 'Classic Literature',
    description: 'A paragraph from a famous novel.',
    content: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.',
    level: 'Intermediate',
    category: 'Advanced'
  }
];

export const TEST_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet.",
  "Programming is the art of telling another human what one wants the computer to do. Efficient code is beautiful and readable.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Progress is steady and focused.",
  "In the world of technology, change is the only constant. Staying adaptable is the key to long-term success in any field.",
  "Quantum computing leverages the principles of quantum mechanics to process information in ways that classical computers cannot."
];
