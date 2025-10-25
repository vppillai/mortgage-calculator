# Mortgage Prepayment Calculator

A comprehensive static web application for analyzing mortgage prepayment strategies and comparing different payment options.

## Features

- **Accurate Calculations**: Supports multiple compounding methods (semi-annual by default)
- **Multi-Currency Ready**: Currently configured for CAD but easily adaptable
- **Prepayment Analysis**: Visualize how extra payments reduce interest and loan duration
- **Unlimited Scenario Comparison**: Compare multiple payment strategies with scrollable table
- **Share Functionality**: Generate compact URLs to share your mortgage scenarios
- **Expression Evaluation**: Enter calculations directly in payment fields
- **Mobile Responsive**: Works perfectly on all devices
- **Dark/Light Mode**: Comfortable viewing in any environment
- **Offline Capable**: PWA functionality for offline use
- **Accurate to $0.01**: Uses decimal.js for precision financial calculations

## Tech Stack

- **Framework**: Vanilla JavaScript ES6+ (no framework dependencies)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Math Library**: decimal.js for precise calculations
- **Deployment**: GitHub Pages with GitHub Actions CI/CD

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mortgage-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
mortgage-calculator/
├── src/
│   ├── components/      # UI components
│   ├── services/        # Business logic
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions
│   ├── workers/         # Web Workers
│   └── main.js          # Entry point
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
├── public/              # Static assets
└── dist/                # Build output
```

## Canadian Mortgage Rules

This calculator follows Canadian mortgage regulations:

- **Semi-annual compounding**: Interest compounds twice per year
- **High-ratio mortgages**: Max 25-year amortization (>80% LTV)
- **Conventional mortgages**: Max 30-year amortization (≤80% LTV)
- **Payment frequencies**: Monthly, bi-weekly (26/year), weekly (52/year)

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Author

Canadian Mortgage Calculator Team

**Note**: This calculator is for informational purposes only. Consult with a financial advisor for official mortgage calculations.

