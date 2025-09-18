import type { Routes } from '@angular/router';
import { PodcastSearchComponent } from './podcast-search/podcast-search.component';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { SnipDefineComponent } from './snip-define/snip-define.component';
import { SnipsSavedComponent } from './snips-saved/snips-saved.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: PodcastSearchComponent },
  { path: 'episodes/:collectionId', component: EpisodeSelectComponent },
  { path: 'snipdefine/:trackId', component: SnipDefineComponent, canActivate: [AuthGuard] },
  { path: 'snips', component: SnipsSavedComponent, canActivate: [AuthGuard] },
];