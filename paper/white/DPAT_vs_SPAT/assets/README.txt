================================================================================
SPAT vs DPAT Whitepaper - Asset Requirements
================================================================================

This folder should contain the following image assets for the whitepaper.
All images should be high-resolution (at least 1200px wide) for retina displays.
Recommended formats: PNG (for diagrams), JPG (for photos), SVG (for vector graphics)


REQUIRED FIGURES
================================================================================

1. figure1_variance_stack.png
   - Purpose: Variance Stack Analysis diagram
   - Content: A stacked bar chart or waterfall diagram showing the breakdown of
     total parameter variance into components:
     * Frontend wafer variance (silicon characteristics)
     * Assembly process variance (die attach, wire bond, mold)
     * Test measurement variance (equipment GR&R)
   - Suggested size: 1200x900px (4:3 ratio)
   - Style: Use the color palette from the site (purples, cyans, dark bg)

2. figure2_dpat_dependency.png
   - Purpose: DPAT Historical Dependency illustration
   - Content: A time-series visualization showing:
     * Historical lot distributions used to calculate DPAT limits
     * The rolling window concept
     * What happens when a new lot deviates from historical baseline
   - Suggested size: 1200x900px (4:3 ratio)
   - Consider showing: timeline, distribution curves, limit lines

3. figure3_comparison.png
   - Purpose: Side-by-side SPAT vs DPAT comparison
   - Content: A comparative visualization showing:
     * SPAT limit calculation (within-lot median ± k×MAD)
     * DPAT limit calculation (historical mean ± k×σ)
     * Escape and fallout regions highlighted
     * Performance under different conditions (stable/shifting/degraded)
   - Suggested size: 1200x900px (4:3 ratio)
   - Could be a 2x2 grid of scenarios

4. figure4_hybrid_framework.png
   - Purpose: Hybrid PAT Framework flowchart
   - Content: A decision flowchart showing:
     * Real-time stability assessment input
     * Decision gate (stable vs unstable)
     * DPAT path for stable processes
     * SPAT gate path for unstable processes
     * Feedback loop for continuous improvement
   - Suggested size: 1200x900px (4:3 ratio)
   - Style: Modern flowchart with rounded boxes, gradient accents


OPTIONAL ASSETS
================================================================================

5. author-avatar.png
   - Purpose: Author photo in footer
   - Content: Professional headshot or avatar
   - Suggested size: 200x200px (1:1 ratio, will be displayed at 48x48)
   - Will gracefully hide if not present

6. og-image.png (for social sharing)
   - Purpose: Open Graph image for link previews
   - Content: Title card with "SPAT vs DPAT in Backend Semiconductor Test"
   - Suggested size: 1200x630px (Facebook/LinkedIn standard)


DESIGN GUIDELINES
================================================================================

Color Palette (matches the website CSS):
- Background: #0a0a0f (dark)
- Primary accent: #8b5cf6 (purple)
- Secondary accent: #6366f1 (indigo)
- Tertiary accent: #06b6d4 (cyan)
- Success/SPAT: #10b981 (green)
- Warning: #f59e0b (amber)
- Error: #ef4444 (red)
- Text primary: #f8fafc (white)
- Text secondary: #94a3b8 (gray)

Typography:
- Use Inter or similar clean sans-serif font
- Keep text minimal in diagrams
- Use clear labels and legends

Style Tips:
- Use subtle gradients matching the site aesthetic
- Include subtle grid lines or graph paper effect
- Add slight glow effects on accent colors
- Keep backgrounds dark or transparent
- Ensure sufficient contrast for readability
- Consider how figures will look in print (PDF mode)


PLACEHOLDER BEHAVIOR
================================================================================

The webpage will display placeholder styling if images are missing:
- A gray background area will show instead
- The zoom modal will still open but show the broken image
- For best results, add all 4 main figures before publishing


PRINT CONSIDERATIONS
================================================================================

When users download the PDF version:
- Images will be included at their full resolution
- Dark backgrounds may consume more ink
- Consider creating light-mode versions for print if needed
- Test PDF output with actual images before release


================================================================================
Last updated: January 2025
================================================================================
