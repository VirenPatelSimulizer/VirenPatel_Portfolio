import SimulationConfigLoader from './config-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loader = new SimulationConfigLoader('assets/data/simulations-config.csv');
  await loader.loadConfig();

  const categoryList = document.getElementById('category-list');
  const simulationViewContent = document.getElementById('simulation-view-content');
  const categorySidebar = document.getElementById('category-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const closeSidebar = document.getElementById('close-sidebar');
  const mainContainer = document.querySelector('.container');

  // --- NEW: Define category metadata (icons, names) ---
  const categoryMeta = {
    'physics': { name: 'Physics', icon: '⚛️' },
    'swarm': { name: 'Swarm Intelligence', icon: '🦋' },
    'mathematics': { name: 'Mathematics', icon: '🧮' },
    'computer-science': { name: 'Computer Science', icon: '💻' },
    // Add other categories from your CSV here
  };

  const categories = loader.getAllCategories();

  // Create category buttons
  categories.forEach(categoryId => {
    const category = categoryMeta[categoryId] || { name: categoryId, icon: '🧪' };
    const button = document.createElement('button');
    button.className = 'category-btn';
    button.dataset.category = categoryId;
    button.innerHTML = `<span class="category-icon">${category.icon}</span> ${category.name}`;
    categoryList.appendChild(button);
  });

  // Create simulation grids for each category
  categories.forEach(categoryId => {
    const galleryContainer = document.createElement('div');
    galleryContainer.id = `${categoryId}-view`;
    galleryContainer.className = 'content-view hidden';

    const grid = document.createElement('div');
    grid.className = 'simulations-grid';
    
    const simulations = loader.getSimulationsByCategory(categoryId);
    simulations.forEach((sim, index) => {
      const card = document.createElement('a');
      card.href = `../${sim.path}`; // Adjusted path to go up one level
      card.className = 'sim-card';
      card.style.setProperty('--card-index', index + 1);
      card.innerHTML = `
        <div class="sim-preview" style="background-image: url('../${sim.previewMedia.path}'); background-size: cover; background-position: center;">
          ${!sim.previewMedia.path ? `<div class="preview-placeholder"><span>${categoryMeta[sim.category]?.icon || '🧪'}</span></div>` : ''}
        </div>
        <div class="sim-info">
          <h3>${sim.title}</h3>
          <p>${sim.shortDescription}</p>
          <span class="sim-btn">View Simulation</span>
        </div>
      `;
      grid.appendChild(card);
    });

    galleryContainer.appendChild(grid);
    simulationViewContent.appendChild(galleryContainer);
  });

  const categoryButtons = document.querySelectorAll('.category-btn');

  function switchCategory(categoryId) {
    // Update button states
    categoryButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    // Show/hide content views
    document.querySelectorAll('.content-view').forEach(view => {
      view.classList.toggle('hidden', view.id !== `${categoryId}-view`);
    });

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      categorySidebar.classList.remove('active');
    }
  }

  // Event listener for category buttons
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      switchCategory(button.dataset.category);
    });
  });

  // Sidebar toggle functionality
  sidebarToggle.addEventListener('click', () => {
    categorySidebar.classList.add('active');
  });

  closeSidebar.addEventListener('click', () => {
    categorySidebar.classList.remove('active');
  });

  // --- MODIFIED: Initial state logic ---
  // Check for a category in the URL first
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get('category');

  if (categoryFromUrl && categories.includes(categoryFromUrl)) {
    // If a valid category is in the URL, show it
    switchCategory(categoryFromUrl);
  } else if (categories.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    // Check if the category from the URL is valid
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      switchCategory(categoryFromUrl);
    } else {
      // Fallback to the first category if none is specified or if it's invalid
      const firstCategory = categories[0];
      switchCategory(firstCategory);
    }
  }


  // Logic to handle persistent sidebar on wider screens
  function handleSidebarMode() {
    if (window.innerWidth > 768) {
      mainContainer.classList.add('sidebar-mode');
      categorySidebar.classList.add('persistent');
      sidebarToggle.classList.add('hidden');
    } else {
      mainContainer.classList.remove('sidebar-mode');
      categorySidebar.classList.remove('persistent');
      sidebarToggle.classList.remove('hidden');
    }
  }

  window.addEventListener('resize', handleSidebarMode);
  handleSidebarMode(); // Initial check
});
