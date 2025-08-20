import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import type { Podcast } from './podcast';
import type { Episode } from './episode';
 
@Injectable({
  providedIn: 'root'
})
export class ITunesService {
 
  private readonly basePodcastURL = 'https://itunes.apple.com/search?media=podcast&entity=podcast&term=' as const;
  private readonly baseEpisodesURL = 'https://itunes.apple.com/lookup?id=' as const;
  private readonly endingEpisodesURL = '&country=US&media=podcast&entity=podcastEpisode&limit=100' as const;

  constructor(private http: HttpClient) {
  }
 
  getPodcasts(term: string): Observable<Podcast> {
    return this.http.get<Podcast>(encodeURI(`${this.basePodcastURL}${term}`));
  }

  getEpisodes(collectionId: string): Observable<Episode> {
    return this.http.get<Episode>(encodeURI(`${this.baseEpisodesURL}${collectionId}${this.endingEpisodesURL}`));
  }

  getEpisode(trackId: string): Observable<Episode> {
    return this.http.get<Episode>(encodeURI(`${this.baseEpisodesURL}${trackId}${this.endingEpisodesURL}`));
  }
  
}