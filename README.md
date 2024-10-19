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

## TODO LIST:
- [ ] Dashboards
- [ ] Assign question number and category to each question (level, difficultly etc)
- [ ] Connect to MongoDB for questions

