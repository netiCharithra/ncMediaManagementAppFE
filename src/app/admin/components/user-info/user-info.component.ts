import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  userData$: Observable<any>;

  constructor(private dataStore: DataStore) {
    this.userData$ = this.dataStore.userData$;
  }

  ngOnInit(): void {
  }
}
