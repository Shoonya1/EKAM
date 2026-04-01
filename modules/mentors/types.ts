/**
 * Mentors Module — Type Definitions
 * Personal wisdom library: mentors, books, ideas, recommendations
 */

export type MentorCategory =
  | 'Productivity'
  | 'Business'
  | 'Philosophy'
  | 'Health'
  | 'Spirituality'
  | 'Science'
  | 'Finance'
  | 'Leadership';

export const MENTOR_CATEGORIES: MentorCategory[] = [
  'Productivity',
  'Business',
  'Philosophy',
  'Health',
  'Spirituality',
  'Science',
  'Finance',
  'Leadership',
];

export interface Book {
  title: string;
  year: number;
}

export interface Recommendation {
  type: 'podcast' | 'book' | 'video' | 'article' | 'tool' | 'course';
  item: string;
}

export interface Mentor {
  id: string;
  name: string;
  tagline: string;
  avatarInitials: string;
  colorHex: string;
  category: MentorCategory;
  isCustom: boolean;
  books: Book[];
  ideas: string[];
  recommendations: Recommendation[];
}

export const RECOMMENDATION_TYPE_LABELS: Record<Recommendation['type'], string> = {
  podcast: 'Podcast',
  book: 'Book',
  video: 'Video',
  article: 'Article',
  tool: 'Tool',
  course: 'Course',
};

export const CATEGORY_COLORS: Record<MentorCategory, string> = {
  Productivity: '#48BFE3',
  Business: '#F59E0B',
  Philosophy: '#9D4EDD',
  Health: '#10B981',
  Spirituality: '#F2C35B',
  Science: '#ADCBDA',
  Finance: '#FF6B6B',
  Leadership: '#FAB0FF',
};
