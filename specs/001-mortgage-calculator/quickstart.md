# Quickstart Guide: Canadian Mortgage Calculator

**Date**: 2025-01-27  
**Feature**: Canadian Mortgage Calculator Static Page App

## Overview

This guide provides quick testing scenarios and validation steps for the Canadian Mortgage Calculator application.

## Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- Node.js 18+ and npm 8+ for development
- Git for version control

## Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd mortgage-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test              # Unit tests
npm run test:e2e      # End-to-end tests

# Build for production
npm run build

# Preview production build
npm run preview
```

## Quick Test Scenarios

### Scenario 1: Basic Mortgage Calculation

**Purpose**: Verify core calculation accuracy

1. Open the calculator
2. Enter:
   - Loan Amount: $500,000
   - Interest Rate: 5.25%
   - Amortization: 25 years
   - Payment Frequency: Monthly
3. Click "Calculate"

**Expected Results**:
- Monthly Payment: ~$3,002.25
- Total Interest: ~$400,674.48
- Total Cost: ~$900,674.48

### Scenario 2: Pre-payment Analysis

**Purpose**: Test prepayment calculations

1. Complete Scenario 1
2. Enable prepayments
3. Enter extra payment: $500/month
4. View results

**Expected Results**:
- New payoff time: ~16.5 years (down from 25)
- Interest saved: ~$150,000+
- Months saved: ~102

### Scenario 3: Comparison Table

**Purpose**: Test multi-scenario comparison

1. Calculate 3 different scenarios:
   - Scenario A: $500K, 5.25%, 25 years
   - Scenario B: $500K, 4.75%, 25 years
   - Scenario C: $500K, 5.25%, 30 years
2. Add each to comparison
3. Sort by total interest

**Expected Results**:
- Table shows all 3 scenarios
- Sorting works correctly
- Best option highlighted

### Scenario 4: Reverse Calculation

**Purpose**: Test payment-to-principal calculation

1. Switch to reverse calculation mode
2. Enter:
   - Desired Payment: $2,500/month
   - Interest Rate: 5.25%
   - Amortization: 25 years
3. Calculate maximum loan

**Expected Results**:
- Maximum Loan: ~$416,569

### Scenario 5: Mobile Responsiveness

**Purpose**: Verify mobile experience

1. Open browser developer tools
2. Toggle device toolbar
3. Select iPhone 12 Pro
4. Test all features

**Expected Results**:
- All inputs accessible
- Comparison table scrollable
- Dark mode toggle visible
- No layout breaks

### Scenario 6: Dark Mode

**Purpose**: Test theme switching

1. Click theme toggle
2. Verify dark mode active
3. Perform calculation
4. Refresh page

**Expected Results**:
- Smooth theme transition
- All text readable
- Theme persists on refresh
- Charts/tables properly styled

## Validation Checklist

### Input Validation
- [ ] Negative values show error
- [ ] Zero principal shows error
- [ ] Interest rate >30% shows error
- [ ] Amortization >25 years shows warning for high-ratio
- [ ] Non-numeric input prevented

### Calculation Accuracy
- [ ] Results match Canadian mortgage calculators
- [ ] CAD currency formatting correct ($X,XXX.XX)
- [ ] No floating-point errors
- [ ] Prepayment savings accurate

### User Experience
- [ ] Page loads in <2 seconds
- [ ] Calculations instant (<100ms)
- [ ] Error messages clear
- [ ] Help tooltips available
- [ ] Keyboard navigation works

### Cross-Browser Testing
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

### Accessibility
- [ ] Screen reader announces results
- [ ] Keyboard-only navigation possible
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA

## Common Issues & Solutions

### Issue: Calculations seem wrong

**Solution**: Check that you're using Canadian mortgage rules:
- Interest compounds semi-annually, not monthly
- Bi-weekly means 26 payments/year, not 24

### Issue: Can't add to comparison

**Solution**: Maximum 5 scenarios allowed. Remove one first.

### Issue: Dark mode not saving

**Solution**: Check browser localStorage is enabled.

### Issue: Page loads slowly

**Solution**: Clear browser cache, check network connection.

## Performance Benchmarks

Target metrics for production:
- First Contentful Paint: <1.5s
- Time to Interactive: <2.0s
- Lighthouse Score: >90
- Bundle Size: <500KB

## Deployment Verification

After deployment to GitHub Pages:

1. Navigate to: `https://<username>.github.io/mortgage-calculator/`
2. Test all scenarios above
3. Verify PWA installation prompt
4. Test offline functionality
5. Check browser console for errors

## Support & Documentation

- Feature Specification: [spec.md](./spec.md)
- Implementation Plan: [plan.md](./plan.md)
- Data Model: [data-model.md](./data-model.md)
- API Contracts: [contracts/](./contracts/)

## Next Steps

1. Run through all test scenarios
2. Report any bugs via GitHub Issues
3. Suggest enhancements
4. Review accessibility with screen reader
