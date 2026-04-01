/**
 * Journal Module — Type Definitions
 * Time-aware journaling system based on 8 Peher time blocks
 */

export type JournalTag = 'work' | 'personal' | 'follow-up' | 'idea' | 'urgent';

export const JOURNAL_TAGS: JournalTag[] = ['work', 'personal', 'follow-up', 'idea', 'urgent'];

export const TAG_COLORS: Record<JournalTag, string> = {
  work: '#48BFE3',
  personal: '#10B981',
  'follow-up': '#F59E0B',
  idea: '#FAB0FF',
  urgent: '#FF7B00',
};

export const TAG_LABELS: Record<JournalTag, string> = {
  work: 'Work',
  personal: 'Personal',
  'follow-up': 'Follow-up',
  idea: 'Idea',
  urgent: 'Urgent',
};

export interface JournalEntry {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: string; // ISO string
  hour: number; // 0-23, the hour the entry was created
  tags: JournalTag[];
  pinned: boolean;
  dateKey: string; // YYYY-MM-DD format
}
