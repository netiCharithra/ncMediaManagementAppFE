// import { Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef, ViewContainerRef, ViewRef, EmbeddedViewRef, ViewChildren } from '@angular/core';
// // import { RyberService } from '../ryber.service'
// import { fromEvent, from, Subscription, Subscriber, of, combineLatest } from 'rxjs';
// import { catchError, delay } from 'rxjs/operators'
// import { environment } from '../../environments/environment'
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Directive({
//     selector: '[appFolders]'
// })
// export class FoldersDirective {


//     constructor(
//         private el: ElementRef,
//         private http: HttpClient,
//         private renderer: Renderer2,
//         // private ryber: RyberService
//     ) { }


//     @Input() folders: any;
//     extras: any;

//     @HostListener('click') onClick() {

//         if (this.extras?.confirm === 'true') {

//             //accesing the drive API

//             //paste credentials here
//             let CLIENT_ID = environment.googleDrive.clientId
//             let API_KEY = environment.googleDrive.apiKey
//             let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
//             let SCOPES = `https://www.googleapis.com/auth/drive`;
//             //


//             //scope access
//             let http = this.http
//             // let ryber = this.ryber
//             //


//             // load the auth SDK
//             gapi.load('client:auth2', () => {
//                 gapi.client.init({
//                     apiKey: API_KEY,
//                     clientId: CLIENT_ID,
//                     discoveryDocs: DISCOVERY_DOCS,
//                     scope: SCOPES
//                 })
//                     .then(function () {

//                         // sign in if needed
//                         if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
//                             gapi.auth2.getAuthInstance().signIn();
//                         }
//                         //


//                         if(environment.upload.simple){
                            
//                         }

//                         //create a folder
//                         if (environment.folders.create) {


//                             let headers = new HttpHeaders()
//                             headers = headers
//                                 .set("Authorization", `Bearer ${gapi.auth.getToken().access_token}`)

//                             http.post(
//                                 "https://www.googleapis.com/drive/v3/files",
//                                 {
//                                     name: "My Folder",
//                                     //to create a folder this must be included
//                                     mimeType: "application/vnd.google-apps.folder"
//                                     //
//                                 },
//                                 { headers, observe: 'response' }
//                             )
//                                 .subscribe((result) => {
//                                     console.log(result)
//                                 })


//                         }
//                         //


//                         //move files around folders
//                         if (environment.folders.moveFiles) {

//                             // to move anything you need Id
//                             let folders = {
//                                 a: { id: '' },
//                                 b: { id: '' },
//                                 target: { id: '' }
//                             }
//                             //

//                             let headers = new HttpHeaders()
//                             headers = headers
//                                 .set("Authorization", `Bearer ${gapi.auth.getToken().access_token}`)

//                             //get all the files in the drive
//                             http.get(
//                                 "https://www.googleapis.com/drive/v3/files",
//                                 { headers, observe: 'response' }
//                             )
//                                 .subscribe((result: any) => {

//                                     //gather the ids
//                                     result.body.files
//                                         .forEach((x: any, i) => {
//                                             if (x.name === 'multipart.json') {
//                                                 folders.target.id = x.id
//                                             }

//                                             else if (x.name === 'Folder1') {
//                                                 folders.a.id = x.id
//                                             }

//                                             else if (x.name === 'Folder2') {
//                                                 folders.b.id = x.id
//                                             }
//                                         })

//                                     console.log(folders)
//                                     //


//                                     // move the file from a to b
//                                     http.patch(
//                                         `https://www.googleapis.com/drive/v3/files/${folders.target.id}`,
//                                         { fields: 'id, parents', addParents: folders.b.id },
//                                         {
//                                             headers,
//                                             observe: 'response',
//                                             params: {
//                                                 fields: 'id, parents',
//                                                 addParents: folders.b.id,
//                                                 removeParents: folders.a.id
//                                             }
//                                         }
//                                     )
//                                         .subscribe((result) => {
//                                             console.log(result)
//                                         })
//                                     //

//                                 })
//                             //


//                         }
//                         //


//                     })
//                     .catch(function (error) {
//                         console.log(error)
//                     })
//             });
//             //

//         }

//     }


//     ngOnInit() {
//         this.extras = this.folders
//         if (this.extras?.confirm === 'true') {
//             console.log(environment.folders)
//             setTimeout(() => {
//                 // this.el.nativeElement.click()
//             }, 200)
//         }
//     }


//     ngOnDestroy() {
//         if (this.extras?.confirm === 'true') {
//             Object.values(this)
//                 .forEach((x: any, i) => {
//                     console.log(x instanceof Subscriber)
//                     x.unsubscribe?.()
//                 })
//         }
//     }


// }