# GetCooked AI

Welcome to GetCooked AI, an innovative AI-powered interview preparation platform.

## Getting Started

Follow these steps to get the app running on your local machine:

1. Clone the repository:
```
git clone https://github.com/yourusername/getcooked_ai.git
cd getcooked_ai
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables: Create a .env file in the root directory and add the following:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Obtain Stripe API Keys:
Sign up for a Stripe account at https://stripe.com
Navigate to the Developers section
Find your API keys (Publishable key and Secret key)
Copy these keys into your .env file

5. Run the development server:
```
npm run dev
```

---------------

## FOR TESTING
1. use this command for manually select elements with PlayWright for logging in:
```
npx playwright codegen --save-storage=storageState.json http://localhost:3000
```

This will produce a storageState.json which will be used as the config for playwright.config.ts, which ensure security regarding sensitive log-in data. 

2. Performance testing.
```
npx playwright test tests/performance.spec.ts
```

or

To visually debug the test, you can run it in headed mode.
```
npx playwright test tests/performance.spec.ts --headed
```

To step through the test interactively, use:
```
npx playwright test tests/performance.spec.ts --debug
```

3. Component testing:
MainContent:
```
npm test -- __tests__/components/MainContent.test.tsx
```

user's codeExecution:
```
npx playwright test tests/codeExecution.spec.ts
```