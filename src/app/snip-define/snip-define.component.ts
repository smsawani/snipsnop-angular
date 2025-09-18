import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AzureFunctionsService } from '../azure-functions.service';

interface SnipData {
  id: string;
  userId: string;
  trackId: string;
  startTime: string;
  endTime: string;
  episodeData: any;
  lastModified: string;
  storageKey?: string;
}

@Component({
    selector: 'app-snip-define',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './snip-define.component.html',
    styleUrls: ['./snip-define.component.css']
})
export class SnipDefineComponent implements OnInit {

  snipData?: SnipData = undefined;
  episodeData: any = {};
  trackId: string = '';
  startTime: string = '';
  endTime: string = '';
  isSaved: boolean = false;
  userId: string = JSON.parse(localStorage.getItem(`snipsnop_user`) || "").email;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private azureFunctionsService: AzureFunctionsService
  ) {
    this.episodeData = this.router.currentNavigation()?.extras.state || {};
    console.log(JSON.stringify(this.episodeData));
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    this.trackId = routeParams.get('trackId') || '';
    
    if (this.trackId) {
      this.loadSavedTimes();
    }
  }

  loadSavedTimes() {
     // load from Azure Function
    this.azureFunctionsService.loadSnips().subscribe({
      next: (snips) => {
        const matchingSnip = snips.find(snip => snip.trackId === this.trackId && snip.userId === this.userId);
        if (matchingSnip) {
          console.log('Loaded snip from Azure Function:', matchingSnip);
          const { startTime, endTime } = matchingSnip;
          this.startTime = startTime || '';
          this.endTime = endTime || '';
          this.isSaved = !!(startTime || endTime);
          this.snipData = matchingSnip;
        }
      },
      error: (error) => {
        console.error('Error loading snips from Azure Function:', error);
      }
    }); 
  }

  onStartTimeChange() {
    this.isSaved = false;
  }

  onEndTimeChange() {
    this.isSaved = false;
  }

  handleSave() {
    if (this.trackId && (this.startTime || this.endTime)) {

      var user = JSON.parse(localStorage.getItem(`snipsnop_user`) || "");

      var snipData: SnipData;
      // if the snip already exists in the database
      if (this.snipData)
      {
        this.snipData.startTime = this.startTime;
        this.snipData.endTime = this.endTime;

        // save to Azure Function
        this.azureFunctionsService.saveSnip(this.snipData).subscribe({
          next: (response) => {
            console.log(user.email + ' Snip UPDATED to Azure Function:', response);
          },
          error: (error) => {
            console.error(user.email + ' Error UPDATED snip to Azure Function:', error);
          }
        });
      }
      else
      {
        snipData = {
          id: crypto.randomUUID(),
          userId: user.email,
          trackId: this.trackId,
          startTime: this.startTime,
          endTime: this.endTime,
          episodeData: this.episodeData,
          lastModified: new Date().toISOString()
        };

        // save to Azure Function
        this.azureFunctionsService.saveSnip(snipData).subscribe({
          next: (response) => {
            console.log(user.email + ' Snip saved to Azure Function:', response);
          },
          error: (error) => {
            console.error(user.email + ' Error saving snip to Azure Function:', error);
          }
        });
      }
      
      
      

      this.isSaved = true;
    }
  }

  timeToSeconds(timeStr: string): number {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(num => parseInt(num, 10)).filter(n => !isNaN(n));
    if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
      return parts[0] * 60 + parts[1]; // MM:SS
    } else if (parts.length === 3 && parts[0] !== undefined && parts[1] !== undefined && parts[2] !== undefined) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    }
    return 0;
  }

  getDuration(): number | null {
    if (!this.startTime || !this.endTime) return null;
    return Math.max(0, this.timeToSeconds(this.endTime) - this.timeToSeconds(this.startTime));
  }
}
