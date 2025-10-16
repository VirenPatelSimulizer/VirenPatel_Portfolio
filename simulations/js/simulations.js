
import SimulationConfigLoader from './config-loader.js';
document.addEventListener('DOMContentLoaded', async () => {
  const loader = new SimulationConfigLoader('assets/data/simulations-config.csv');
  const { simulations, categories: defaultCategories } = await loader.load();

  const categoryList = document.querySelector('.category-list');
  const simulationsGrid = document.getElementById('simulationsGrid');
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryView = document.getElementById('gallery-view');
  const categoryView = document.getElementById('category-view');
  const categoryHeaderTitle = document.querySelector('.category-header h2');
  const backBtn = document.querySelector('.back-btn');

  // --- 1. Populate Main Gallery View ---
  function populateGallery() {
    galleryGrid.innerHTML = ''; // Clear existing
    defaultCategories.forEach((category, index) => {
      if (category.id === 'all') return;

      const simCount = loader.getSimulationsByCategory(category.id).length;
      if (simCount === 0) return; // Don't show categories with no simulations

      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.style.setProperty('--card-index', index + 1);
      card.dataset.category = category.id;

      card.innerHTML = `
        <div class="gallery-preview">
          <div class="gallery-icon">${category.icon}</div>
        </div>
        <div class="gallery-info">
          <h3>${category.name}</h3>
          <p>${category.description}</p>
          <span class="sim-count">${simCount} Simulation${simCount !== 1 ? 's' : ''}</span>
        </div>
      `;
      galleryGrid.appendChild(card);
    });
  }

  // --- 2. Populate Category Sidebar ---
  function populateSidebar() {
    categoryList.innerHTML = ''; // Clear existing

    // Add "Gallery View" button first
    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'category-btn active';
    galleryBtn.dataset.category = 'gallery';
    galleryBtn.innerHTML = `<span class="category-icon">🎨</span> Gallery View`;
    categoryList.appendChild(galleryBtn);

    // Add buttons for each category
    defaultCategories.forEach(cat => {
      if (cat.id === 'all') return; // Skip the 'all' meta-category
      const count = loader.getSimulationsByCategory(cat.id).length;
      if (count === 0) return; // Don't show empty categories in sidebar

      const button = document.createElement('button');
      button.className = 'category-btn';
      button.dataset.category = cat.id;
      button.innerHTML = `
        <span class="category-icon">${cat.icon || '🧪'}</span> 
        ${cat.name || cat.id}
        <span class="sim-count">${count}</span>
      `;
      categoryList.appendChild(button);
    });
  }


  // --- 3. Function to Render Simulation Cards ---
  function renderSimulations(simsToRender) {
    simulationsGrid.innerHTML = ''; // Clear existing cards
    if (simsToRender.length === 0) {
      simulationsGrid.innerHTML = '<p class="no-results">No simulations found for this category.</p>';
      return;
    }

    simsToRender.forEach((sim, index) => {
      const card = document.createElement('div');
      card.className = 'sim-card';
      card.style.setProperty('--card-index', index + 1);
      
      const categoryInfo = defaultCategories.find(c => c.id === sim.category);

      card.innerHTML = `
        <div class="sim-preview">
          <div class="preview-placeholder">${categoryInfo?.icon || '🧪'}</div>
        </div>
        <div class="sim-info">
          <h3>${sim.title}</h3>
          <p>${sim.shortDescription}</p>
          <a href="${sim.path}" class="sim-btn">Launch Simulation</a>
        </div>
      `;
      simulationsGrid.appendChild(card);
    });
  }

  // --- 4. View Switching and Filtering Logic ---
  function showView(viewName, categoryId = null) {
    // Toggle content views
    galleryView.classList.toggle('hidden', viewName !== 'gallery');
    categoryView.classList.toggle('hidden', viewName !== 'category');

    // Update sidebar active state
    document.querySelectorAll('.category-btn').forEach(btn => {
      const btnCategory = categoryId || 'gallery';
      btn.classList.toggle('active', btn.dataset.category === btnCategory);
    });

    if (viewName === 'category' && categoryId) {
      const categoryInfo = defaultCategories.find(c => c.id === categoryId);
      categoryHeaderTitle.textContent = categoryInfo?.name || 'Simulations';
      const simsToDisplay = loader.getSimulationsByCategory(categoryId);
      renderSimulations(simsToDisplay);
    }
  }

  // --- 5. Event Listeners ---
  categoryList.addEventListener('click', (e) => {
    const button = e.target.closest('.category-btn');
    if (button) {
      const category = button.dataset.category;
      if (category === 'gallery') {
        showView('gallery');
      } else {
        showView('category', category);
      }
      // Optional: close sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
      }
    }
  });

  galleryGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (card) {
      const category = card.dataset.category;
      showView('category', category);
    }
  });

  backBtn.addEventListener('click', () => {
    showView('gallery');
  });


  // --- Initial Render ---
  populateGallery();
  populateSidebar();
  showView('gallery'); // Start on the gallery view
});
