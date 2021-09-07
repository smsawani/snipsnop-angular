import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { PodcastSearchComponent } from './podcast-search/podcast-search.component';
import { SnipDefineComponent } from './snip-define/snip-define.component';
import { SnipSaveComponent } from './snip-save/snip-save.component';
import { SnipsSavedComponent } from './snips-saved/snips-saved.component';
import { ITunesService } from './itunes.service';


@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule,  HttpClientModule,
  RouterModule.forRoot([
      { path: '', component: PodcastSearchComponent },
      { path: 'episodes/:collectionId', component: EpisodeSelectComponent },
      { path: 'snipdefine/:trackId', component: SnipDefineComponent },
    ]), ],
  declarations: [ AppComponent, TopBarComponent, EpisodeSelectComponent, PodcastSearchComponent, SnipDefineComponent, SnipSaveComponent, SnipsSavedComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ ITunesService ],
})
export class AppModule { }
