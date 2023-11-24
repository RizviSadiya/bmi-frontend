
export const environment = {
    production: true,
    API_BASE_ENDPOINT: "https://api.bookmyinfluencers.com/",
    CHAT_ENDPOINT: "wss://api.bookmyinfluencers.com/chat-wss/",
    PUBLIC_URL: "api/v1/",
    PUBLIC_URL_V2: "api/v2/",
    INFLUENCER_URL: "api/v1/" + (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).userType : '') + "/",
    BRAND_URL: "api/v1/brand/",
    GOOGLE_CLIENT_ID: "490682266510-eqjietfun6el6km4kegnjo5dced91jf5.apps.googleusercontent.com",
    VERSION: "1.1.1-prod"
};
