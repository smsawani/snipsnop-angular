import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ITunesService } from '../itunes.service';
import type { Podcast } from '../podcast';

@Component({
  selector: 'app-podcast-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './podcast-search.component.html',
  styleUrl: './podcast-search.component.css'
})
export class PodcastSearchComponent {
  searchForm = this.formBuilder.group({
    name: ''
  });

  podcasts: Podcast | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private iTunesService: ITunesService
  ) {}


  onSubmit(): void {
    const searchTerm = this.searchForm.value.name;
    if (searchTerm) {
      this.getPodcasts(searchTerm);
    }
  }

  public getPodcasts(searchTerm: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.iTunesService.getPodcasts(searchTerm).subscribe({
      next: (response) => {
        this.podcasts = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Request failed with error', error);
        this.errorMessage = 'Failed to search podcasts';
        this.loading = false;
      }
    });
  }
}
