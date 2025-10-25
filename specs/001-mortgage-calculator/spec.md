# Feature Specification: Canadian Mortgage Calculator Static Page App

**Feature Branch**: `001-mortgage-calculator`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Create a static page app that will be used to calculate the different mortgage payment related options for the user. This will help identify the best options for the user based on their financial situation and repayment requirements. The user must be able to play around with pre-payment options, do reverse calculations to find out the different payment methods that can be used to achieve a specific payment amount or amortization period. The page must be able to clearely show the user a comparison of the different payment options and the total cost of the mortgage over the lifetime of the loan. The user must be able to add multiple options into a table for comparison and the comparison must be shown in a mobile friendly way. We will be hosting this page as a static page on github pages. The page must be responsive and mobile friendly. The page must support dark mode and light mode. There must be test and deployment CI/CD pipeline in place that can be used with github actions. The mathematical calculations must always be accurate and the user must be able to trust the results. There must be a clear and easy to understand explanation of the different mortgage payment options and how they are calculated. Use tabular format and minimal verbose formats to send a clear message to the user. During testing, cross check calculations against known values for the different mortgage payment options. The page must be intuitive and easy to use. The user must be able to easily understand the different mortgage payment options and how to use the page. The primary currency is CAD and this is targeting Canadian customers."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Canadian Mortgage Payment Calculation (Priority: P1)

A Canadian user wants to calculate their monthly mortgage payment for a standard loan in CAD to understand their financial commitment.

**Why this priority**: This is the core functionality that provides immediate value. Canadian users need to know their basic payment amount in CAD before exploring other options.

**Independent Test**: Can be fully tested by entering loan amount in CAD, interest rate, and term to get accurate monthly payment calculation and delivers immediate financial planning value.

**Acceptance Scenarios**:

1. **Given** a Canadian user has a loan amount in CAD, interest rate, and loan term, **When** they enter these values and click calculate, **Then** they see their monthly payment amount in CAD
2. **Given** a user enters invalid values (negative amounts, zero interest), **When** they attempt to calculate, **Then** they see clear error messages explaining what needs to be corrected
3. **Given** a user wants to understand their payment breakdown, **When** they view the calculation results, **Then** they see principal, interest, and total payment clearly displayed in CAD

---

### User Story 2 - Pre-payment Scenario Analysis (Priority: P2)

A user wants to explore how making extra payments will affect their loan payoff timeline and total interest paid.

**Why this priority**: Pre-payment analysis is a key differentiator that helps users optimize their financial strategy and save money over the loan lifetime.

**Independent Test**: Can be fully tested by adding extra payment amounts and seeing updated amortization schedule and total savings calculations.

**Acceptance Scenarios**:

1. **Given** a user has calculated their basic mortgage payment, **When** they add a monthly extra payment amount, **Then** they see updated payoff date and total interest savings
2. **Given** a user wants to see the impact of different extra payment amounts, **When** they adjust the extra payment slider, **Then** they see real-time updates to their savings and payoff timeline
3. **Given** a user wants to understand the long-term impact, **When** they view the pre-payment results, **Then** they see a clear comparison showing total interest saved and months of payments eliminated

---

### User Story 3 - Multiple Option Comparison (Priority: P2)

A user wants to compare different mortgage scenarios side-by-side to make an informed decision about their best option.

**Why this priority**: Comparison functionality is essential for decision-making and provides significant value by helping users identify the most cost-effective option.

**Independent Test**: Can be fully tested by adding multiple mortgage scenarios to a comparison table and seeing clear differences in total costs and payment schedules.

**Acceptance Scenarios**:

1. **Given** a user has calculated one mortgage scenario, **When** they click "Add to Comparison", **Then** the scenario appears in a comparison table
2. **Given** a user has multiple scenarios in comparison, **When** they view the comparison table, **Then** they see side-by-side comparison of monthly payments, total interest, and payoff dates
3. **Given** a user wants to identify the best option, **When** they review the comparison, **Then** the most cost-effective option is clearly highlighted

---

### User Story 4 - Reverse Calculation (Priority: P3)

A user wants to determine what loan amount they can afford based on their desired monthly payment or find the interest rate needed for a specific payment amount.

**Why this priority**: Reverse calculations provide advanced functionality for users who know their budget constraints and need to work backwards to find suitable loan terms.

**Independent Test**: Can be fully tested by entering a target payment amount and getting calculated loan amount or required interest rate.

**Acceptance Scenarios**:

1. **Given** a user knows their maximum monthly payment, **When** they enter this amount with interest rate and term, **Then** they see the maximum loan amount they can afford
2. **Given** a user wants to find the interest rate for a specific payment, **When** they enter loan amount, payment, and term, **Then** they see the required interest rate
3. **Given** a user wants to optimize their loan term, **When** they enter loan amount, payment, and interest rate, **Then** they see the calculated loan term

---

### User Story 5 - Mobile-Friendly Interface (Priority: P3)

A user wants to access the mortgage calculator on their mobile device with the same functionality and ease of use as the desktop version.

**Why this priority**: Mobile accessibility ensures the tool is available when users need it most, such as during property visits or when discussing options with lenders.

**Independent Test**: Can be fully tested by accessing the calculator on mobile devices and verifying all features work properly with touch interactions.

**Acceptance Scenarios**:

1. **Given** a user accesses the calculator on a mobile device, **When** they interact with the interface, **Then** all buttons and inputs are easily tappable and responsive
2. **Given** a user views comparison tables on mobile, **When** they scroll horizontally, **Then** the table remains readable and all data is accessible
3. **Given** a user switches between light and dark mode on mobile, **When** they toggle the theme, **Then** the interface adapts properly with good contrast and readability

---

### Edge Cases

- What happens when users enter extremely high loan amounts or interest rates in CAD?
- How does the system handle very long loan terms (50+ years) which may exceed Canadian mortgage regulations?
- What occurs when users enter zero or negative values for required fields?
- How does the system handle decimal precision in CAD calculations?
- What happens when users try to compare more than 5 scenarios simultaneously?
- How does the system handle very small extra payment amounts (less than CAD $1)?
- How does the system handle Canadian mortgage insurance requirements for high-ratio mortgages?
- What happens when users enter loan amounts that exceed typical Canadian property values?
- How does the system handle Canadian mortgage stress test scenarios?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate accurate monthly mortgage payments using standard PMT formula with CAD currency
- **FR-002**: System MUST support pre-payment calculations showing interest savings and payoff acceleration in CAD
- **FR-003**: Users MUST be able to add multiple mortgage scenarios to a comparison table
- **FR-004**: System MUST provide reverse calculation functionality (payment → loan amount, payment → interest rate) in CAD
- **FR-005**: System MUST display results in clear, tabular format with minimal verbose text and CAD currency formatting
- **FR-006**: System MUST support both light and dark mode themes
- **FR-007**: System MUST be fully responsive and mobile-friendly
- **FR-008**: System MUST validate all user inputs and provide clear error messages
- **FR-009**: System MUST display amortization schedules for selected scenarios with CAD currency
- **FR-010**: System MUST show total interest paid and total loan cost for each scenario in CAD
- **FR-011**: System MUST support different payment frequencies (monthly, bi-weekly, weekly) common in Canadian mortgages
- **FR-012**: System MUST provide clear explanations of Canadian mortgage payment options and calculations
- **FR-013**: System MUST be deployable as a static page on GitHub Pages
- **FR-014**: System MUST include comprehensive test coverage for all calculation functions using Canadian mortgage scenarios
- **FR-015**: System MUST implement CI/CD pipeline using GitHub Actions
- **FR-016**: System MUST format all monetary values using Canadian currency conventions (CAD $X,XXX.XX)
- **FR-017**: System MUST support Canadian mortgage terms and conditions (e.g., 25-year maximum amortization for high-ratio mortgages)

### Key Entities *(include if feature involves data)*

- **Mortgage Scenario**: Represents a complete mortgage calculation with loan amount, interest rate, term, and optional extra payments
- **Payment Schedule**: Represents the amortization breakdown showing principal, interest, and remaining balance for each payment period
- **Comparison Table**: Represents a collection of mortgage scenarios displayed side-by-side for analysis
- **Calculation Result**: Represents the output of any mortgage calculation including payment amount, total interest, and payoff date

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Canadian users can calculate basic mortgage payments in CAD in under 30 seconds from page load
- **SC-002**: All calculations are accurate to within CAD $0.01 when compared to industry-standard Canadian mortgage calculators
- **SC-003**: 95% of users can successfully add a scenario to comparison table on first attempt
- **SC-004**: Page loads completely in under 2 seconds on 3G mobile connections
- **SC-005**: 90% of users can complete pre-payment analysis without assistance
- **SC-006**: System supports comparison of up to 5 mortgage scenarios simultaneously
- **SC-007**: All features work identically across desktop and mobile devices
- **SC-008**: 100% of calculation functions pass automated testing against known Canadian mortgage calculation benchmarks
- **SC-009**: Users can toggle between light and dark modes without losing their entered data
- **SC-010**: Reverse calculations provide results within 1% accuracy of expected values in CAD
- **SC-011**: All monetary values display correctly in Canadian currency format (CAD $X,XXX.XX)
- **SC-012**: System validates Canadian mortgage constraints (e.g., maximum amortization periods) correctly