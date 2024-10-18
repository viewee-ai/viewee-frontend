import { Cloud, Lock, CreditCard, Database, Layout, Edit } from 'lucide-react';

const features = [
  {
    name: "Advanced Security",
    description: "Ensure your conversations are secure with robust multi-factor authentication and OAuth integration.",
    icon: Lock,
  },
  {
    name: "Flexible Billing Integration",
    description: "Easily manage subscriptions and payments through Stripe, ensuring a seamless billing experience.",
    icon: CreditCard,
  },
  {
    name: "Scalable AI Infrastructure",
    description: "Leverage scalable backend solutions to ensure your chatbot grows effortlessly with your user base.",
    icon: Database,
  },
  {
    name: "Dynamic Conversation Management",
    description: "Easily create and manage conversations with an intuitive interface designed for seamless interaction.",
    icon: Edit,
  },
  {
    name: "Customizable Chat Interface",
    description: "Design your chat window with modern UI components, offering a professional and engaging user experience.",
    icon: Layout,
  },
  {
    name: "Optimized Performance",
    description: "Built on cutting-edge technology, Converse AI ensures fast, responsive, and reliable conversations.",
    icon: Cloud,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green">Transform Your Conversations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Build Intelligent Chat Experiences Effortlessly
        </h1>
        <p className="mt-4 text-base leading-snug text-muted-foreground">
          Say goodbye to complex setups! With Converse AI, you can deploy a powerful AI-driven chat solution in minutes. Start now and elevate your user interactions effortlessly.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white dark:text-primary-green " />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
