/** A single cut/shot in the storyboard timeline */
export interface StoryboardCut {
  timeRange: string;
  startSec: number;
  endSec: number;
  label: string;
  narration?: string;
  dialogue?: string;
  background?: string;
  character?: string;
  direction?: string;
  sfx?: string;
  rawMarkdown: string;
}

/** Episode metadata parsed from the header blockquote */
export interface EpisodeMeta {
  sourceChapter: string;
  duration: string;
  platform: string;
}

/** A complete parsed storyboard episode */
export interface StoryboardEpisode {
  num: number;
  title: string;
  headerTitle: string;
  meta: EpisodeMeta;
  cuts: StoryboardCut[];
  totalDurationSec: number;
}

/** Episode registry entry */
export interface EpisodeEntry {
  id: string;
  num: number;
  title: string;
  arc: string;
  arcLabel: string;
  projectId: string;
  sourceChapter: string;
  status: 'draft' | 'review' | 'final';
  raw?: string;
}
