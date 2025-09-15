import { Component, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JsonPipe, DatePipe } from '@angular/common';

import { ITunesService } from '../itunes.service';
import type { Episode } from '../episode';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-episode-select',
    imports: [RouterLink, JsonPipe, DatePipe],
    templateUrl: './episode-select.component.html',
    styleUrls: ['./episode-select.component.css']
})
export class EpisodeSelectComponent implements OnInit {

  searchForm = this.formBuilder.group({
      name: ''
  });

  episodes!: Episode;
  loading: boolean = false;
  errorMessage: any = '';

  constructor(
    private formBuilder: FormBuilder, 
    private iTunesService: ITunesService,
    private route: ActivatedRoute
  ) { 

  }

  ngOnInit() {

    

    // get the collectionId from route params
    const routeParams = this.route.snapshot.paramMap;
    const collectionId = routeParams.get('collectionId');

    if (collectionId) {
      this.getEpisodes(collectionId);
    }

  }

  public getEpisodes(collectionId: string) {
    this.loading = true;
    this.errorMessage = "";

    this.iTunesService.getEpisodes(collectionId).subscribe({
      next: (response) => { 
        this.episodes = response;
        console.log(response);
        this.loading = false;
      },
      error: (error) => {                          
        console.error('Request failed with error', error);
        this.errorMessage = error;
        this.loading = false;
      }
    })
  }

}