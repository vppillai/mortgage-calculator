# Data Model: Canadian Mortgage Calculator

**Date**: 2025-01-27  
**Feature**: Canadian Mortgage Calculator Static Page App

## Overview

This document defines the data structures used in the Canadian Mortgage Calculator application. All entities are client-side JavaScript objects with no backend persistence beyond localStorage.

## Core Entities

### MortgageScenario

Represents a complete mortgage calculation scenario that can be saved and compared.

```javascript
{
  id: string,                    // UUID for unique identification
  name: string,                  // User-defined scenario name
  createdAt: Date,               // ISO 8601 timestamp
  loanDetails: {
    principal: number,           // Loan amount in CAD (validated > 0)
    interestRate: number,        // Annual interest rate as percentage (e.g., 5.25)
    amortizationMonths: number,  // Total loan term in months (max 300 for 25 years)
    paymentFrequency: string,    // "monthly" | "bi-weekly" | "weekly"
    startDate: Date,             // First payment date
  },
  prepaymentOptions: {
    enabled: boolean,            // Whether prepayments are active
    extraPaymentAmount: number,  // Additional payment amount in CAD
    extraPaymentFrequency: string, // "per-payment" | "annual" | "one-time"
    extraPaymentStartDate: Date, // When extra payments begin
  },
  calculationResults: CalculationResult, // Computed values (see below)
}
```

**Validation Rules**:
- `principal`: Must be positive, max $10,000,000
- `interestRate`: Must be between 0.01 and 30.00
- `amortizationMonths`: Must be between 12 and 300 (1-25 years)
- `paymentFrequency`: Must be one of allowed values
- `extraPaymentAmount`: Must be >= 0

### CalculationResult

Contains all computed values for a mortgage scenario.

```javascript
{
  regularPayment: number,        // Regular payment amount in CAD
  totalPayments: number,         // Total number of payments
  totalInterest: number,         // Total interest paid over life of loan
  totalCost: number,             // Principal + total interest
  payoffDate: Date,              // Final payment date
  
  // With prepayments (if applicable)
  prepayment: {
    actualPayoffDate: Date,      // Accelerated payoff date
    totalInterestSaved: number,  // Interest savings in CAD
    monthsSaved: number,         // Months reduced from original term
    totalCostWithPrepayment: number, // New total cost
  },
  
  // For display
  effectiveRate: number,         // Monthly/bi-weekly/weekly rate used
  amortizationSchedule: PaymentSchedule[], // Array of payments
}
```

### PaymentSchedule

Represents the amortization breakdown for each payment period.

```javascript
{
  paymentNumber: number,         // Sequential payment number
  paymentDate: Date,             // Date of this payment
  principalPayment: number,      // Principal portion in CAD
  interestPayment: number,       // Interest portion in CAD
  extraPayment: number,          // Extra payment amount (if any)
  totalPayment: number,          // Total payment for this period
  remainingBalance: number,      // Outstanding balance after payment
  cumulativeInterest: number,    // Total interest paid to date
  cumulativePrincipal: number,   // Total principal paid to date
}
```

### ComparisonTable

Collection of scenarios for side-by-side analysis.

```javascript
{
  id: string,                    // UUID for table instance
  name: string,                  // User-defined comparison name
  createdAt: Date,               // When comparison was created
  scenarios: MortgageScenario[], // Array of scenarios (max 5)
  sortBy: string,                // Current sort field
  sortOrder: string,             // "asc" | "desc"
  highlightBest: boolean,        // Whether to highlight best option
}
```

**Business Rules**:
- Maximum 5 scenarios per comparison
- Scenarios can be reordered via drag-and-drop
- Best option determined by lowest total cost

### ValidationError

Structured error information for user feedback.

```javascript
{
  field: string,                 // Field that failed validation
  value: any,                    // Invalid value provided
  message: string,               // User-friendly error message
  code: string,                  // Error code for programmatic handling
}
```

**Error Codes**:
- `INVALID_PRINCIPAL`: Principal amount validation failed
- `INVALID_RATE`: Interest rate out of range
- `INVALID_TERM`: Amortization period invalid
- `CALCULATION_ERROR`: Mathematical calculation failed
- `COMPARISON_FULL`: Cannot add more than 5 scenarios

## State Management

### ApplicationState

Top-level application state structure.

```javascript
{
  currentScenario: MortgageScenario,    // Active scenario being edited
  savedScenarios: MortgageScenario[],   // All saved scenarios
  activeComparison: ComparisonTable,    // Current comparison table
  userPreferences: {
    theme: string,                      // "light" | "dark" | "system"
    locale: string,                     // Always "en-CA" for now
    defaultPaymentFrequency: string,    // User's preferred frequency
    showAdvancedOptions: boolean,       // UI state
  },
  calculationHistory: {                 // For undo/redo
    past: MortgageScenario[],
    future: MortgageScenario[],
  }
}
```

## Data Flow

1. **Input → Validation → Calculation → Display**
   - User inputs are validated in real-time
   - Valid inputs trigger calculation
   - Results update UI immediately

2. **Persistence**
   - Scenarios saved to localStorage on user action
   - Comparison tables persist between sessions
   - User preferences auto-save

3. **Comparison Flow**
   - User calculates scenario
   - "Add to Comparison" creates/updates ComparisonTable
   - Table updates trigger re-sort if needed

## Canadian Mortgage Specifics

### Interest Calculation

Canadian mortgages use semi-annual compounding:

```javascript
monthlyRate = Math.pow(1 + annualRate / 200, 1/6) - 1;
```

### Payment Frequencies

Different frequencies affect the effective rate:
- Monthly: 12 payments/year
- Bi-weekly: 26 payments/year (not 24)
- Weekly: 52 payments/year

### Constraints

- High-ratio mortgages (LTV > 80%): Max 25-year amortization
- Conventional mortgages: Max 30-year amortization (for UI warning)
- Minimum down payment rules apply for validation messages

## Storage Schema

localStorage keys:
- `mortgage-calc-scenarios`: Array of saved MortgageScenario objects
- `mortgage-calc-comparisons`: Array of saved ComparisonTable objects
- `mortgage-calc-preferences`: User preferences object
- `mortgage-calc-current`: Current working scenario

## Data Validation Pipeline

1. **Field-level validation**: As user types
2. **Cross-field validation**: Before calculation
3. **Business rule validation**: Canadian mortgage rules
4. **Calculation validation**: Ensure results are reasonable

## Performance Considerations

- Amortization schedules are calculated on-demand
- Large schedules (300+ payments) use virtual scrolling
- Calculations run in Web Workers for non-blocking UI
- Results are memoized to prevent recalculation
