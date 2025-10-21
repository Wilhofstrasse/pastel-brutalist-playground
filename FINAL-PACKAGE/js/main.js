// Main JavaScript for loading properties

// Format price in Brazilian Real
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Create property card HTML
function createPropertyCard(property) {
    const lang = currentLanguage;
    
    // Get video HTML based on type
    let videoHTML = '';
    if (property.videoType === 'youtube' && property.youtubeUrl) {
        // Extract YouTube video ID
        let videoId = '';
        if (property.youtubeUrl.includes('youtube.com/watch?v=')) {
            videoId = property.youtubeUrl.split('v=')[1].split('&')[0];
        } else if (property.youtubeUrl.includes('youtu.be/')) {
            videoId = property.youtubeUrl.split('youtu.be/')[1].split('?')[0];
        }
        videoHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    } else if (property.videoType === 'upload' && property.videoUrl) {
        videoHTML = `<video controls><source src="${property.videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
    
    // Get title and description in current language
    const title = property[`title_${lang}`] || property.title_pt || property.title_en || property.title_de || 'Property';
    const description = property[`description_${lang}`] || property.description_pt || '';
    
    return `
        <div class="property-card">
            <div class="video-container">
                ${videoHTML}
            </div>
            <div class="property-info">
                <h3 class="property-title">${title}</h3>
                ${description ? `<p class="property-description">${description}</p>` : ''}
                <div class="property-details">
                    <div class="detail-item">
                        <span class="detail-label">${t('size')}</span>
                        <span class="detail-value">${property.size_m2} m²</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('location')}</span>
                        <span class="detail-value">${property.location}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('type')}</span>
                        <span class="detail-value">${t(property.type.toLowerCase())}</span>
                    </div>
                    ${property.documentation ? `
                    <div class="detail-item">
                        <span class="detail-label">${t('documentation')}</span>
                        <span class="detail-value">${t(property.documentation.toLowerCase())}</span>
                    </div>
                    ` : ''}
                    ${property.position ? `
                    <div class="detail-item">
                        <span class="detail-label">${t('position')}</span>
                        <span class="detail-value">${t(property.position.toLowerCase())}</span>
                    </div>
                    ` : ''}
                    ${property.infrastructure ? `
                    <div class="detail-item">
                        <span class="detail-label">${t('infrastructure')}</span>
                        <span class="detail-value">${t(property.infrastructure.toLowerCase())}</span>
                    </div>
                    ` : ''}
                </div>
                <p class="price">${formatPrice(property.price)}</p>
                <a href="https://wa.me/5581999999999?text=${encodeURIComponent(`Olá! Tenho interesse no terreno: ${title}`)}" 
                   target="_blank" 
                   class="property-button">${t('schedule-visit')}</a>
            </div>
        </div>
    `;
}

// Load properties from Firebase
async function loadProperties() {
    const propertiesGrid = document.getElementById('properties-grid');
    
    try {
        // Show loading
        propertiesGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p id="loading-text">${t('loading-text')}</p>
            </div>
        `;
        
        // Query active properties
        const snapshot = await db.collection('properties')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            propertiesGrid.innerHTML = `
                <div class="loading">
                    <p>${currentLanguage === 'pt' ? 'Nenhuma propriedade disponível no momento.' : 
                        currentLanguage === 'de' ? 'Derzeit keine Immobilien verfügbar.' : 
                        'No properties available at the moment.'}</p>
                </div>
            `;
            return;
        }
        
        // Clear loading and add properties
        propertiesGrid.innerHTML = '';
        snapshot.forEach(doc => {
            const property = doc.data();
            property.id = doc.id;
            propertiesGrid.innerHTML += createPropertyCard(property);
        });
        
    } catch (error) {
        console.error('Error loading properties:', error);
        propertiesGrid.innerHTML = `
            <div class="loading">
                <p style="color: red;">${currentLanguage === 'pt' ? 'Erro ao carregar propriedades. Tente novamente mais tarde.' : 
                    currentLanguage === 'de' ? 'Fehler beim Laden der Immobilien. Bitte versuchen Sie es später erneut.' : 
                    'Error loading properties. Please try again later.'}</p>
            </div>
        `;
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Load properties when page loads
    loadProperties();
});

// Make loadProperties available globally
window.loadProperties = loadProperties;