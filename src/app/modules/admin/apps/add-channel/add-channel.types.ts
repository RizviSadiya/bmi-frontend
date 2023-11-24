export interface Channel
{
    id: number;
    channel_id: number;
    profile_pic: string;
    blur_image: string;
    title: string;
    followers: string;
    viewCount: string;
    videoCount: string | null;
    subscriberCount: string;
    EngagementRate: string;
    EstViews: string;
    cpm: string;
    price_view_ratio: string;
    currency: string;
    promotion_price: number;
    is_verified: 0 | 1;
    is_default: number;
    is_favourite: boolean;
    bmiProfile: string;
    youTubeProfile: string;
    channel_link: string;
    is_revealed: boolean;
    is_invite: boolean;
    channel: string;
    channel_lang?: string;
    tags?:string;
    cat_percentile_1?:string;
    cat_percentile_5?:string;
    cat_percentile_10?:string;
}

export interface AddChannel
{
    plateform: string;
    channel_link: string;
    channel_lang: string;
    promotion_price: string;
    is_default: number | 0;
    currency: string | null;
}

export interface Language
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Social
{
    id?: string;
    title?: string;
}
