import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public userData: any={};

  constructor(private dataStore: StorageService) {
    this.userData = this.dataStore.getStoredUser();

    console.log(this.userData,'user data 2')
  }

  ngOnInit(): void {
    console.log(this.dataStore.getStoredUser())
  }
}
