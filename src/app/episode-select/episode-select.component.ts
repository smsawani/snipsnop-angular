import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ITunesService } from '../itunes.service';
import { Podcast } from '../podcast';
import { Episode } from '../episode';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-episode-select',
  templateUrl: './episode-select.component.html',
  styleUrls: ['./episode-select.component.css']
})
export class EpisodeSelectComponent implements OnInit {

  searchForm = this.formBuilder.group({
      name: ''
  });

  episodes: Episode;
  loading: boolean = false;
  errorMessage;

  constructor(
    private formBuilder: FormBuilder, 
    private iTunesService: ITunesService,
    private route: ActivatedRoute,
    private router: Router
  ) { 

  }

  ngOnInit() {

    

    // get the collectionId from route params
    const routeParams = this.route.snapshot.paramMap;
    const collectionId = routeParams.get('collectionId');

    this.getEpisodes(collectionId);

  }

  public getEpisodes(collectionId) {
    this.loading = true;
    this.errorMessage = "";

    this.iTunesService.getEpisodes(collectionId)
      .subscribe(
        (response) => { 
          this.episodes = response 
          console.log(response);
        },
        (error) => {                          
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                  
          console.log('Request completed')      
          this.loading = false; 
        })
  }

}