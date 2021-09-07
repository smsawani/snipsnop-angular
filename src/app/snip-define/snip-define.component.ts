import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ITunesService } from '../itunes.service';
import { Podcast } from '../podcast';
import { Episode } from '../episode';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-snip-define',
  templateUrl: './snip-define.component.html',
  styleUrls: ['./snip-define.component.css']
})
export class SnipDefineComponent implements OnInit {

  state: any;
  trackId: string;
  trackUrl: string;

  constructor(
    private formBuilder: FormBuilder, 
    private iTunesService: ITunesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 

     this.state =  this.router.getCurrentNavigation().extras.state;
     this.trackId = this.state.trackId;
     this.trackUrl = this.state.trackUrl;
        
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.paramMap;
    const trackId = routeParams.get('trackId');
  }

}
