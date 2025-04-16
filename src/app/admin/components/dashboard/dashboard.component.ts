import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userData$: Observable<any>;

  constructor(private dataStore: DataStore) {
    this.userData$ = this.dataStore.userData$;
  }

  ngOnInit(): void {
  }
}
