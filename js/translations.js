// Translations for PT, DE, EN
const translations = {
    pt: {
        'hero-title': 'Terrenos Premium em Recife',
        'hero-subtitle': 'Investimentos exclusivos em localização privilegiada',
        'cta-button': 'Ver Oportunidades',
        'properties-title': 'Oportunidades Exclusivas',
        'properties-subtitle': 'Selecione seu terreno em uma das regiões mais valorizadas',
        'why-title': 'Por Que Investir em Recife?',
        'why-subtitle': 'Investimento estratégico com retorno garantido',
        'feature1-title': 'Valorização Consistente',
        'feature1-desc': 'Mercado imobiliário em constante crescimento com histórico de valorização acima da média nacional',
        'feature2-title': 'Infraestrutura Consolidada',
        'feature2-desc': 'Regiões com infraestrutura completa, transporte, comércio e serviços de primeira linha',
        'feature3-title': 'Crescimento Urbano',
        'feature3-desc': 'Cidade em expansão com novos empreendimentos e desenvolvimento econômico sustentável',
        'feature4-title': 'Facilidades de Financiamento',
        'feature4-desc': 'Opções flexíveis de pagamento e parcerias com principais instituições financeiras',
        'contact-title': 'Entre em Contato',
        'whatsapp-btn': 'WhatsApp',
        'email-btn': 'Email',
        'footer-rights': 'Todos os direitos reservados',
        'loading-text': 'Carregando propriedades...',
        'schedule-visit': 'Agendar Visita',
        'size': 'Metragem',
        'location': 'Localização',
        'type': 'Tipo',
        'documentation': 'Documentação',
        'position': 'Posição',
        'infrastructure': 'Infraestrutura',
        'residential': 'Residencial',
        'commercial': 'Comercial',
        'mixed': 'Misto',
        'registered': 'Escriturado',
        'corner': 'Esquina',
        'front': 'Frente',
        'complete': 'Completa'
    },
    de: {
        'hero-title': 'Premium-Grundstücke in Recife',
        'hero-subtitle': 'Exklusive Investitionen in privilegierter Lage',
        'cta-button': 'Möglichkeiten Ansehen',
        'properties-title': 'Exklusive Gelegenheiten',
        'properties-subtitle': 'Wählen Sie Ihr Grundstück in einer der wertvollsten Regionen',
        'why-title': 'Warum in Recife Investieren?',
        'why-subtitle': 'Strategische Investition mit garantierter Rendite',
        'feature1-title': 'Konstante Wertsteigerung',
        'feature1-desc': 'Ständig wachsender Immobilienmarkt mit einer Wertsteigerung über dem nationalen Durchschnitt',
        'feature2-title': 'Konsolidierte Infrastruktur',
        'feature2-desc': 'Regionen mit kompletter Infrastruktur, Transport, Handel und erstklassigen Dienstleistungen',
        'feature3-title': 'Urbanes Wachstum',
        'feature3-desc': 'Expandierende Stadt mit neuen Unternehmungen und nachhaltiger wirtschaftlicher Entwicklung',
        'feature4-title': 'Finanzierungsmöglichkeiten',
        'feature4-desc': 'Flexible Zahlungsoptionen und Partnerschaften mit führenden Finanzinstituten',
        'contact-title': 'Kontakt Aufnehmen',
        'whatsapp-btn': 'WhatsApp',
        'email-btn': 'E-Mail',
        'footer-rights': 'Alle Rechte vorbehalten',
        'loading-text': 'Immobilien werden geladen...',
        'schedule-visit': 'Besichtigung Vereinbaren',
        'size': 'Größe',
        'location': 'Standort',
        'type': 'Typ',
        'documentation': 'Dokumentation',
        'position': 'Position',
        'infrastructure': 'Infrastruktur',
        'residential': 'Wohngebiet',
        'commercial': 'Gewerbegebiet',
        'mixed': 'Gemischt',
        'registered': 'Eingetragen',
        'corner': 'Ecke',
        'front': 'Vorne',
        'complete': 'Vollständig'
    },
    en: {
        'hero-title': 'Premium Land in Recife',
        'hero-subtitle': 'Exclusive investments in privileged location',
        'cta-button': 'View Opportunities',
        'properties-title': 'Exclusive Opportunities',
        'properties-subtitle': 'Select your land in one of the most valued regions',
        'why-title': 'Why Invest in Recife?',
        'why-subtitle': 'Strategic investment with guaranteed return',
        'feature1-title': 'Consistent Appreciation',
        'feature1-desc': 'Constantly growing real estate market with appreciation history above the national average',
        'feature2-title': 'Consolidated Infrastructure',
        'feature2-desc': 'Regions with complete infrastructure, transportation, commerce and first-class services',
        'feature3-title': 'Urban Growth',
        'feature3-desc': 'Expanding city with new developments and sustainable economic growth',
        'feature4-title': 'Financing Facilities',
        'feature4-desc': 'Flexible payment options and partnerships with leading financial institutions',
        'contact-title': 'Get in Touch',
        'whatsapp-btn': 'WhatsApp',
        'email-btn': 'Email',
        'footer-rights': 'All rights reserved',
        'loading-text': 'Loading properties...',
        'schedule-visit': 'Schedule Visit',
        'size': 'Size',
        'location': 'Location',
        'type': 'Type',
        'documentation': 'Documentation',
        'position': 'Position',
        'infrastructure': 'Infrastructure',
        'residential': 'Residential',
        'commercial': 'Commercial',
        'mixed': 'Mixed',
        'registered': 'Registered',
        'corner': 'Corner',
        'front': 'Front',
        'complete': 'Complete'
    }
};

// Get current language from localStorage or default to PT
let currentLanguage = localStorage.getItem('language') || 'pt';

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'de' ? 'de-DE' : 'en-US';
    
    // Reload properties with new language
    if (typeof loadProperties === 'function') {
        loadProperties();
    }
}

// Translate a key
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLanguage);
});