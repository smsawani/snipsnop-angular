export interface Episode {
  resultCount: number;
  results: EpisodeResults[];
}

export interface EpisodeResults {
  collectionName: string;
  collectionId: number;
  trackId: number;
  trackName: string;
  artistName: string;
  previewUrl: string;
  description: string;
  artworkUrl160: string;
  artworkUrl600: string;
  releaseDate: Date;
  episodeUrl: string;
}