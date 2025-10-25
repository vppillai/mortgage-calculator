# Implementation Plan: Canadian Mortgage Calculator Static Page App

**Branch**: `001-mortgage-calculator` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mortgage-calculator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a static page application for Canadian mortgage calculations featuring accurate payment calculations, pre-payment analysis, reverse calculations, and multi-scenario comparison. The app targets Canadian customers with CAD currency, requires mobile-responsive design with dark/light modes, and must be deployable to GitHub Pages with CI/CD automation.

## Technical Context

**Language/Version**: JavaScript ES6+ (static site, no backend framework)  
**Primary Dependencies**: Tailwind CSS, Vite build tool, decimal.js for precision math  
**Storage**: localStorage for scenario persistence (client-side only)  
**Testing**: Vitest for unit tests, Playwright for E2E tests  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), GitHub Pages hosting
**Project Type**: single (static web application)  
**Performance Goals**: <2s page load on 3G, 60fps UI animations, instant calculation response  
**Constraints**: <5MB total bundle size, offline-capable via PWA, no server dependencies  
**Scale/Scope**: Single-page application, ~10 screens/views, unlimited concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Mathematical Accuracy Compliance
- [x] All calculation formulas documented with industry-standard sources (PMT formula required)
- [x] Test scenarios defined for cross-validation against known results (FR-014 specifies)
- [x] Precision requirements specified (no floating-point errors) (SC-002: CAD $0.01 accuracy)
- [x] Edge cases and boundary conditions identified (9 edge cases documented)

### User Experience Standards
- [x] Responsive design approach confirmed (mobile-first) (FR-007, User Story 5)
- [x] Dark/light mode support planned (FR-006)
- [x] Tabular data presentation strategy defined (FR-005, multiple references)
- [x] Accessibility requirements (WCAG 2.1 AA) planned (Constitution requires)

### Static Page Requirements
- [x] GitHub Pages compatibility confirmed (FR-013, spec requirements)
- [x] No server-side dependencies planned (Technical Context confirms)
- [x] Progressive Web App capabilities considered (Constitution mentions)
- [x] Performance targets defined (<2s load time) (SC-004)

### Testing & CI/CD
- [x] Automated testing strategy for calculations (FR-014, SC-008)
- [x] Cross-browser testing plan (Constitution requires)
- [x] GitHub Actions workflow planned (FR-015)
- [x] Deployment automation to GitHub Pages (FR-015, Constitution)

## Project Structure

### Documentation (this feature)

```text
specs/001-mortgage-calculator/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/          # UI components
│   ├── Calculator.js    # Main calculator component
│   ├── ComparisonTable.js # Scenario comparison component
│   ├── AmortizationSchedule.js # Payment schedule display
│   └── ThemeToggle.js   # Dark/light mode switcher
├── services/            # Business logic
│   ├── mortgageCalculator.js # Core calculation engine
│   ├── currencyFormatter.js  # CAD formatting utilities
│   └── validation.js    # Input validation
├── styles/              # CSS/styling
│   ├── main.css         # Main styles
│   ├── themes.css       # Dark/light mode themes
│   └── responsive.css   # Mobile-specific styles
├── utils/               # Utility functions
│   └── constants.js     # Canadian mortgage constants
└── index.html           # Main HTML entry point

tests/
├── unit/                # Unit tests
│   ├── mortgageCalculator.test.js
│   ├── validation.test.js
│   └── currencyFormatter.test.js
├── integration/         # Integration tests
│   └── scenarios.test.js
└── e2e/                 # End-to-end tests
    └── userFlows.test.js

dist/                    # Build output (git-ignored)
├── js/                  # Minified JavaScript
├── css/                 # Minified CSS
└── index.html           # Production HTML

.github/
└── workflows/
    └── deploy.yml       # GitHub Actions CI/CD
```

**Structure Decision**: Single static web application structure chosen for GitHub Pages deployment. All code is client-side JavaScript with no backend dependencies. The structure separates concerns between UI components, business logic services, and styling while maintaining testability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
