export const environment = {
  production: true,
  // base_url: 'https://viridian-slug-sari.cyclic.app/',

  base_url:'https://us-central1-neticharithra-ncmedia.cloudfunctions.net/api/',
  // base_url: 'https://nc-media-management-app-be-neti-charithras-projects.vercel.app/',
  base_url_upload_files: 'https://nc-media-managament-app-be-files-upload.onrender.com/',
  // base_url: 'http://localhost:3000/',
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
  },
};
