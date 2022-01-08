// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBReFU27xKkr5kLLEq8PiieycaA8v4dqBk",

    authDomain: "chaos-project-f5eb9.firebaseapp.com",
  
    databaseURL: "https://chaos-project-f5eb9-default-rtdb.firebaseio.com",
  
    projectId: "chaos-project-f5eb9",
  
    storageBucket: "chaos-project-f5eb9.appspot.com",
  
    messagingSenderId: "1069071839813",
  
    appId: "1:1069071839813:web:9122712290498eb8b4292c",
  
    measurementId: "${config.measurementId}"
  
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
