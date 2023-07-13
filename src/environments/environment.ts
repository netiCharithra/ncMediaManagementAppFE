// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  base_url: 'https://handsome-visor-hare.cyclic.app/',
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
