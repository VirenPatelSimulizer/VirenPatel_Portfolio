
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selectors ---
  const sidebar = document.getElementById('category-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const closeSidebarBtn = document.getElementById('close-sidebar');
  const mainContainer = document.querySelector('.container');
  const galleryView = document.getElementById('gallery-view');
  const simulationView = document.getElementById('simulation-view');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const backToGalleryBtn = document.getElementById('back-to-gallery');
  const simulationViewContent = document.getElementById('simulation-view-content');

  // --- Data for Simulations ---
  const simulationsData = {
    'swarm-intelligence': {
      title: 'Swarm Intelligence',
      icon: '🦋',
      simulations: [
        { title: 'Boids Flocking', description: 'Classic flocking behavior simulation.', tags: ['classic', 'flocking'], url: 'simulations/sim2.html' },
        { title: 'Ant Colony Optimization', description: 'Visualizing how ants find the shortest path.', tags: ['optimization', 'ants'], url: '#' },
      ]
    },
    'cellular-automata': {
      title: 'Cellular Automata',
      icon: '🔳',
      simulations: [
        { title: 'Conway's Game of Life', description: 'A zero-player game based on initial state.', tags: ['classic', 'grid'], url: '#' },
        { title: 'Elementary Automata', description: 'Exploring Stephen Wolfram's simple computational systems.', tags: ['1D', 'rules'], url: '#' },
      ]
    },
    'physics-based': {
      title: 'Physics-Based Models',
      icon: '⚛️',
      simulations: [
        { title: 'Particle Systems', description: 'Simulating effects like fire, smoke, or water.', tags: ['particles', 'effects'], url: '#' },
        { title: 'Gravity Simulation', description: 'N-body simulation of gravitational attraction.', tags: ['gravity', 'space'], url: '#' },
      ]
    }
  };

  let activeCategory = null;
  let activeTag = 'all';

  // --- Functions ---

  // Toggle sidebar visibility
  const toggleSidebar = (forceOpen = null) => {
    const shouldOpen = forceOpen !== null ? forceOpen : !sidebar.classList.contains('active');
    if (shouldOpen) {
      sidebar.classList.add('active');
      if (window.innerWidth <= 768) {
        mainContainer.style.filter = 'blur(5px)';
      }
    } else {
      sidebar.classList.remove('active');
      mainContainer.style.filter = 'none';
    }
  };

  // Render simulations for a given category
  const renderSimulations = () => {
    if (!activeCategory) return;

    const categoryData = simulationsData[activeCategory];
    const allTags = ['all', ...new Set(categoryData.simulations.flatMap(s => s.tags))];
    
    const filteredSims = categoryData.simulations.filter(sim => 
      activeTag === 'all' || sim.tags.includes(activeTag)
    );

    const tagsHtml = allTags.map(tag => `
      <button class="tag-filter-btn ${tag === activeTag ? 'active' : ''}" data-tag="${tag}">
        ${tag.charAt(0).toUpperCase() + tag.slice(1)}
      </button>
    `).join('');

    const simsHtml = filteredSims.map((sim, index) => `
      <div class="sim-card" style="--card-index: ${index};">
        <div class="sim-preview">
          <div class="preview-placeholder"><span>${categoryData.icon}</span></div>
        </div>
        <div class="sim-info">
          <h3>${sim.title}</h3>
          <p>${sim.description}</p>
          <a href="${sim.url}" class="sim-btn">Launch Sim</a>
        </div>
      </div>
    `).join('');

    simulationViewContent.innerHTML = `
      <div class="category-header">
        <h2>${categoryData.title}</h2>
        <button class="back-btn" id="back-to-gallery-dynamic">← Back to Gallery</button>
      </div>
      <div class="tag-filters">${tagsHtml}</div>
      <div class="simulations-grid">${simsHtml || '<p>No simulations found for this tag.</p>'}</div>
    `;

    // Re-add event listeners for dynamically created elements
    document.getElementById('back-to-gallery-dynamic').addEventListener('click', showGalleryView);
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTag = btn.dataset.tag;
        renderSimulations();
      });
    });
  };

  // Show the main category gallery
  const showGalleryView = () => {
    galleryView.style.display = 'block';
    simulationView.style.display = 'none';
    activeCategory = null;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  };

  // Show the simulation list for a category
  const showSimulationView = (category) => {
    activeCategory = category;
    activeTag = 'all';
    galleryView.style.display = 'none';
    simulationView.style.display = 'block';
    renderSimulations();
    
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    if (window.innerWidth <= 768) {
      toggleSidebar(false);
    }
  };

  // Handle window resize for responsive sidebar behavior
  const handleResize = () => {
    if (window.innerWidth > 768) {
      mainContainer.classList.add('sidebar-mode');
      sidebar.classList.add('persistent');
      sidebarToggle.classList.add('hidden');
      toggleSidebar(true); // Keep it open
    } else {
      mainContainer.classList.remove('sidebar-mode');
      sidebar.classList.remove('persistent');
      sidebarToggle.classList.remove('hidden');
      toggleSidebar(false); // Close it by default on mobile
    }
  };

  // --- Event Listeners ---
  sidebarToggle.addEventListener('click', () => toggleSidebar());
  closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      showSimulationView(category);
    });
  });

  if (backToGalleryBtn) backToGalleryBtn.addEventListener('click', showGalleryView);

  // --- Initial State ---
  if (simulationView) simulationView.style.display = 'none';
  
  // Initialize responsive behavior
  handleResize();
  window.addEventListener('resize', handleResize);
});
