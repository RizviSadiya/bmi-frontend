import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { BmiModule } from '@bmi';
import { BmiConfigModule } from '@bmi/services/config';
import { BmiMockApiModule } from '@bmi/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { LoaderService } from 'app/core/services/loader.service';
import { LoaderInterceptor } from 'app/core/interceptors/loader.interceptor';
import { LoaderComponent } from "app/layout/common/loader/loader.component";
import { APIInterceptor } from 'app/core/interceptors/api.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
// import { SuggestedInviteListComponent } from './modules/admin/apps/suggested-invite-list/suggested-invite-list.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ViewlistDetailComponent } from './modules/admin/apps/viewlist-detail/viewlist-detail.component';
import { SuggestedChannelComponent } from './modules/admin/apps/suggested-channel/suggested-channel.component';
// import { YoutubePublicProfileComponent } from './modules/auth/youtube-public-profile/youtube-public-profile.component';


// import { OutReachResultsPopupComponent } from './modules/admin/apps/out-reach-results-popup/out-reach-results-popup.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        LoaderComponent,
        ViewlistDetailComponent,
        // YoutubePublicProfileComponent,
        
       
        
        // OutReachResultsPopupComponent,
       
       
     
        
        
        // SuggestedChannelComponent,
        // SuggestedInviteListComponent,
     
       
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CKEditorModule,
        AngularEditorModule,
        NgxMatSelectSearchModule,
        // FilterPipeModule,
        ToastrModule.forRoot(),
        // NgMultiSelectDropDownModule.forRoot(),

        RouterModule.forRoot(appRoutes, routerConfig),

        // Bmi, BmiConfig & BmiMockAPI
        BmiModule,
        BmiConfigModule.forRoot(appConfig),
        BmiMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        LoaderService,
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
