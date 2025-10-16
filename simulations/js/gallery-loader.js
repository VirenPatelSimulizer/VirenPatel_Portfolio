
import SimulationConfigLoader from './config-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loader = new SimulationConfigLoader('data/simulations-config.csv');
  try {
    const { simulations, categories } = await loader.load();
    
    const galleryGrid = document.querySelector('.simulation-grid');
    if (!galleryGrid) {
      console.error('Simulation grid not found');
      return;
    }

    // Clear any placeholder content
    galleryGrid.innerHTML = '';

    // Create and append category cards
    categories.forEach((category, index) => {
      const simsInCategory = loader.getSimulationsByCategory(category.id);
      const count = simsInCategory.length;

      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.dataset.category = category.id;
      card.style.setProperty('--card-index', index + 1);

      card.innerHTML = `
        <div class="gallery-preview">
          <div class="gallery-icon">${category.icon}</div>
        </div>
        <div class="gallery-info">
          <h3>${category.name}</h3>
          <p>${category.description}</p>
          <div class="sim-count">${count} Simulation${count !== 1 ? 's' : ''}</div>
        </div>
      `;
      galleryGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Failed to load simulation categories:', error);
    const galleryGrid = document.querySelector('.simulation-grid');
    if (galleryGrid) {
      galleryGrid.innerHTML = '<p class="error-message">Could not load simulation categories. Please try again later.</p>';
    }
  }
});
