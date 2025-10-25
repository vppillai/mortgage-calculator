# Contributing to Canadian Mortgage Calculator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes
7. Push to your fork
8. Create a Pull Request

## Development Workflow

### Before You Start

```bash
npm install
npm run dev
```

### While Developing

```bash
# Run tests in watch mode
npm test -- --watch

# Check linting
npm run lint

# Format code
npm run format
```

### Before Committing

```bash
# Run all tests
npm test
npm run test:e2e

# Check code quality
npm run lint

# Build to verify
npm run build
```

## Code Standards

### JavaScript

- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

### CSS

- Use Tailwind utility classes
- Follow mobile-first approach
- Support dark mode
- Ensure accessibility

### Tests

- Write tests for new features
- Follow TDD when possible
- Aim for >80% coverage
- Test edge cases

## Commit Messages

Follow conventional commits:

```
feat: add prepayment calculator
fix: correct interest calculation
docs: update README
test: add tests for validation
style: format code
refactor: simplify calculator logic
perf: optimize amortization generation
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update IMPLEMENTATION_STATUS.md
5. Request review

## Testing Guidelines

### Unit Tests

- Test individual functions
- Mock external dependencies
- Cover edge cases
- Use descriptive test names

### Integration Tests

- Test component interactions
- Verify data flow
- Test error handling

### E2E Tests

- Test complete user journeys
- Test on multiple browsers
- Test mobile responsiveness

## Financial Calculations

When modifying calculation logic:

1. Document the formula with sources
2. Add comprehensive tests
3. Cross-validate with known values
4. Ensure $0.01 accuracy
5. Follow Canadian mortgage standards

## Accessibility

- Use semantic HTML
- Add ARIA labels
- Test with keyboard only
- Test with screen reader
- Ensure color contrast

## Performance

- Keep bundle size <5MB
- Page load <2s on 3G
- 60fps animations
- Use Web Workers for heavy calculations

## Questions?

- Open an issue for discussion
- Check existing issues first
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉

