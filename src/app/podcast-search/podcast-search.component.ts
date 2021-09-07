import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ITunesService } from '../itunes.service';
import { Podcast } from '../podcast';

@Component({
  selector: 'app-podcast-search',
  templateUrl: './podcast-search.component.html',
  styleUrls: ['./podcast-search.component.css']
})
export class PodcastSearchComponent implements OnInit {
  searchForm = this.formBuilder.group({
    name: ''
  });

  podcasts: Podcast;
  loading: boolean = false;
  errorMessage;

  constructor(
    private formBuilder: FormBuilder,
    private iTunesService: ITunesService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this.getPodcasts(this.searchForm.value.name);
  }

  public getPodcasts(searchTerm) {
    this.loading = true;
    this.errorMessage = '';

    this.iTunesService.getPodcasts(searchTerm).subscribe(
      response => {
        this.podcasts = response;
        console.log(JSON.stringify(this.podcasts));
      },
      error => {
        console.error('Request failed with error');
        this.errorMessage = error;
        this.loading = false;
      },
      () => {
        console.log('Request completed');
        this.loading = false;
      }
    );
  }
}
