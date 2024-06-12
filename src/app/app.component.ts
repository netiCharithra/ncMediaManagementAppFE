import { Component, OnInit } from '@angular/core';
import { AppServiceService } from './services/app-service.service';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'environments/environment';
import { MessagingService } from './services/messaging-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private messagingService: MessagingService, public appService: AppServiceService, private afMessaging: AngularFireMessaging) {

  }


  message: any;
  ngOnInit() {
    // console.log("HII")
    navigator.serviceWorker.addEventListener('notificationclick', (event: any) => {
      // alert("HI")
      console.log(event.notification)
      event.notification.close();
      const clickAction = event.notification.data.click_action;
      if (clickAction) {
        // Use Angular router to navigate to the specified route
        // this.router.navigate([clickAction]);
      }
    });


    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;

    this.afMessaging.requestToken.subscribe(
      (token) => {
        // console.log('FCM token:', token);
        if (token) {
          this.appService.setFCMToken({ token: token }).subscribe(data => {
            console.log(data)
          })
        }
        // Store or use the FCM token as needed
      },
      (error) => {
        console.error('Error getting FCM token:', error);
        // Handle the error appropriately
      }
    );
  }
}
