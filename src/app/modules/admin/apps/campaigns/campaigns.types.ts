import { Brand } from "app/layout/common/single-brand/single-brand.types";

export interface Campaign
{
    plateform: any;
    id: string;
    avatar?: string | null;
    title?: string;
    company?: string;
    tags: string[];
    description?: string | null;
    promotionType?: string | null;
    cpm?: string | null;
    engagementRate?: string | null;
    subscribersRequired?: string | null;
    avgViews?: string | null;
    budget?: string | null;
    isReadMore?: boolean;
    brand: Brand;
    brand_logo?:string;
    brand_name?:string;
    brand_url?:string;
    reference_videos?:string;
    ref_video_link: string[] | null;
    camp_title?:string;
    camp_desc?:string;
    promot_product?:string;
    duration?:string;
    promotion_start?:string;
    reference1?:string;
    category?:string[];
    category_info_list?:string;
    subscriber?:number;
    visibility?:number;
    average_view?:string;
    engagement_rate?:number;
    followers?:number;
    inf_score?:number;
    currency?:string;
    invite_only?:number;
    plateform_type?:number;
    status?:any;
}

export interface Tag
{
    id?: string;
    title?: string;
}