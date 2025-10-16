
// Initialize the config loader
import SimulationConfigLoader from '../../js/config-loader.js';

const configLoader = new SimulationConfigLoader('data/simulations.csv');
let allSimulations = [];
let allCategories = [];
let currentCategory = 'all';

const galleryGrid = document.getElementById('gallery-grid');
const simulationsContainer = document.getElementById('simulations');
const categorySidebar = document.getElementById('category-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const closeSidebarBtn = document.getElementById('close-sidebar');

document.addEventListener('DOMContentLoaded', async () => {
  if (!galleryGrid) return;

  try {
    const { simulations, categories } = await configLoader.load();
    allSimulations = simulations;
    allCategories = categories;
    
    displayCategories();
    setupEventListeners();
  } catch (error) {
    console.error("Failed to load and display simulations:", error);
    galleryGrid.innerHTML = '<p class="error-message">Could not load simulations. Please try again later.</p>';
  }
});

function displayCategories() {
  simulationsContainer.innerHTML = `
    <div class="container">
      <h1 class="fade-in">Interactive Simulations</h1>
      <p class="simulations-subtitle fade-in">Explore complex systems through hands-on demonstrations.</p>
      <div id="gallery-grid" class="gallery-grid"></div>
    </div>
  `;
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  allCategories.forEach(category => {
    const simsInCategory = configLoader.getSimulationsByCategory(category.id);
    const simCount = simsInCategory.length;

    if (simCount > 0) {
      const categoryCard = `
        <div class="gallery-card" data-category-id="${category.id}" style="--card-index: ${allCategories.indexOf(category) + 1};">
          <div class="gallery-preview">
            <div class="gallery-icon">${category.icon}</div>
          </div>
          <div class="gallery-info">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <span class="sim-count">${simCount} Simulation${simCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      `;
      grid.innerHTML += categoryCard;
    }
  });

  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const categoryId = card.dataset.categoryId;
      showSimulationGallery(categoryId);
    });
  });
}

function showSimulationGallery(categoryId) {
  currentCategory = categoryId;
  const category = allCategories.find(c => c.id === categoryId) || { name: 'All Simulations' };

  simulationsContainer.innerHTML = `
    <div class="category-header">
      <button class="back-btn">&larr; Back to Categories</button>
      <h2>${category.name}</h2>
    </div>
    <div id="simulations-grid" class="simulations-grid"></div>
  `;

  buildCategorySidebar();
  renderSimulations();

  document.querySelector('.back-btn').addEventListener('click', displayCategories);
  document.querySelector('.container').classList.add('sidebar-mode');
  sidebarToggle.classList.remove('hidden');
}

function buildCategorySidebar() {
  const categoryList = categorySidebar.querySelector('.category-list');
  categoryList.innerHTML = `
    <button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
      <span class="category-icon">🔬</span> All Simulations
    </button>
  `;
  allCategories.forEach(cat => {
    categoryList.innerHTML += `
      <button class="category-btn ${currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <span class="category-icon">${cat.icon}</span> ${cat.name}
      </button>
    `;
  });

  categorySidebar.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchCategory(btn.dataset.category);
    });
  });
}

function renderSimulations() {
  const grid = document.getElementById('simulations-grid');
  if (!grid) return;

  let filteredSims = (currentCategory === 'all')
    ? allSimulations
    : configLoader.getSimulationsByCategory(currentCategory);

  grid.innerHTML = '';
  if (filteredSims.length === 0) {
    grid.innerHTML = '<p>No simulations found in this category.</p>';
    return;
  }

  filteredSims.forEach((sim, index) => {
    grid.innerHTML += createSimulationCard(sim, index);
  });

  document.querySelectorAll('.sim-card').forEach(card => {
    card.addEventListener('click', () => {
      openSimulation(card.dataset.simId);
    });
  });
}

function createSimulationCard(sim, index) {
  return `
    <div class="sim-card" data-sim-id="${sim.id}" style="--card-index: ${index + 1};">
      <div class="sim-preview">
        <div class="preview-placeholder"><span>${sim.icon || '🧪'}</span></div>
      </div>
      <div class="sim-info">
        <h3>${sim.title}</h3>
        <p>${sim.description}</p>
      </div>
    </div>
  `;
}

function setupEventListeners() {
  sidebarToggle.addEventListener('click', () => {
    categorySidebar.classList.toggle('active');
  });

  closeSidebarBtn.addEventListener('click', () => {
    categorySidebar.classList.remove('active');
  });
}

function switchCategory(category) {
  currentCategory = category;
  buildCategorySidebar();
  renderSimulations();
}

function openSimulation(simId) {
  const sim = configLoader.getSimulationById(simId);
  if (!sim) return;

  window.location.href = sim.simulationPage;
}
