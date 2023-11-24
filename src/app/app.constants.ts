export const AppConstant = {
    RAZOR_PAY: {
        RAZOR_API_KEY: "rzp_test_BS6Sx5t0AZzgqS",
        WEBSITE_NAME: "Book My Influencers",
        WEBSITE_DESCRIPTION: "We Rocket-boost Your Influencer Research, Audit, Outreach & Promotions",
        WEBSITE_LOGO: "https://bookmyinfluencers.com/bmi/assets/bootstrap/images/bmiheader.png",
        THEME_COLOR: "#3399cc"
    },
    REGEX: {
        URL_REG: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
        URLL_REG: /(https?:\[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/,
        MOBILE_REG: /^([6-9]{1})([0-9]{9})$/,
        NAME_REG: /^[a-zA-Z\d\s]+$/,
        NUMBER_ONLY_REG: /^\d+$/,
        NUMBER_WITH_DECIMAL_REG: /^(?:\d*\.\d{1,2}|\d+)$/,
        PASSWORD_UPPER_LOWER_SPECIAL_NUMBER: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        PASSWORD_REG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        // budget_REG: /^(?:5000|10000|100000|1000000|49999|50000|)$/,
        budget_REG: /^([5-9]\d{3,}|[1-9]\d{4,})$/,
        promotion_price: /^([1000]\d{3,}|[1-9]\d{7,})$/,
        // budget_REG: /^(?=.*[5000])(?=.*[>5000]){4,}$/,
        LIST_NAME_REG: /^[\S\s]{3,10}$/,
        LIST_REF: /^[\S\s]{3,50}$/,
        ACCOUNT_NUMBER_REG: /^\d{8,}$/,
        IFSC_REG: /^[a-zA-Z]{4}0[a-zA-Z0-9]{6}$/,
        PAN_REG: /[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/,
        ADDRESS_REG: /^[a-zA-Z\-_\d\s]+$/,
        GST_REG: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        SKYPE_REG: /^[a-zA-Z_\d]{3,}$/
    },
    SETTING_PANEL: {
        INFLUENCER: [
            {
                id: 'payment',
                icon: 'heroicons_outline:currency-rupee',
                title: 'Payment Information',
                description: 'Manage your payment method'
            },
            {
                id: 'personal',
                icon: 'heroicons_outline:user-circle',
                title: 'Personal Information',
                description: 'Manage your public profile and private information'
            },
            {
                id: 'account',
                icon: 'heroicons_outline:lock-closed',
                title: 'Account Information',
                description: 'Manage your account information'
            },
            {
                id: 'preferences',
                icon: 'heroicons_outline:selector',
                title: 'Preferences',
                description: 'Manage your personal preferences'
            }
        ],
        BRAND: [
            {
                id: 'billing',
                icon: 'heroicons_outline:currency-rupee',
                title: 'Billing Information',
                description: 'Manage your billing information'
            },
            {
                id: 'personal',
                icon: 'heroicons_outline:user-circle',
                title: 'Personal Information',
                description: 'Manage your public profile and private information'
            },
            {
                id: 'account',
                icon: 'heroicons_outline:lock-closed',
                title: 'Account Information',
                description: 'Manage your account information'
            }
        ]
    }
};