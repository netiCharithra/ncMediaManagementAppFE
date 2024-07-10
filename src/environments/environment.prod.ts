export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyBz7rI9K7VGMmO1GbRX7pstXOZgv5-z__E",
    authDomain: "ncmedianewsportal-v2.firebaseapp.com",
    projectId: "ncmedianewsportal-v2",
    storageBucket: "ncmedianewsportal-v2.appspot.com",
    messagingSenderId: "1090074501186",
    appId: "1:1090074501186:web:69b5f7a9b57218dabe0ddb",
    measurementId: "G-V8LKWEJ3MG"
  },

  base_url: 'https://apiservices.neticharithra.com/',

  // base_url: 'https://us-central1-neticharithra-ncmedia.cloudfunctions.net/api/',
  // base_url: 'https://nc-media-management-app-be-neti-charithras-projects.vercel.app/',
  // base_url: 'https://viridian-slug-sari.cyclic.app/',
  base_url_upload_files: 'https://nc-media-managament-app-be-files-upload.onrender.com/',
  // base_url: 'http://192.168.10.185:3000/',
  // base_url_upload_files: 'http://localhost:3001/',
  googleDrive: {
    // insert credentials here
    apiKey: "AIzaSyDXivxGi5FHfWDAW1U1qcsjlH0_XxBur7Y",
    clientId: "1049760491527-hpmiohl8nfa361qgmp79u1a5flcqcmrp.apps.googleusercontent.com"
    //
  },
  // replace folders object here
  folders: {
    create: true,
    moveFiles: false
  },
  //
  upload: {
    simple: true,
    multipart: false,
    resumable: false,
  }
};
