import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Podcast } from './podcast';
import { Episode } from './episode';
 
@Injectable()
export class ITunesService {
 
  // podcast search api call 
  basePodcastURL: string = "https://itunes.apple.com/search?media=podcast&entity=podcast&term=";
 
  // episode retrieve api call
  baseEpisodesURL: string = "https://itunes.apple.com/lookup?id=";
  endingEpisodesURL: string = "&country=US&media=podcast&entity=podcastEpisode&limit=100";

  constructor(private http: HttpClient) {
  }
 
  getPodcasts(term: string): Observable<Podcast> {   
    return this.http.get<Podcast>(encodeURI(this.basePodcastURL + term), { responseType: 'json', observe: 'body' });
  } 

  getEpisodes(collectionId: string): Observable<Episode> {   
    return this.http.get<Episode>(encodeURI(this.baseEpisodesURL + collectionId + this.endingEpisodesURL));
  }

  getEpisode(trackId: string): Observable<Episode> {   
    return this.http.get<Episode>(encodeURI(this.baseEpisodesURL + trackId + this.endingEpisodesURL));
  }
  
}