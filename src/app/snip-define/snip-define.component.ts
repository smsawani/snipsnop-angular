import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-snip-define',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './snip-define.component.html',
  styleUrls: ['./snip-define.component.css']
})
export class SnipDefineComponent implements OnInit {

  episodeData: any = {};
  trackId: string = '';
  startTime: string = '';
  endTime: string = '';
  isSaved: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.episodeData = this.router.getCurrentNavigation()?.extras.state || {};
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    this.trackId = routeParams.get('trackId') || '';
    
    if (this.trackId) {
      this.loadSavedTimes();
    }
  }

  loadSavedTimes() {
    const savedData = localStorage.getItem(`snip_${this.trackId}`);
    if (savedData) {
      try {
        const { startTime, endTime } = JSON.parse(savedData);
        this.startTime = startTime || '';
        this.endTime = endTime || '';
        this.isSaved = !!(startTime || endTime);
      } catch (error) {
        console.error('Error loading saved snip data:', error);
      }
    }
  }

  onStartTimeChange() {
    this.isSaved = false;
  }

  onEndTimeChange() {
    this.isSaved = false;
  }

  handleSave() {
    if (this.trackId && (this.startTime || this.endTime)) {
      const snipData = {
        startTime: this.startTime,
        endTime: this.endTime,
        episodeData: this.episodeData,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(`snip_${this.trackId}`, JSON.stringify(snipData));
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
