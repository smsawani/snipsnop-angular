import { Component, type OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-snip-define',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './snip-define.component.html',
  styleUrls: ['./snip-define.component.css']
})
export class SnipDefineComponent implements OnInit {

  state: any;
  trackId: string;
  trackUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 

     this.state =  this.router.getCurrentNavigation()?.extras.state;
     this.trackId = this.state.trackId;
     this.trackUrl = this.state.trackUrl;
        
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    const trackId = routeParams.get('trackId');
    console.log('Track ID from route:', trackId);
  }

}
