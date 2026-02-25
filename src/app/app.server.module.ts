import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

/**
 * AppServerModule is the NgModule used for Server-Side Rendering (SSR).
 * It imports AppModule (your full app) + ServerModule (Angular's SSR utilities).
 * The CommonEngine in server.ts receives this module as its `bootstrap` value.
 */
@NgModule({
    imports: [
        AppModule,
        ServerModule,
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule { }
