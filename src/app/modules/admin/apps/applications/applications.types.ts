import { Campaign } from "../campaigns/campaigns.types";

export interface Application {
    id: string,
    bidAmount: string | null;
    price: string | null;
    currency: string | null;
    camp_id: number;
    channel_id: string | null;
    brandTnc: string,
    tncDisagreeReason: string;
    old_duration: string,
    new_duration: string;
    promotion_slot: string,
    new_promotion_slot: string;
    view_commitment: string,
    min_views: string,
    minor_changes: string,
    goLiveTime: string,
    goLiveTimeOther: number,
    delivery_days: string,
    other_delivery_days: number;
    plateform_type: number;
    social_media_share: string,
    facebook: boolean,
    instagram: boolean,
    twitter: boolean,
    social_media: string | null,
    privacy_policy: number,
    comment: string | null;
    status: string | null;
    campaign: Campaign;
}