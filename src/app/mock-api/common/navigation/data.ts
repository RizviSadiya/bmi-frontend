/* eslint-disable */
import { BmiNavigationItem } from '@bmi/components/navigation';

export const influencerNavigation: BmiNavigationItem[] = [
    {
        id      : 'dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.dashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : '/dashboard'
            },
            {
                id   : 'dashboards.profile',
                title: 'My Public Profile',
                type : 'basic',
                icon : 'heroicons_outline:star',
                link : '/youtube',
                target: '_blank',
                externalLink: true,
                disabled: false
            },
            {
                id   : 'dashboards.channel',
                title: 'Add Channel',
                type : 'basic',
                icon : 'heroicons_outline:plus',
                link : '/pages/add-channel'
            },
            {
                id   : 'dashboards.campaigns',
                title: 'Campaigns',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/apps/campaigns/all',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-blue-600 text-white rounded-full'
                }
            },
            {
                id   : 'dashboards.applications',
                title: 'Proposals',
                type : 'basic',
                icon : 'heroicons_outline:collection',
                link : '/apps/applications',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-blue-600 text-white rounded-full'
                }
            },
            // {
            //     id   : 'dashboards.inbox',
            //     title: 'Inbox',
            //     type : 'basic',
            //     icon : 'heroicons_outline:mail',
            //     // link : '/apps/chat',
            //     callMethod: 'openQuickChat',
            //     badge: {
            //         title  : '0',
            //         classes: 'px-2 bg-blue-600 text-white rounded-full'
            //     }
            // },
            {
                id   : 'dashboards.orders',
                title: 'Orders',
                type : 'basic',
                icon : 'heroicons_outline:cursor-click',
                link : '/pages/orders',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-blue-600 text-white rounded-full'
                }
            },
       
            {
                id   : 'dashboards.management',
                title: 'Management Service',
                type : 'basic',
                icon : 'heroicons_outline:office-building',
                link : '/pages/services'
            },
            {
                id   : 'dashboards.settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : '/pages/settings'
            },
            {
                id   : 'dashboards.transactionHistory',
                title: 'Transactions',
                type : 'basic',
                icon : 'heroicons_outline:currency-rupee',
                link : '/pages/wallet'
            },
            // {
            //     id   : 'dashboards.relationmanager',
            //     title: 'Relationship Manager',
            //     type : 'basic',
            //     icon : 'heroicons_outline:user-circle',
            //     callMethod: 'openrelationmanagerpopup',
            //     //link : '/camplive',
            // }
            // {
            //     id   : 'dashboards.help',
            //     title: 'Help',
            //     type : 'basic',
            //     icon : 'heroicons_outline:chat-alt-2',
            //     callMethod: 'openQuickChat'
            // }
        ]
    }
];
export const brandNavigation: BmiNavigationItem[] = [
    {
        id      : 'brandDashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.brandDashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : '/dashboard'
            },
            {
                id   : 'dashboards.brandOrders',
                title: 'Orders',
                type : 'basic',
                icon : 'heroicons_outline:cursor-click',
                link : '/pages/orders',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-orange-600 text-white rounded-full'
                }
            },
            // {
            //     id   : 'dashboards.postCampaign',
            //     title: 'Post a Campaign',
            //     type : 'basic',
            //     icon : 'heroicons_outline:plus',
            //     link : '/apps/campaigns/post'
            // },
            {
                id   : 'dashboards.brandCampaigns',
                title: 'Campaigns',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/apps/campaigns/all',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-orange-600 text-white rounded-full'
                }
            },
            // {
            //     id   : 'dashboards.brandInbox',
            //     title: 'Inbox',
            //     type : 'basic',
            //     icon : 'heroicons_outline:mail',
            //     // link : '/apps/chat',
            //     callMethod: 'openQuickChat',
            //     badge: {
            //         title  : '0',
            //         classes: 'px-2 bg-orange-600 text-white rounded-full'
            //     }
            // },
            {
                id   : 'dashboards.revealed',
                title: 'Revealed Channels',
                type : 'basic',
                icon : 'heroicons_outline:key',
                link : '/pages/revealed-channels',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-orange-600 text-white rounded-full'
                }
            },
            // {
            //     id   : 'dashboards.revealed',
            //     title: 'New Revealed Channels',
            //     type : 'basic',
            //     icon : 'heroicons_outline:key',
            //     link : '/pages/new-revealed',
            //     badge: {
            //         title  : '0',
            //         classes: 'px-2 bg-orange-600 text-white rounded-full'
            //     }
            // },
            {
                id   : 'dashboards.saved', 
                title: 'Favourite Channels',
                type : 'basic',
                icon : 'heroicons_outline:heart',
                link : '/pages/saved-channels',
                badge: {
                    title  : '0',
                    classes: 'px-2 bg-orange-600 text-white rounded-full'
                }
            },
            // {
            //     id   : 'dashboards.brandSettings',
            //     title: 'Settings',
            //     type : 'basic',
            //     icon : 'heroicons_outline:cog',
            //     link : '/pages/settings'
            // },
            {
                id   : 'dashboards.myLists',
                title: 'My Lists',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-list',
                link : '/pages/lists'
            },
            // {
            //     id   : 'dashboards.walletHistory',
            //     title: 'Wallet',
            //     type : 'basic',
            //     icon : 'heroicons_outline:currency-rupee',
            //     link : '/pages/wallet'
            // },
            {
                id   : 'dashboards.relationmanager',
                title: 'Relationship Manager',
                type : 'basic',
                icon : 'heroicons_outline:user-circle',
                callMethod: 'openrelationmanagerpopup',
                //link : '/camplive',
            }
        ]
    }
   
    
];
