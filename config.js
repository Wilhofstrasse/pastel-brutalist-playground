// =======================================================================================
// BR SERVICES - REAL ESTATE SALES PLATFORM CONFIGURATION
// =======================================================================================
//
// IMPORTANT: Update these values with your real business information before deployment
//
// =======================================================================================

const SITE_CONFIG = {
    // =================== BUSINESS INFORMATION ===================
    business: {
        name: "BR Services",
        fullName: "BR Services Real Estate",
        slogan: {
            pt: "Terrenos Premium em Recife",
            de: "Premium-Grundstücke in Recife",
            en: "Premium Land in Recife"
        },
        tagline: {
            pt: "Investimentos exclusivos em localização privilegiada",
            de: "Exklusive Investitionen in privilegierter Lage",
            en: "Exclusive investments in privileged location"
        }
    },

    // =================== CONTACT INFORMATION ===================
    // TODO: Update with real contact information
    contact: {
        // WhatsApp number in international format (without + or spaces)
        // Example: "5581999999999" for +55 81 99999-9999
        whatsapp: "5581999999999",  // ⚠️ UPDATE THIS

        // WhatsApp number formatted for display
        whatsappDisplay: "+55 (81) 9 9999-9999",  // ⚠️ UPDATE THIS

        // Business email
        email: "us@filipeandrade.com",  // ⚠️ UPDATE THIS

        // Office phone (optional)
        phone: "",

        // Business address (optional)
        address: {
            street: "",
            city: "Recife",
            state: "PE",
            country: "Brasil",
            zipCode: ""
        }
    },

    // =================== SOCIAL MEDIA ===================
    // TODO: Add your real social media profiles or remove if not using
    social: {
        // Full URL to your Instagram profile
        instagram: "https://instagram.com/brservices",  // ⚠️ UPDATE THIS

        // Full URL to your Facebook profile/page
        facebook: "https://facebook.com/brservices",  // ⚠️ UPDATE THIS

        // Full URL to your LinkedIn profile/page (optional)
        linkedin: "",

        // Full URL to your YouTube channel (optional)
        youtube: "",

        // Full URL to your Twitter/X profile (optional)
        twitter: ""
    },

    // =================== SEO & META TAGS ===================
    seo: {
        title: {
            pt: "BR Services - Terrenos Premium em Recife",
            de: "BR Services - Premium-Grundstücke in Recife",
            en: "BR Services - Premium Land in Recife"
        },
        description: {
            pt: "Terrenos premium em Recife - Investimentos exclusivos em localização privilegiada",
            de: "Premium-Grundstücke in Recife - Exklusive Investitionen in privilegierter Lage",
            en: "Premium land in Recife - Exclusive investments in privileged location"
        },
        keywords: "terrenos, recife, imóveis, real estate, investimento, BR Services",
        ogImage: "./assets/logo.png"
    },

    // =================== FIREBASE CONFIGURATION ===================
    // This is PUBLIC and safe to be in the code - Firebase security is handled server-side
    firebase: {
        apiKey: "AIzaSyCeg-p2HMp2YHwSXg_ulDxBkHmb6h-2ahU",
        authDomain: "real-estate-recife.firebaseapp.com",
        projectId: "real-estate-recife",
        storageBucket: "real-estate-recife.firebasestorage.app",
        messagingSenderId: "1089048916325",
        appId: "1:1089048916325:web:db0fc9fae9d69b58bff18c"
    },

    // =================== FEATURES ===================
    features: {
        // Enable/disable social media links
        showSocialMedia: true,

        // Enable/disable language switcher
        showLanguageSwitcher: true,

        // Default language (pt, de, en)
        defaultLanguage: "pt",

        // Available languages
        availableLanguages: ["pt", "de", "en"],

        // Maximum video upload size in MB
        maxVideoUploadSize: 100,

        // Currency for prices
        currency: "BRL",
        currencySymbol: "R$"
    },

    // =================== PROPERTY TYPES ===================
    propertyTypes: [
        { value: "Residential", label: { pt: "Residencial", de: "Wohngebiet", en: "Residential" } },
        { value: "Commercial", label: { pt: "Comercial", de: "Gewerbegebiet", en: "Commercial" } },
        { value: "Mixed", label: { pt: "Misto", de: "Gemischt", en: "Mixed" } }
    ],

    // =================== DOCUMENTATION STATUS ===================
    documentationStatus: [
        { value: "Registered", label: { pt: "Escriturado", de: "Eingetragen", en: "Registered" } },
        { value: "Pending", label: { pt: "Pendente", de: "Ausstehend", en: "Pending" } }
    ],

    // =================== POSITION TYPES ===================
    positionTypes: [
        { value: "Corner", label: { pt: "Esquina", de: "Ecke", en: "Corner" } },
        { value: "Front", label: { pt: "Frente", de: "Vorne", en: "Front" } },
        { value: "Middle", label: { pt: "Meio", de: "Mitte", en: "Middle" } }
    ],

    // =================== INFRASTRUCTURE ===================
    infrastructureTypes: [
        { value: "Complete", label: { pt: "Completa", de: "Vollständig", en: "Complete" } },
        { value: "Partial", label: { pt: "Parcial", de: "Teilweise", en: "Partial" } },
        { value: "None", label: { pt: "Nenhuma", de: "Keine", en: "None" } }
    ]
};

// =======================================================================================
// HELPER FUNCTIONS
// =======================================================================================

// Get WhatsApp link with optional message
function getWhatsAppLink(message = "") {
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${SITE_CONFIG.contact.whatsapp}${encodedMessage}`;
}

// Get translated value
function getTranslation(obj, lang) {
    return obj[lang] || obj['en'] || obj['pt'] || "";
}

// Get property type label
function getPropertyTypeLabel(value, lang) {
    const type = SITE_CONFIG.propertyTypes.find(t => t.value === value);
    return type ? getTranslation(type.label, lang) : value;
}

// Get documentation status label
function getDocumentationLabel(value, lang) {
    const status = SITE_CONFIG.documentationStatus.find(s => s.value === value);
    return status ? getTranslation(status.label, lang) : value;
}

// Get position type label
function getPositionLabel(value, lang) {
    const position = SITE_CONFIG.positionTypes.find(p => p.value === value);
    return position ? getTranslation(position.label, lang) : value;
}

// Get infrastructure label
function getInfrastructureLabel(value, lang) {
    const infra = SITE_CONFIG.infrastructureTypes.find(i => i.value === value);
    return infra ? getTranslation(infra.label, lang) : value;
}

// =======================================================================================
// EXPORT (for modules) or make available globally
// =======================================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SITE_CONFIG,
        getWhatsAppLink,
        getTranslation,
        getPropertyTypeLabel,
        getDocumentationLabel,
        getPositionLabel,
        getInfrastructureLabel
    };
}
