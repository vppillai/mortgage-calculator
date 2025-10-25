# Tasks: Canadian Mortgage Calculator Static Page App

**Input**: Design documents from `/specs/001-mortgage-calculator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests included as FR-014 explicitly requires comprehensive test coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize package.json with Vite, Tailwind CSS, decimal.js dependencies
- [x] T003 [P] Configure ESLint and Prettier for JavaScript code standards
- [x] T004 [P] Setup Vite configuration with PWA plugin in vite.config.js
- [x] T005 [P] Configure Tailwind CSS with dark mode support in tailwind.config.js
- [x] T006 [P] Create base HTML structure in src/index.html
- [x] T007 [P] Setup GitHub Actions workflow in .github/workflows/deploy.yml
- [x] T008 [P] Configure Vitest for unit testing in vitest.config.js
- [x] T009 [P] Configure Playwright for E2E testing in playwright.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create Canadian mortgage constants in src/utils/constants.js
- [x] T011 [P] Implement decimal.js wrapper for precise calculations in src/utils/decimal-wrapper.js
- [x] T012 [P] Create base CSS structure with Tailwind in src/styles/main.css
- [x] T013 [P] Implement theme system (dark/light) in src/styles/themes.css
- [x] T014 [P] Create responsive grid system in src/styles/responsive.css
- [x] T015 [P] Implement localStorage service in src/services/storage.js
- [x] T016 [P] Create event bus for component communication in src/utils/eventBus.js
- [x] T017 Setup Web Worker for calculations in src/workers/calculator.worker.js
- [x] T018 Create error handling utilities in src/utils/errors.js
- [x] T019 Implement logging service in src/utils/logger.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Canadian Mortgage Payment Calculation (Priority: P1) 🎯 MVP

**Goal**: Enable users to calculate monthly mortgage payments with Canadian formulas

**Independent Test**: Can be fully tested by entering loan amount, rate, term and verifying CAD payment calculation

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T020 [P] [US1] Unit test for PMT calculation with Canadian compounding in tests/unit/mortgageCalculator.test.js
- [x] T021 [P] [US1] Unit test for payment frequency calculations in tests/unit/paymentFrequency.test.js
- [x] T022 [P] [US1] Unit test for input validation rules in tests/unit/validation.test.js
- [x] T023 [P] [US1] Unit test for CAD currency formatting in tests/unit/currencyFormatter.test.js
- [x] T024 [P] [US1] Integration test for calculation flow in tests/integration/scenarios.test.js
- [x] T025 [US1] E2E test for basic calculation user journey in tests/e2e/userFlows.test.js

### Implementation for User Story 1

- [x] T026 [P] [US1] Implement mortgage calculation engine with PMT formula in src/services/mortgageCalculator.js
- [x] T027 [P] [US1] Create input validation service in src/services/validation.js
- [x] T028 [P] [US1] Implement CAD currency formatter in src/services/currencyFormatter.js
- [x] T029 [US1] Create Calculator UI component in src/components/Calculator.js
- [x] T030 [US1] Implement calculation result display component in src/components/CalculationResult.js
- [x] T031 [US1] Add form validation and error display in Calculator component
- [x] T032 [US1] Connect Calculator to mortgage calculation service
- [x] T033 [US1] Implement real-time calculation updates on input change
- [x] T034 [US1] Add payment breakdown display (principal, interest, total)
- [x] T035 [US1] Create help tooltips for mortgage terms

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Pre-payment Scenario Analysis (Priority: P2)

**Goal**: Allow users to explore extra payment options and see interest savings

**Independent Test**: Can test by adding extra payments and verifying updated payoff date and savings

### Tests for User Story 2 ⚠️

- [ ] T036 [P] [US2] Unit test for prepayment calculations in tests/unit/prepaymentCalculator.test.js
- [ ] T037 [P] [US2] Unit test for interest savings calculations in tests/unit/interestSavings.test.js
- [ ] T038 [P] [US2] Integration test for prepayment scenarios in tests/integration/prepaymentScenarios.test.js
- [ ] T039 [US2] E2E test for prepayment user flow in tests/e2e/prepaymentFlow.test.js

### Implementation for User Story 2

- [ ] T040 [P] [US2] Extend mortgage calculator for prepayment logic in src/services/mortgageCalculator.js
- [ ] T041 [P] [US2] Create prepayment options component in src/components/PrepaymentOptions.js
- [ ] T042 [US2] Implement prepayment frequency selector (per-payment, annual, one-time)
- [ ] T043 [US2] Create prepayment results display component in src/components/PrepaymentResults.js
- [ ] T044 [US2] Add prepayment slider for interactive adjustments
- [ ] T045 [US2] Display interest savings and months saved prominently
- [ ] T046 [US2] Implement prepayment start date selector
- [ ] T047 [US2] Update calculation engine to handle prepayments in Web Worker

**Checkpoint**: User Story 2 complete - prepayment analysis fully functional

---

## Phase 5: User Story 3 - Multiple Option Comparison (Priority: P2)

**Goal**: Enable side-by-side comparison of up to 5 mortgage scenarios

**Independent Test**: Can test by creating multiple scenarios and verifying comparison table functionality

### Tests for User Story 3 ⚠️

- [ ] T048 [P] [US3] Unit test for comparison table logic in tests/unit/comparisonTable.test.js
- [ ] T049 [P] [US3] Unit test for scenario management in tests/unit/scenarioManager.test.js
- [ ] T050 [P] [US3] Integration test for comparison features in tests/integration/comparisonFlow.test.js
- [ ] T051 [US3] E2E test for comparison user journey in tests/e2e/comparisonFlow.test.js

### Implementation for User Story 3

- [ ] T052 [P] [US3] Create MortgageScenario data model implementation in src/models/MortgageScenario.js
- [ ] T053 [P] [US3] Create ComparisonTable data model in src/models/ComparisonTable.js
- [ ] T054 [P] [US3] Implement scenario manager service in src/services/scenarioManager.js
- [ ] T055 [US3] Create comparison table component in src/components/ComparisonTable.js
- [ ] T056 [US3] Implement "Add to Comparison" button in Calculator component
- [ ] T057 [US3] Add drag-and-drop reordering for scenarios
- [ ] T058 [US3] Implement sortable columns (by payment, interest, total cost)
- [ ] T059 [US3] Highlight best option automatically based on lowest cost
- [ ] T060 [US3] Add scenario naming and editing capabilities
- [ ] T061 [US3] Implement scenario limit validation (max 5)
- [ ] T062 [US3] Create mobile-responsive horizontal scrolling for table

**Checkpoint**: User Story 3 complete - comparison functionality fully operational

---

## Phase 6: User Story 4 - Reverse Calculation (Priority: P3)

**Goal**: Calculate loan amount from payment or find required interest rate

**Independent Test**: Can test by entering target payment and verifying calculated loan amount

### Tests for User Story 4 ⚠️

- [ ] T063 [P] [US4] Unit test for reverse PMT calculations in tests/unit/reverseCalculator.test.js
- [ ] T064 [P] [US4] Unit test for interest rate solver in tests/unit/rateSolver.test.js
- [ ] T065 [P] [US4] Integration test for reverse calculation flow in tests/integration/reverseFlow.test.js
- [ ] T066 [US4] E2E test for reverse calculation journey in tests/e2e/reverseCalculation.test.js

### Implementation for User Story 4

- [ ] T067 [P] [US4] Implement reverse PMT formula in src/services/reverseCalculator.js
- [ ] T068 [P] [US4] Create interest rate solver using Newton's method in src/services/rateSolver.js
- [ ] T069 [US4] Build reverse calculation UI component in src/components/ReverseCalculator.js
- [ ] T070 [US4] Add mode switcher between standard and reverse calculations
- [ ] T071 [US4] Implement input validation for reverse calculations
- [ ] T072 [US4] Display reverse calculation results clearly
- [ ] T073 [US4] Add convergence error handling for rate solver
- [ ] T074 [US4] Update help content for reverse calculation features

**Checkpoint**: User Story 4 complete - reverse calculations functional

---

## Phase 7: User Story 5 - Mobile-Friendly Interface (Priority: P3)

**Goal**: Ensure all features work seamlessly on mobile devices

**Independent Test**: Can test on mobile devices/emulators verifying touch interactions and responsive layout

### Tests for User Story 5 ⚠️

- [ ] T075 [P] [US5] Mobile viewport tests in tests/e2e/mobileResponsive.test.js
- [ ] T076 [P] [US5] Touch interaction tests in tests/e2e/touchInteractions.test.js
- [ ] T077 [P] [US5] Theme persistence tests in tests/integration/themePersistence.test.js
- [ ] T078 [US5] Mobile comparison table tests in tests/e2e/mobileComparison.test.js

### Implementation for User Story 5

- [ ] T079 [P] [US5] Implement mobile-first responsive layouts in all components
- [ ] T080 [P] [US5] Create touch-friendly input controls with larger tap targets
- [ ] T081 [US5] Implement mobile navigation menu in src/components/MobileNav.js
- [ ] T082 [US5] Add swipe gestures for scenario comparison
- [ ] T083 [US5] Optimize comparison table for mobile with sticky headers
- [ ] T084 [US5] Create mobile-specific CSS breakpoints
- [ ] T085 [US5] Implement theme toggle component in src/components/ThemeToggle.js
- [ ] T086 [US5] Ensure theme preference persists across sessions
- [ ] T087 [US5] Add viewport meta tags for proper mobile scaling
- [ ] T088 [US5] Test and fix any layout issues on iOS Safari

**Checkpoint**: User Story 5 complete - fully mobile responsive

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T089 [P] Create comprehensive help documentation in src/components/HelpModal.js
- [ ] T090 [P] Implement PWA manifest and icons in public/manifest.json
- [ ] T091 [P] Create service worker for offline functionality in src/sw.js
- [ ] T092 [P] Add Google Analytics or privacy-friendly analytics
- [ ] T093 Implement amortization schedule display in src/components/AmortizationSchedule.js
- [ ] T094 Add virtual scrolling for large amortization tables
- [ ] T095 Create print-friendly styles for results and comparisons
- [ ] T096 Add keyboard shortcuts for power users
- [ ] T097 Implement calculation history with undo/redo
- [ ] T098 [P] Add meta tags for SEO and social sharing
- [ ] T099 [P] Create 404 page for GitHub Pages
- [ ] T100 Run accessibility audit and fix any issues
- [ ] T101 Performance optimization and bundle size reduction
- [ ] T102 Cross-browser testing and polyfills if needed
- [ ] T103 Final E2E test suite covering all user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel if multiple developers available
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on at least User Story 1-3 being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - true MVP
- **User Story 2 (P2)**: Builds on US1 calculator but independently testable
- **User Story 3 (P2)**: Can start after US1, no dependency on US2
- **User Story 4 (P3)**: Independent of US2/US3, only needs US1 foundation
- **User Story 5 (P3)**: Can start anytime after US1, affects all stories

### Within Each User Story

1. Tests MUST be written first and fail before implementation
2. Data models/services before UI components
3. Core implementation before integration
4. Each story complete and tested before next

### Parallel Opportunities

- All Setup tasks marked [P] can run simultaneously
- All Foundational tasks marked [P] can run simultaneously
- Unit tests within each story can run in parallel
- Different user stories can be developed by different team members
- Polish tasks marked [P] can run in parallel

---

## Parallel Execution Examples

### Phase 1 Setup - Launch all [P] tasks together:
```bash
# Terminal 1
npm init && npm install vite tailwindcss decimal.js --save

# Terminal 2  
npm install -D vitest playwright @playwright/test

# Terminal 3
Create .github/workflows/deploy.yml

# Terminal 4
Setup ESLint and Prettier configs
```

### User Story 1 Tests - Launch all unit tests together:
```bash
# Can run simultaneously as they test different modules
npm run test tests/unit/mortgageCalculator.test.js
npm run test tests/unit/validation.test.js  
npm run test tests/unit/currencyFormatter.test.js
```

### User Story 3 Implementation - Parallel model creation:
```bash
# Developer A
Create src/models/MortgageScenario.js

# Developer B  
Create src/models/ComparisonTable.js

# Developer C
Create src/services/scenarioManager.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test basic calculator independently
5. Deploy to GitHub Pages
6. Gather user feedback

### Incremental Delivery

1. Foundation + US1 → Deploy MVP
2. Add US2 (Prepayments) → Deploy Update 1
3. Add US3 (Comparison) → Deploy Update 2
4. Add US4 + US5 → Deploy Update 3
5. Polish → Final Release

### Parallel Team Strategy (3 developers)

After Foundational phase:
- Developer A: User Story 1 + User Story 4
- Developer B: User Story 2 + User Story 5  
- Developer C: User Story 3 + Polish tasks

---

## Summary

- **Total Tasks**: 103
- **Setup Tasks**: 9 (7 parallelizable)
- **Foundational Tasks**: 10 (6 parallelizable)
- **User Story 1**: 16 tasks (MVP)
- **User Story 2**: 12 tasks
- **User Story 3**: 15 tasks
- **User Story 4**: 12 tasks
- **User Story 5**: 14 tasks
- **Polish Tasks**: 15 tasks (8 parallelizable)

**MVP Scope**: Phases 1-3 (35 tasks) deliver working calculator
**Full Scope**: All phases (103 tasks) deliver complete feature set

All tasks follow checklist format with IDs, parallel markers, story labels, and file paths.
