# Research: Canadian Mortgage Calculator Static Page App

**Date**: 2025-01-27  
**Feature**: Canadian Mortgage Calculator  
**Purpose**: Resolve technical unknowns and make technology decisions

## Technology Stack Decisions

### CSS Framework Selection

**Decision**: Tailwind CSS  
**Rationale**: 
- Utility-first approach ideal for custom financial interfaces
- Excellent responsive design utilities out of the box
- Built-in dark mode support via class variants
- Small bundle size when purged (typically <10KB)
- No opinionated component styles that would conflict with tabular data presentation

**Alternatives considered**:
- Bootstrap: Too opinionated, larger bundle, less flexible for custom designs
- Pure CSS: More development time, harder to maintain consistency
- Material-UI: Requires React/framework, not suitable for vanilla JS

### Build Tool Selection

**Decision**: Vite  
**Rationale**:
- Fastest build times for modern web development
- Zero-config for most use cases
- Excellent ES6+ support
- Built-in PWA plugin available
- Small production bundles with tree-shaking
- Native ES modules in development

**Alternatives considered**:
- Webpack: More complex configuration, slower builds
- Parcel: Less ecosystem support, fewer plugins
- No build tool: Would miss minification, bundling benefits

### Testing Framework Selection

**Decision**: Vitest (unit) + Playwright (E2E)  
**Rationale**:
- Vitest: Jest-compatible API, native ES modules support, fast execution, works well with Vite
- Playwright: Cross-browser testing, mobile device emulation, GitHub Actions integration

**Alternatives considered**:
- Jest + Cypress: Slower, more complex setup with ES modules
- Mocha + Selenium: Older ecosystem, more boilerplate

## Canadian Mortgage Calculation Requirements

### PMT Formula Implementation

**Decision**: Standard PMT formula with monthly compounding  
**Formula**: `PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)`  
Where:
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12)
- n = Total number of payments

**Canadian Specifics**:
- Semi-annual compounding for fixed rates: `r = (1 + annual_rate/2)^(1/6) - 1`
- Maximum amortization: 25 years for high-ratio mortgages (>80% LTV)
- Minimum down payment: 5% for homes under $500,000

### Currency Formatting

**Decision**: Intl.NumberFormat with CAD locale  
**Implementation**: 
```javascript
new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
```

**Rationale**: Native browser API, consistent formatting, handles edge cases

### Decimal Precision

**Decision**: Use decimal.js library  
**Rationale**:
- Prevents floating-point arithmetic errors
- Required for financial calculations
- Meets SC-002 requirement (CAD $0.01 accuracy)
- Lightweight (~30KB minified)

## Progressive Web App Implementation

**Decision**: Implement basic PWA features  
**Features**:
- Service worker for offline capability
- Web app manifest for installability
- Cache-first strategy for static assets
- Network-first for calculation results

**Rationale**: Meets constitution requirement for offline use, improves performance

## State Management

**Decision**: Vanilla JavaScript with localStorage  
**Implementation**:
- Use localStorage for persisting scenarios
- Event-driven updates between components
- No external state management library needed

**Rationale**: Keeps bundle size small, no framework overhead, sufficient for requirements

## Responsive Design Approach

**Decision**: Mobile-first with CSS Grid + Flexbox  
**Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

**Rationale**: Modern CSS features, excellent browser support, no JavaScript required

## Performance Optimizations

**Decisions**:
1. Lazy load amortization schedule (virtual scrolling for large tables)
2. Web Workers for complex calculations
3. Code splitting for comparison features
4. Preload critical fonts
5. Inline critical CSS

**Rationale**: Meets <2s load time on 3G requirement

## Accessibility Implementation

**Decisions**:
1. Semantic HTML5 elements
2. ARIA labels for complex interactions
3. Keyboard navigation for all features
4. Focus management for modals/dialogs
5. Screen reader announcements for calculations

**Tools**: axe-core for automated testing

## CI/CD Pipeline Architecture

**Decision**: GitHub Actions with multiple stages  
**Stages**:
1. Lint and format check
2. Unit tests with coverage
3. Build production bundle
4. E2E tests on build
5. Deploy to GitHub Pages

**Rationale**: Free for public repos, integrated with GitHub, supports matrix testing

## Browser Support

**Decision**: Modern browsers only (last 2 versions)  
**Targets**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Rationale**: Allows use of modern JavaScript features, reduces polyfill needs

## All Clarifications Resolved

All NEEDS CLARIFICATION items from the implementation plan have been resolved:
- ✅ CSS Framework: Tailwind CSS
- ✅ Build Tool: Vite
- ✅ Testing Framework: Vitest + Playwright
- ✅ All technical decisions documented with rationale
