export interface User {
    id: string;
    fullname: string;
    email: string;
    phone: string;
    avatar?: string;
    status?: string;
    userType?: string;
    profile_photo?: string;
    credit_balance?: string;
    wallet_balance?: string;
    accessToken:string;
    category_preferences: string;
    plan_id?: number;
}
