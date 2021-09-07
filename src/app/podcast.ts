export interface Podcast {
  resultCount: number;
  results: PodcastResults[];
}

export interface PodcastResults {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
}