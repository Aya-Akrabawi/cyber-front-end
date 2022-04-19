// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseURL: 'https://cyber-app-api.herokuapp.com',
  baseURL: 'https://localhost:8080',
  fileSize: 1048576,
  fileAllowedExt: "['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.pdf', '.docx', '.xls', '.xlsx']"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
