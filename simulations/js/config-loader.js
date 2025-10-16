class SimulationConfigLoader {
  constructor(csvPath) {
    this.csvPath = csvPath;
    this.simulations = [];
    this.categories = this.getDefaultCategories();
  }

  getDefaultCategories() {
    return [
      {
        id: "physics",
        name: "Physics Simulations",
        icon: "⚛️",
        description: "Explore fundamental physics concepts through interactive demonstrations"
      },
      {
        id: "chemistry",
        name: "Chemistry Simulations",
        icon: "🧪",
        description: "Visualize molecular interactions and chemical processes"
      },
      {
        id: "mathematics",
        name: "Mathematical Visualizations",
        icon: "📐",
        description: "Interactive demonstrations of mathematical concepts and algorithms"
      },
      {
        id: "swarm",
        name: "Swarm Intelligence",
        icon: "🐝",
        description: "Agent-based models and emergent behavior systems"
      },
      {
        id: "engineering",
        name: "Engineering Systems",
        icon: "⚙️",
        description: "Real-world engineering problems and solutions"
      }
    ];
  }

  async load() {
    try {
      const response = await fetch(this.csvPath);
      const csvText = await response.text();
      this.simulations = this.parseCSV(csvText);
      return {
        simulations: this.simulations,
        categories: this.categories
      };
    } catch (error) {
      console.error('Error loading simulations config:', error);
      return {
        simulations: [],
        categories: this.categories
      };
    }
  }

  parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = this.parseCSVLine(lines[0]);
    const simulations = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = this.parseCSVLine(lines[i]);
      const simulation = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Parse arrays (tags, features)
        if (header === 'tags' || header === 'features') {
          value = value.split('|').filter(v => v.trim() !== '');
        }
        
        simulation[header] = value;
      });

      // Structure preview media
      simulation.previewMedia = {
        type: simulation.previewType,
        path: simulation.previewPath,
        fallbackImage: simulation.fallbackImage
      };

      // Clean up temporary fields
      delete simulation.previewType;
      delete simulation.previewPath;
      delete simulation.fallbackImage;

      simulations.push(simulation);
    }

    return simulations;
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Handle escaped quotes
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add the last field
    result.push(current.trim());

    return result;
  }

  getSimulationById(id) {
    return this.simulations.find(sim => sim.id === id);
  }

  getSimulationsByCategory(categoryId) {
    return this.simulations.filter(sim => sim.category === categoryId && sim.status === 'active');
  }

  getSimulationsByTag(tag) {
    return this.simulations.filter(sim => 
      sim.tags.includes(tag) && sim.status === 'active'
    );
  }

  getSimulationsByDifficulty(difficulty) {
    return this.simulations.filter(sim => 
      sim.difficulty === difficulty && sim.status === 'active'
    );
  }


  getAllTags() {
    const tags = new Set();
    this.simulations.forEach(sim => {
      sim.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  getAllCategories() {
    const categories = new Set();
    this.simulations.forEach(sim => {
      categories.add(sim.category);
    });
    return Array.from(categories);
  }

  searchSimulations(query) {
    const lowerQuery = query.toLowerCase();
    return this.simulations.filter(sim => {
      return (
        sim.status === 'active' &&
        (sim.title.toLowerCase().includes(lowerQuery) ||
         sim.shortDescription.toLowerCase().includes(lowerQuery) ||
         sim.fullDescription.toLowerCase().includes(lowerQuery) ||
         sim.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimulationConfigLoader;
}

export default SimulationConfigLoader;