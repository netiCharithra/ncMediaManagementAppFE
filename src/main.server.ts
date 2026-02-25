/// <reference types="@angular/localize" />

import { AppServerModule } from './app/app.server.module';

/**
 * SSR entry point for the Angular @angular/ssr CommonEngine.
 *
 * The CommonEngine accepts a Type<{}> (an NgModule or standalone component class)
 * as its `bootstrap` value. We export AppServerModule directly here.
 *
 * NOTE: AppServerModule = AppModule + ServerModule. It is declared in
 *       src/app/app.server.module.ts.
 */
export default AppServerModule;
