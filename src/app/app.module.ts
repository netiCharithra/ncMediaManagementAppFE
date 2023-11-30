import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { AppServiceService } from './services/app-service.service';
import { EmployeeSignupComponent } from './employee-signup/employee-signup.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { AngularFireModule } from '@angular/fire';
import { FirestoreModule } from '@angular/fire/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { NgxImageCompressService } from 'ngx-image-compress';
import { environment } from 'environments/environment';
import { MessagingService } from './services/messaging-service';
import { AsyncPipe } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MetaShareService } from './services/meta-share.service';
import { AdvertisementManagementComponent } from './advertisement-management/advertisement-management.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    AngularFireMessagingModule, AngularFireModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    FirestoreModule,
    AngularFireAuthModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    EmployeeSignupComponent,
    AdvertisementManagementComponent




  ],
  providers: [AppServiceService, MessagingService, AsyncPipe, { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, MetaShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
