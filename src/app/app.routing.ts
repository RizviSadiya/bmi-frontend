import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed in user to the '/dashboard'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up' , loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
            { path: 'signup', loadChildren: () => import('app/modules/auth/sign-up-step-two/sign-up-step-two.module').then(m => m.AuthSignUpStepTwoModule) },
            // {path: '', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
            { path: 'email-verification', loadChildren: () => import('app/modules/auth/email-verified/email-verified.module').then(m => m.EmailVerifiedModule) },
            // { path: 'instagram', loadChildren: () => import('app/modules/auth/insta-redirect/insta-redirect.module').then(m => m.InstaRedirectModule) },
            { path: 'youtube', loadChildren: () => import('app/modules/auth/youtube-public-profile/youtube-public-profile.module').then(m=>m.YoutubePublicProfileModule)}

        ]
    },

    {
        path: 'social',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'login', loadChildren: () => import('app/modules/auth/social-redirect/social-redirect.module').then(m => m.SocialRedirectModule) },
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'landing', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    // Landing pages routes
    {
        path: '',
        component: LayoutComponent,
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        data: {
            layout: 'before'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'influencer', loadChildren: () => import('app/modules/landing/influencer/influencer.module').then(m => m.LandingInfluencerModule) },
            { path: 'brand', loadChildren: () => import('app/modules/landing/brand/brand.module').then(m => m.LandingBrandModule) },
            { path: 'contact', loadChildren: () => import('app/modules/landing/contact/contact.module').then(m => m.LandingContactModule) },
            { path: 'privacy-policy', loadChildren: () => import('app/modules/landing/privacy-policy/privacy-policy.module').then(m => m.LandingPrivacyPolicyModule) },
            { path: 'terms-of-use', loadChildren: () => import('app/modules/landing/terms-of-use/terms-of-use.module').then(m => m.LandingTermsOfUseModule) },
//profile
            // { path: 'youtube', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule) },

        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [

            // Dashboard
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'choose-plan', loadChildren: () => import('app/modules/auth/choose-plan/choose-plan.module').then(m => m.AuthChoosePlanModule) },
            // Apps
            {
                path: 'apps', children: [
                    { path: 'chat', loadChildren: () => import('app/modules/admin/apps/chat/chat.module').then(m => m.ChatModule) },
                    { path: 'campaigns', loadChildren: () => import('app/modules/admin/apps/campaigns/campaigns.module').then(m => m.CampaignsModule) },
                    { path: 'applications', loadChildren: () => import('app/modules/admin/apps/applications/applications.module').then(m => m.ApplicationsModule) },
                    { path: 'influencers', loadChildren: () => import('app/modules/admin/apps/search-channel/search-channel.module').then(m => m.SearchChannelModule) },
                ]
            },


            // Profile
            { path: 'youtube', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule) },

            // Pages

            //insta call back
         
               
            { path: 'instagram', loadChildren: () => import('app/modules/auth/insta-redirect/insta-redirect.module').then(m => m.InstaRedirectModule) },

                 
               
           
            {
                path: 'pages', children: [
                    // Error
                    {
                        path: 'error', children: [
                            { path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
                            { path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module) }
                        ]
                    },

                    // Add Channel
                    { path: 'add-channel', loadChildren: () => import('app/modules/admin/apps/add-channel/add-channel.module').then(m => m.AddChannelModule) },
            { path: 'privacy-policy', loadChildren: () => import('app/modules/landing/privacy-policy/privacy-policy.module').then(m => m.LandingPrivacyPolicyModule) },
            // { path: 'instagram', loadChildren: () => import('app/modules/auth/insta-redirect/insta-redirect.module').then(m => m.InstaRedirectModule) },

                    // Settings
                    { path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule) },
                    { path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule) },

                    // Affiliate Program
                    { path: 'affiliates', loadChildren: () => import('app/modules/admin/apps/affiliate-program/affiliate-program.module').then(m => m.AffiliateProgramModule) },
                    { path: 'orders', loadChildren: () => import('app/modules/admin/apps/orders/orders.module').then(m => m.OrdersModule) },

                    // Management Services
                    { path: 'services', loadChildren: () => import('app/modules/admin/apps/management-services/management-services.module').then(m => m.ManagementServicesModule) },

                    { path: 'saved-channels', loadChildren: () => import('app/modules/admin/apps/saved-channels/saved-channels.module').then(m => m.SavedChannelsModule) },
                    { path: 'revealed-channels', loadChildren: () => import('app/modules/admin/apps/revealed-channels/revealed-channels.module').then(m => m.RevealedChannelsModule) },
                    { path: 'wallet', loadChildren: () => import('app/modules/admin/apps/wallet/wallet.module').then(m => m.WalletModule) },
                    { path: 'similarInfluencer', loadChildren: () => import('app/modules/admin/apps/suggested-invite-list/suggested-invite-list.modules').then(m => m.SuggestedInviteListModule) },
                    { path: 'similarInsta-Influencer', loadChildren: () => import('app/modules/admin/apps/suggested-insta-invite-list/suggested-insta-invite-list.modules').then(m => m.SuggestedInstaInviteListModule) },
                    { path: 'suggested-channels', loadChildren: () => import('app/modules/admin/apps/suggested-channel/suggested-channel.modules').then(m => m.SuggestedChannelModule) },
                   
                    { path: 'lists', loadChildren: () => import('app/modules/admin/apps/list/list.module').then(m => m.ListModule) },
                    { path: 'veiwlistDetail', loadChildren: () => import('app/modules/admin/apps/viewlist-detail/viewlist-detail.module').then(m => m.ViewlistDetailModule) },
                 
                ]
            },

            // 404 & Catch all
            { path: 'camplive', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/newdesign/camplive/camplive.module').then(m => m.CampliveModule) },
            { path: 'uploadscript', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/newdesign/uploadscript/uploadscript.module').then(m => m.UploadscriptModule) },
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
            { path: 'odersuccesfully', loadChildren: () => import('app/layout/common/relation-manager/relation-manager.module').then(m => m.RelationManagerModule) },
            { path: '**', redirectTo: '404-not-found' }
        ]
    }
];

