/**
 * SPAT vs DPAT Whitepaper - Interactive JavaScript
 * ================================================
 * Premium interactions for the technical whitepaper
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        // Progress & Navigation
        progressBar: document.getElementById('progressBar'),
        stickyNav: document.getElementById('stickyNav'),
        navLinks: document.querySelectorAll('.nav-link'),
        navMenuBtn: document.getElementById('navMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),

        // Theme Toggle
        themeToggle: document.getElementById('themeToggle'),
        heroThemeToggle: document.getElementById('heroThemeToggle'),
        themeSplitOverlay: document.getElementById('themeSplitOverlay'),
        themeTogglePointer: document.getElementById('themeTogglePointer'),

        // Sections
        sections: document.querySelectorAll('.section'),
        hero: document.getElementById('hero'),

        // Figures & Modal
        figureCards: document.querySelectorAll('.figure-card'),
        figureModal: document.getElementById('figureModal'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        modalClose: document.getElementById('modalClose'),
        modalImage: document.getElementById('modalImage'),
        modalTitle: document.getElementById('modalTitle'),
        modalDescription: document.getElementById('modalDescription'),

        // Simulator
        simTabs: document.querySelectorAll('.sim-tab'),
        simPanels: document.querySelectorAll('.sim-panel-tab'),
        simRunBtn: document.getElementById('simRunBtn'),
        simResetBtn: document.getElementById('simResetBtn'),

        // Scenarios
        scenarioChips: document.querySelectorAll('.scenario-chip'),
        narrativeContent: document.getElementById('narrativeContent'),

        // Download buttons
        downloadPdfBtn: document.getElementById('downloadPdfBtn'),
        footerDownloadBtn: document.getElementById('footerDownloadBtn')
    };

    // ============================================
    // THEME STATE
    // ============================================
    let themeState = {
        current: null, // 'light' or 'dark'
        userSelected: false,
        introTimeout: null,
        introActive: false
    };

    // ============================================
    // SCENARIO DATA
    // ============================================
    const scenarioData = {
        stable: {
            title: 'Ultra Stable Process',
            text: `In an ultra-stable manufacturing environment with mature processes and consistent
                   material quality, <strong>DPAT demonstrates optimal performance</strong>. Historical
                   baselines accurately represent current lot behavior, enabling tighter limits without
                   increased escape risk. SPAT shows 15-20% higher fallout due to lot-to-lot variation
                   being captured within limits. <strong>Recommendation:</strong> DPAT with quarterly
                   baseline refresh and stability monitoring.`,
            metrics: {
                spatFallout: '2.1%',
                dpatFallout: '0.8%',
                escapeRate: '0 ppm'
            }
        },
        shock: {
            title: 'Mix Shock Scenario',
            text: `When product mix changes suddenly or a new wafer lot enters production,
                   <strong>DPAT experiences significant escape risk</strong>. Historical baselines
                   become misaligned with current lot characteristics. SPAT's within-lot calculation
                   automatically adapts to the new distribution, maintaining escape prevention.
                   <strong>Recommendation:</strong> SPAT gating during mix transitions, with DPAT
                   re-qualification after 5+ stable lots.`,
            metrics: {
                spatFallout: '3.2%',
                dpatFallout: '1.5%',
                escapeRate: '45 ppm (DPAT)'
            }
        },
        degradation: {
            title: 'Process Degradation',
            text: `Gradual equipment degradation or material quality drift creates a
                   <strong>particularly dangerous scenario for DPAT</strong>. The slow shift causes
                   historical limits to encompass increasingly marginal parts. SPAT detects the
                   degradation through increased outlier detection rate, serving as an early warning.
                   <strong>Recommendation:</strong> Hybrid monitoring with SPAT fallout rate triggering
                   DPAT baseline reset.`,
            metrics: {
                spatFallout: '4.8%',
                dpatFallout: '2.1%',
                escapeRate: '120 ppm (DPAT)'
            }
        },
        chaos: {
            title: 'Chaos / Multi-Excursion',
            text: `In highly variable environments with multiple concurrent issues (equipment, material,
                   environment), <strong>DPAT fails catastrophically</strong>. Historical baselines become
                   meaningless as the process operates outside qualified conditions. SPAT provides the
                   only reliable quality gate, though with elevated fallout reflecting true process
                   instability. <strong>Recommendation:</strong> SPAT-only until process stability restored;
                   investigate root causes urgently.`,
            metrics: {
                spatFallout: '8.5%',
                dpatFallout: '4.2%',
                escapeRate: '500+ ppm (DPAT)'
            }
        }
    };

    // ============================================
    // FIGURE DATA
    // ============================================
    const figureData = {
        1: {
            src: 'assets/figure1_variance_stack.png',
            title: 'Figure 1: Variance Stack Analysis',
            description: 'Backend parametric distributions are shaped by stacked variance contributors (material, assembly, thermal, firmware, tester/toolchain), leading to non-stationary mean and sigma behavior over time.'
        },
        2: {
            src: 'assets/figure2_dpat_dependency.png',
            title: 'Figure 2: DPAT Rolling Dependency',
            description: 'DPAT limits are derived from recent rolling windows. When window data is not representative of the stable population (mix shifts, tool routing changes), DPAT limits may drift or oscillate.'
        },
        3: {
            src: 'assets/figure3_comparison.png',
            title: 'Figure 3: SPAT vs DPAT Performance',
            description: 'Side-by-side comparison showing the screening trade-offs: SPAT provides stable containment with slower adaptation, while DPAT adapts quickly but may overkill or miss defects under instability.'
        },
        4: {
            src: 'assets/figure4_hybrid_framework.png',
            title: 'Figure 4: Hybrid PAT Framework',
            description: 'Recommended deployment architecture: SPAT as the primary acceptance gate, DPAT as a conditional diagnostic layer activated in stable/traceable conditions.'
        }
    };

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    /**
     * Set the theme (light or dark)
     */
    function setTheme(theme) {
        themeState.current = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('whitepaper-theme', theme);
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        // Mark that user has selected a theme
        themeState.userSelected = true;

        // Clear the intro if it's still active
        if (themeState.introActive) {
            hideThemeIntro();
        }

        // If no theme is set yet, default to light (toggling from initial dark)
        const currentTheme = themeState.current || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    /**
     * Show the split-screen intro effect
     */
    function showThemeIntro() {
        themeState.introActive = true;

        // Show the split overlay
        if (elements.themeSplitOverlay) {
            elements.themeSplitOverlay.classList.add('active');
        }

        // Show the pointer after a brief delay
        setTimeout(() => {
            if (elements.themeTogglePointer && themeState.introActive) {
                elements.themeTogglePointer.classList.add('active');
            }
        }, 300);

        // Set timeout to auto-select light mode after 2 seconds
        themeState.introTimeout = setTimeout(() => {
            if (!themeState.userSelected) {
                setTheme('light');
                hideThemeIntro();
            }
        }, 2000);
    }

    /**
     * Hide the split-screen intro effect
     */
    function hideThemeIntro() {
        themeState.introActive = false;

        // Clear the timeout
        if (themeState.introTimeout) {
            clearTimeout(themeState.introTimeout);
            themeState.introTimeout = null;
        }

        // Hide overlay and pointer
        if (elements.themeSplitOverlay) {
            elements.themeSplitOverlay.classList.remove('active');
        }
        if (elements.themeTogglePointer) {
            elements.themeTogglePointer.classList.remove('active');
        }
    }

    /**
     * Handle scroll during intro - auto-select light if user scrolls
     */
    function handleIntroScroll() {
        if (themeState.introActive && !themeState.userSelected && window.scrollY > 50) {
            themeState.userSelected = true;
            setTheme('light');
            hideThemeIntro();
            // Remove this listener after it triggers
            window.removeEventListener('scroll', handleIntroScroll);
        }
    }

    /**
     * Select dark theme from intro
     */
    function selectDarkTheme() {
        themeState.userSelected = true;
        setTheme('dark');
        hideThemeIntro();
    }

    /**
     * Select light theme from intro
     */
    function selectLightTheme() {
        themeState.userSelected = true;
        setTheme('light');
        hideThemeIntro();
    }

    /**
     * Initialize theme system
     */
    function initTheme() {
        // Check for ?reset parameter to clear saved theme and show intro
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('reset') || urlParams.has('theme-reset')) {
            localStorage.removeItem('whitepaper-theme');
            // Clean up URL without reload
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, '', cleanUrl);
        }

        // Check for saved preference
        const savedTheme = localStorage.getItem('whitepaper-theme');

        if (savedTheme) {
            // User has a saved preference - use it
            themeState.userSelected = true;
            setTheme(savedTheme);
        } else {
            // No saved preference - show intro
            // Start with dark mode as the base (visible behind overlay)
            document.documentElement.removeAttribute('data-theme');
            showThemeIntro();

            // Listen for scroll to auto-select light
            window.addEventListener('scroll', handleIntroScroll, { passive: true });
        }

        // Add click handlers to theme toggle buttons
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
        if (elements.heroThemeToggle) {
            elements.heroThemeToggle.addEventListener('click', () => {
                themeState.userSelected = true;
                toggleTheme();
            });
        }

        // Click handlers for split overlay panels
        const splitLeft = document.getElementById('splitLeft');
        const splitRight = document.getElementById('splitRight');
        const darkLabel = document.getElementById('darkLabel');
        const lightLabel = document.getElementById('lightLabel');

        if (splitLeft) {
            splitLeft.addEventListener('click', (e) => {
                e.stopPropagation();
                selectDarkTheme();
            });
        }

        if (splitRight) {
            splitRight.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLightTheme();
            });
        }

        if (darkLabel) {
            darkLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                selectDarkTheme();
            });
        }

        if (lightLabel) {
            lightLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLightTheme();
            });
        }
    }

    // ============================================
    // SCROLL PROGRESS
    // ============================================
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        elements.progressBar.style.width = `${progress}%`;
    }

    // ============================================
    // STICKY NAV VISIBILITY
    // ============================================
    function updateStickyNav() {
        const heroBottom = elements.hero.offsetTop + elements.hero.offsetHeight - 100;
        const scrollTop = window.scrollY;

        if (scrollTop > heroBottom) {
            elements.stickyNav.classList.add('visible');
        } else {
            elements.stickyNav.classList.remove('visible');
        }
    }

    // ============================================
    // ACTIVE SECTION HIGHLIGHTING
    // ============================================
    function updateActiveSection() {
        const scrollTop = window.scrollY + 150;

        let activeSection = null;

        elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSection = section.id;
            }
        });

        elements.navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        const allNavLinks = [...elements.navLinks, ...elements.mobileNavLinks];

        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navHeight = elements.stickyNav.offsetHeight + 20;
                    const targetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function toggleMobileMenu() {
        elements.navMenuBtn.classList.toggle('active');
        elements.mobileMenu.classList.toggle('open');
    }

    function closeMobileMenu() {
        elements.navMenuBtn.classList.remove('active');
        elements.mobileMenu.classList.remove('open');
    }

    function initMobileMenu() {
        elements.navMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!elements.stickyNav.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // FIGURE MODAL
    // ============================================
    function openFigureModal(figureNum) {
        const data = figureData[figureNum];
        if (!data) return;

        elements.modalImage.src = data.src;
        elements.modalImage.alt = data.title;
        elements.modalTitle.textContent = data.title;
        elements.modalDescription.textContent = data.description;

        elements.figureModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Focus trap
        elements.modalClose.focus();
    }

    function closeFigureModal() {
        elements.figureModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function initFigureModal() {
        // Open modal on figure card click
        elements.figureCards.forEach(card => {
            card.addEventListener('click', () => {
                const figureNum = card.getAttribute('data-figure');
                openFigureModal(figureNum);
            });

            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const figureNum = card.getAttribute('data-figure');
                    openFigureModal(figureNum);
                }
            });
        });

        // Close modal
        elements.modalClose.addEventListener('click', closeFigureModal);
        elements.modalBackdrop.addEventListener('click', closeFigureModal);

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.figureModal.classList.contains('open')) {
                closeFigureModal();
            }
        });
    }

    // ============================================
    // SIMULATOR TABS
    // ============================================
    function switchSimulatorTab(tabName) {
        // Update tab buttons
        elements.simTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update panels
        elements.simPanels.forEach(panel => {
            if (panel.getAttribute('data-panel') === tabName) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });
    }

    function initSimulatorTabs() {
        elements.simTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                switchSimulatorTab(tabName);
            });
        });

        // Simulator buttons (placeholder functionality)
        if (elements.simRunBtn) {
            elements.simRunBtn.addEventListener('click', () => {
                const statusText = document.querySelector('.status-text');
                const statusIndicator = document.querySelector('.status-indicator');

                statusText.textContent = 'Running...';
                statusIndicator.style.background = 'var(--warning)';

                setTimeout(() => {
                    statusText.textContent = 'Complete';
                    statusIndicator.style.background = 'var(--success)';
                }, 2000);
            });
        }

        if (elements.simResetBtn) {
            elements.simResetBtn.addEventListener('click', () => {
                const statusText = document.querySelector('.status-text');
                const statusIndicator = document.querySelector('.status-indicator');

                statusText.textContent = 'Ready';
                statusIndicator.style.background = 'var(--success)';
            });
        }
    }

    // ============================================
    // SCENARIO CHIPS
    // ============================================
    function updateNarrativePanel(scenario) {
        const data = scenarioData[scenario];
        if (!data) return;

        // Fade out
        elements.narrativeContent.style.opacity = '0';

        setTimeout(() => {
            // Update content
            const html = `
                <h4 class="narrative-title">${data.title}</h4>
                <p class="narrative-text">${data.text}</p>
                <div class="narrative-metrics">
                    <div class="narrative-metric">
                        <span class="label">SPAT Fallout</span>
                        <span class="value">${data.metrics.spatFallout}</span>
                    </div>
                    <div class="narrative-metric">
                        <span class="label">DPAT Fallout</span>
                        <span class="value">${data.metrics.dpatFallout}</span>
                    </div>
                    <div class="narrative-metric">
                        <span class="label">Escape Rate</span>
                        <span class="value">${data.metrics.escapeRate}</span>
                    </div>
                </div>
            `;
            elements.narrativeContent.innerHTML = html;

            // Fade in
            elements.narrativeContent.style.opacity = '1';
        }, 200);
    }

    function initScenarioChips() {
        elements.scenarioChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Update active state
                elements.scenarioChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                // Update narrative
                const scenario = chip.getAttribute('data-scenario');
                updateNarrativePanel(scenario);
            });
        });
    }

    // ============================================
    // DOWNLOAD PDF
    // ============================================
    function triggerPdfDownload() {
        window.print();
    }

    function initPdfDownload() {
        if (elements.downloadPdfBtn) {
            elements.downloadPdfBtn.addEventListener('click', triggerPdfDownload);
        }
        if (elements.footerDownloadBtn) {
            elements.footerDownloadBtn.addEventListener('click', triggerPdfDownload);
        }
    }

    // ============================================
    // HERO BACKGROUND ANIMATION
    // ============================================
    function initHeroAnimation() {
        const heroGradient = document.querySelector('.hero-gradient');
        if (!heroGradient) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        function animateGradient() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            heroGradient.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
            requestAnimationFrame(animateGradient);
        }

        animateGradient();
    }

    // ============================================
    // CODE HIGHLIGHTING
    // ============================================
    function initCodeHighlighting() {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }

    // ============================================
    // SCROLL EVENT HANDLER (THROTTLED)
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    const handleScroll = throttle(() => {
        updateScrollProgress();
        updateStickyNav();
        updateActiveSection();
    }, 16); // ~60fps

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe cards and sections for animation
        const animatedElements = document.querySelectorAll(
            '.summary-card, .figure-card, .result-card, .formula-card, .reference-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // Add CSS for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        #narrativeContent {
            transition: opacity 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        // Event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', throttle(() => {
            updateScrollProgress();
            updateStickyNav();
        }, 100));

        // Initialize theme first (before other components)
        initTheme();

        // Initialize components
        initSmoothScroll();
        initMobileMenu();
        initFigureModal();
        initSimulatorTabs();
        initScenarioChips();
        initPdfDownload();
        initHeroAnimation();
        initCodeHighlighting();
        initScrollAnimations();

        // Initial state
        updateScrollProgress();
        updateStickyNav();
        updateActiveSection();

        console.log('SPAT vs DPAT Whitepaper initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // PUBLIC API (for simulator integration)
    // ============================================
    window.SpatDpatWhitepaper = {
        // Get simulator mount point
        getSimulatorRoot: () => document.getElementById('sim-root'),

        // Get individual panel elements
        getSimPanels: () => ({
            lots: document.getElementById('sim-lots'),
            limits: document.getElementById('sim-limits'),
            metrics: document.getElementById('sim-metrics')
        }),

        // Switch simulator tab programmatically
        switchTab: switchSimulatorTab,

        // Update narrative programmatically
        updateNarrative: updateNarrativePanel,

        // Get scenario data
        getScenarioData: () => scenarioData,

        // Open figure modal programmatically
        openFigure: openFigureModal,

        // Trigger PDF download
        downloadPdf: triggerPdfDownload,

        // Theme management
        setTheme: setTheme,
        toggleTheme: toggleTheme,
        getTheme: () => themeState.current,

        // Reset theme (for testing) - shows intro again
        resetTheme: () => {
            localStorage.removeItem('whitepaper-theme');
            themeState.userSelected = false;
            themeState.current = null;
            document.documentElement.removeAttribute('data-theme');
            showThemeIntro();
        }
    };

})();
