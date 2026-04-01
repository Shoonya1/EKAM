/**
 * Mentors Module — Seed Data
 * Pre-populated public mentors for the wisdom library
 */

import { Mentor } from './types';

export const SEED_MENTORS: Mentor[] = [
  {
    id: 'naval',
    name: 'Naval Ravikant',
    tagline: 'Angel philosopher. Seek wealth, not money.',
    avatarInitials: 'NR',
    colorHex: '#9D4EDD',
    category: 'Philosophy',
    isCustom: false,
    books: [
      { title: 'The Almanack of Naval Ravikant', year: 2020 },
      { title: 'How to Get Rich (without getting lucky)', year: 2019 },
    ],
    ideas: [
      'Specific knowledge is found by pursuing your genuine curiosity, not by following whatever is hot right now.',
      'The three big decisions in life: where you live, who you are with, and what you do.',
      'Desire is a contract you make with yourself to be unhappy until you get what you want.',
      'Read what you love until you love to read.',
    ],
    recommendations: [
      { type: 'podcast', item: 'Naval on The Joe Rogan Experience #1309' },
      { type: 'podcast', item: 'Naval on The Tim Ferriss Show' },
      { type: 'article', item: 'How to Get Rich — Naval\'s Tweetstorm' },
    ],
  },
  {
    id: 'ferriss',
    name: 'Tim Ferriss',
    tagline: 'World-class performer decoder. Design your life.',
    avatarInitials: 'TF',
    colorHex: '#48BFE3',
    category: 'Productivity',
    isCustom: false,
    books: [
      { title: 'The 4-Hour Workweek', year: 2007 },
      { title: 'Tools of Titans', year: 2016 },
      { title: 'Tribe of Mentors', year: 2017 },
    ],
    ideas: [
      'What we fear doing most is usually what we most need to do.',
      'Focus on being productive instead of busy.',
      'The question you should be asking isn\'t "What do I want?" but "What would excite me?"',
      'A person\'s success in life can be measured by the number of uncomfortable conversations they are willing to have.',
    ],
    recommendations: [
      { type: 'podcast', item: 'The Tim Ferriss Show' },
      { type: 'tool', item: '5-Bullet Friday Newsletter' },
      { type: 'video', item: 'TED Talk: Smash Fear, Learn Anything' },
    ],
  },
  {
    id: 'dalio',
    name: 'Ray Dalio',
    tagline: 'Principles-driven investor. Radical transparency.',
    avatarInitials: 'RD',
    colorHex: '#FF6B6B',
    category: 'Finance',
    isCustom: false,
    books: [
      { title: 'Principles: Life and Work', year: 2017 },
      { title: 'Principles for Dealing with the Changing World Order', year: 2021 },
      { title: 'Big Debt Crises', year: 2018 },
    ],
    ideas: [
      'Pain plus reflection equals progress.',
      'He who lives by the crystal ball will eat shattered glass.',
      'If you\'re not failing, you\'re not pushing your limits.',
      'Radical open-mindedness is motivated by the genuine worry that you might not be seeing your choices optimally.',
    ],
    recommendations: [
      { type: 'video', item: 'How The Economic Machine Works (30 min)' },
      { type: 'article', item: 'Principles Summary on principles.com' },
      { type: 'tool', item: 'Bridgewater Daily Observations' },
    ],
  },
  {
    id: 'clear',
    name: 'James Clear',
    tagline: 'Atomic habits architect. 1% better every day.',
    avatarInitials: 'JC',
    colorHex: '#F59E0B',
    category: 'Productivity',
    isCustom: false,
    books: [
      { title: 'Atomic Habits', year: 2018 },
    ],
    ideas: [
      'You do not rise to the level of your goals. You fall to the level of your systems.',
      'Every action you take is a vote for the type of person you wish to become.',
      'Habits are the compound interest of self-improvement.',
      'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
    ],
    recommendations: [
      { type: 'article', item: 'jamesclear.com/articles — Weekly Newsletter' },
      { type: 'video', item: 'Atomic Habits Summary — YouTube' },
      { type: 'tool', item: 'Habits Scorecard Template' },
    ],
  },
  {
    id: 'sadhguru',
    name: 'Sadhguru',
    tagline: 'Inner engineering. Consciousness over compulsion.',
    avatarInitials: 'SG',
    colorHex: '#F2C35B',
    category: 'Spirituality',
    isCustom: false,
    books: [
      { title: 'Inner Engineering', year: 2016 },
      { title: 'Karma: A Yogi\'s Guide to Crafting Your Destiny', year: 2021 },
      { title: 'Death: An Inside Story', year: 2020 },
    ],
    ideas: [
      'The sign of intelligence is that you are constantly wondering. Idiots are always dead sure about everything.',
      'If you resist change, you resist life.',
      'The only thing that stands between you and your well-being is a simple fact: you have allowed your thoughts and emotions to take instruction from the outside rather than the inside.',
    ],
    recommendations: [
      { type: 'course', item: 'Inner Engineering Online Program' },
      { type: 'video', item: 'Sadhguru at Google — Don\'t be a slave to your body' },
      { type: 'podcast', item: 'Sadhguru on Impact Theory' },
    ],
  },
  {
    id: 'huberman',
    name: 'Andrew Huberman',
    tagline: 'Neuroscience-backed protocols for mind and body.',
    avatarInitials: 'AH',
    colorHex: '#10B981',
    category: 'Health',
    isCustom: false,
    books: [
      { title: 'Protocols: An Operating Manual for the Human Body', year: 2024 },
    ],
    ideas: [
      'Morning sunlight exposure is the single most powerful tool for setting your circadian rhythm.',
      'Non-sleep deep rest (NSDR) is the most underutilized tool for mental and physical restoration.',
      'Dopamine is not about pleasure — it is about motivation and pursuit.',
      'Cold exposure triggers norepinephrine release: 2.5x sustained increase in dopamine.',
    ],
    recommendations: [
      { type: 'podcast', item: 'Huberman Lab Podcast' },
      { type: 'tool', item: 'NSDR Protocol — 10 min YouTube guided session' },
      { type: 'video', item: 'Huberman Lab: Master Your Sleep' },
    ],
  },
  {
    id: 'holiday',
    name: 'Ryan Holiday',
    tagline: 'Modern Stoic. The obstacle is the way.',
    avatarInitials: 'RH',
    colorHex: '#ADCBDA',
    category: 'Philosophy',
    isCustom: false,
    books: [
      { title: 'The Obstacle Is the Way', year: 2014 },
      { title: 'Ego Is the Enemy', year: 2016 },
      { title: 'Stillness Is the Key', year: 2019 },
    ],
    ideas: [
      'The impediment to action advances action. What stands in the way becomes the way.',
      'You are only entitled to the action, never to its fruits.',
      'Stillness is not about being motionless — it is about being focused, present, and deliberate.',
    ],
    recommendations: [
      { type: 'podcast', item: 'Daily Stoic Podcast' },
      { type: 'book', item: 'Meditations by Marcus Aurelius (Gregory Hays translation)' },
      { type: 'article', item: 'dailystoic.com — Daily Stoic Email' },
    ],
  },
  {
    id: 'buffett',
    name: 'Warren Buffett',
    tagline: 'Value investor. Patience is a competitive advantage.',
    avatarInitials: 'WB',
    colorHex: '#FF7B00',
    category: 'Finance',
    isCustom: false,
    books: [
      { title: 'The Essays of Warren Buffett', year: 1997 },
      { title: 'The Snowball: Warren Buffett and the Business of Life', year: 2008 },
    ],
    ideas: [
      'Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.',
      'Be fearful when others are greedy, and greedy when others are fearful.',
      'The stock market is a device for transferring money from the impatient to the patient.',
      'Price is what you pay. Value is what you get.',
    ],
    recommendations: [
      { type: 'article', item: 'Berkshire Hathaway Annual Shareholder Letters' },
      { type: 'video', item: 'HBO Documentary: Becoming Warren Buffett' },
      { type: 'book', item: 'The Intelligent Investor by Benjamin Graham' },
    ],
  },
];
