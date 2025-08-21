import { Component, ViewChild, ElementRef, type OnInit, type OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SnipData {
  trackId: string;
  startTime: string;
  endTime: string;
  episodeData: any;
  lastModified: string;
  storageKey: string;
}

@Component({
  selector: 'app-snips-saved',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './snips-saved.component.html',
  styleUrl: './snips-saved.component.css'
})
export class SnipsSavedComponent implements OnInit, OnDestroy {
  @ViewChild('audioRef', { static: false }) audioRef!: ElementRef<HTMLAudioElement>;

  snips: SnipData[] = [];
  playingSnip: SnipData | null = null;
  currentTime: number = 0;
  private timeUpdateInterval: any = null;

  ngOnInit() {
    this.loadSnips();
  }

  ngOnDestroy() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }

  loadSnips() {
    const snipItems: SnipData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('snip_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const trackId = key.replace('snip_', '');
          
          snipItems.push({
            trackId,
            ...data,
            storageKey: key
          });
        } catch (error) {
          console.error(`Error parsing snip data for ${key}:`, error);
        }
      }
    }
    
    snipItems.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    this.snips = snipItems;
  }

  deleteSnip(storageKey: string) {
    if (window.confirm('Are you sure you want to delete this snip?')) {
      localStorage.removeItem(storageKey);
      this.loadSnips();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  timeToSeconds(timeStr: string): number {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(num => parseInt(num, 10)).filter(n => !isNaN(n));
    if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3 && parts[0] !== undefined && parts[1] !== undefined && parts[2] !== undefined) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  calculateDuration(startTime: string, endTime: string): number | null {
    if (!startTime || !endTime) return null;
    return Math.max(0, this.timeToSeconds(endTime) - this.timeToSeconds(startTime));
  }

  playSnip(snip: SnipData) {
    if (!snip.episodeData?.episodeUrl) return;

    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    const startSeconds = this.timeToSeconds(snip.startTime);
    const endSeconds = this.timeToSeconds(snip.endTime);

    if (this.playingSnip?.trackId === snip.trackId) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    audio.pause();
    
    audio.src = snip.episodeData.episodeUrl;
    audio.currentTime = startSeconds;
    this.playingSnip = snip;
    this.currentTime = startSeconds;

    audio.play().then(() => {
      if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval);
      }
      
      this.timeUpdateInterval = setInterval(() => {
        const current = audio.currentTime;
        this.currentTime = current;
        
        if (endSeconds > startSeconds && current >= endSeconds) {
          audio.pause();
          this.playingSnip = null;
          clearInterval(this.timeUpdateInterval);
        }
      }, 100);
    }).catch(error => {
      console.error('Error playing audio:', error);
      this.playingSnip = null;
    });
  }

  stopSnip() {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      audio.pause();
    }
    this.playingSnip = null;
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }

  getPlaybackProgress(snip: SnipData): number {
    if (this.playingSnip?.trackId !== snip.trackId) return 0;
    
    const startSeconds = this.timeToSeconds(snip.startTime);
    const endSeconds = this.timeToSeconds(snip.endTime);
    const duration = endSeconds - startSeconds;
    
    if (duration <= 0) return 0;
    
    const progress = (this.currentTime - startSeconds) / duration;
    return Math.max(0, Math.min(1, progress));
  }

  isPlaying(snip: SnipData): boolean {
    const audio = this.audioRef?.nativeElement;
    return this.playingSnip?.trackId === snip.trackId && audio && !audio.paused;
  }
}